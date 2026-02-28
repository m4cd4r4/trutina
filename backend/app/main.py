from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import analyse, brokers, cases, documents, health
from app.core.auth import verify_api_key
from app.core.database import Base, engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()


app = FastAPI(
    title="MortgageShield API",
    description="AI-powered mortgage document fraud detection for Australian lenders",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Public
app.include_router(health.router)

# Protected
protected = {"dependencies": [Depends(verify_api_key)]}
app.include_router(cases.router, **protected)
app.include_router(documents.router, **protected)
app.include_router(analyse.router, **protected)
app.include_router(brokers.router, **protected)
