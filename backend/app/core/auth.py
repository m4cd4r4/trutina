import logging
import uuid

from fastapi import HTTPException, Request, Security, status
from fastapi.security import APIKeyHeader

from app.core.config import settings

logger = logging.getLogger("trutina.auth")

api_key_header = APIKeyHeader(name="X-Api-Key", auto_error=False)


async def verify_api_key(request: Request, api_key: str = Security(api_key_header)):
    if not api_key or api_key != settings.trutina_api_key:
        client_ip = request.client.host if request.client else "unknown"
        logger.warning("AUTH_FAILURE ip=%s path=%s", client_ip, request.url.path)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API key",
        )
    return api_key


async def get_tenant_id(request: Request) -> uuid.UUID | None:
    """Extract tenant ID from X-Tenant-Id header. Returns None for admin users."""
    tenant_header = request.headers.get("x-tenant-id", "")
    if not tenant_header or tenant_header == "admin":
        return None
    try:
        return uuid.UUID(tenant_header)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid tenant ID")
