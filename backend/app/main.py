import logging
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from app.api import analyse, brokers, cases, documents, health, trial
from app.core.auth import verify_api_key
from app.core.config import settings
from app.core.database import Base, engine
from app.models import trial as _trial_models  # noqa: F401 — registers table for create_all

logger = logging.getLogger("trutina")

limiter = Limiter(key_func=get_remote_address, default_limits=[settings.rate_limit_default])


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()


app = FastAPI(
    title="Trutina API",
    description="AI-powered mortgage document fraud detection for Australian lenders",
    version="1.0.0",
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

allowed_origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["X-Api-Key", "X-Tenant-Id", "Content-Type", "Authorization"],
)


@app.middleware("http")
async def security_headers(request: Request, call_next):
    # Reject oversized request bodies before processing (S8 hardening)
    content_length = request.headers.get("content-length")
    if content_length and int(content_length) > settings.max_webhook_payload_bytes:
        from fastapi.responses import JSONResponse
        return JSONResponse(status_code=413, content={"detail": "Request body too large"})

    response: Response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response


# Public
app.include_router(health.router)
app.include_router(trial.router)

# Protected
protected = {"dependencies": [Depends(verify_api_key)]}
app.include_router(cases.router, **protected)
app.include_router(documents.router, **protected)
app.include_router(analyse.router, **protected)
app.include_router(brokers.router, **protected)
