import logging
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, EmailStr
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.models.trial import TrialAccount, generate_access_code

logger = logging.getLogger("trutina.trial")

router = APIRouter(prefix="/api/v1/trial", tags=["trial"])

limiter = Limiter(key_func=get_remote_address)


class ProvisionRequest(BaseModel):
    name: str
    email: EmailStr
    company: str | None = None


class ProvisionResponse(BaseModel):
    access_code: str
    email: str


class ValidateRequest(BaseModel):
    access_code: str


class ValidateResponse(BaseModel):
    id: str
    email: str
    name: str
    credits_remaining: int
    credits_used: int


@router.post("/provision", response_model=ProvisionResponse)
@limiter.limit("10/minute")
async def provision_trial(request: Request, body: ProvisionRequest, db: AsyncSession = Depends(get_db)):
    email_lower = body.email.lower().strip()

    result = await db.execute(
        select(TrialAccount).where(TrialAccount.email == email_lower)
    )
    existing = result.scalar_one_or_none()

    if existing:
        return ProvisionResponse(
            access_code=existing.access_code,
            email=existing.email,
        )

    expires_at = datetime.now(tz=timezone.utc) + timedelta(days=settings.trial_expiry_days)
    account = TrialAccount(
        email=email_lower,
        name=body.name.strip()[:255],
        company=body.company.strip()[:255] if body.company else None,
        expires_at=expires_at,
    )
    db.add(account)
    await db.commit()
    await db.refresh(account)

    return ProvisionResponse(
        access_code=account.access_code,
        email=account.email,
    )


class ResendRequest(BaseModel):
    email: EmailStr


class ResendResponse(BaseModel):
    message: str
    access_code: str | None = None
    name: str | None = None


@router.post("/resend", response_model=ResendResponse)
@limiter.limit("3/minute")
async def resend_access_code(request: Request, body: ResendRequest, db: AsyncSession = Depends(get_db)):
    email_lower = body.email.lower().strip()
    message = "If an account exists for this email, the access code will be sent shortly."

    result = await db.execute(
        select(TrialAccount).where(TrialAccount.email == email_lower)
    )
    account = result.scalar_one_or_none()

    if not account or not account.is_active:
        logger.info("RESEND_ATTEMPT email=%s found=%s", email_lower, account is not None)
        # Return same HTTP status and message to prevent email enumeration
        return ResendResponse(message=message)

    return ResendResponse(message=message, access_code=account.access_code, name=account.name)


@router.post("/validate", response_model=ValidateResponse)
@limiter.limit(settings.rate_limit_auth)
async def validate_access_code(request: Request, body: ValidateRequest, db: AsyncSession = Depends(get_db)):
    code = body.access_code.strip().upper()
    client_ip = request.client.host if request.client else "unknown"

    result = await db.execute(
        select(TrialAccount).where(TrialAccount.access_code == code)
    )
    account = result.scalar_one_or_none()

    if not account or not account.is_active:
        logger.warning("VALIDATE_FAILURE ip=%s code_prefix=%s", client_ip, code[:4] if len(code) >= 4 else "???")
        raise HTTPException(status_code=401, detail="Invalid access code")

    # Check expiry - same error message as invalid to prevent code enumeration
    if account.expires_at and account.expires_at < datetime.now(tz=timezone.utc):
        logger.info("VALIDATE_EXPIRED ip=%s email=%s", client_ip, account.email)
        raise HTTPException(status_code=401, detail="Invalid access code")

    account.last_login_at = datetime.now(tz=timezone.utc)
    await db.commit()

    logger.info("VALIDATE_SUCCESS ip=%s email=%s", client_ip, account.email)

    return ValidateResponse(
        id=str(account.id),
        email=account.email,
        name=account.name,
        credits_remaining=account.credits_remaining,
        credits_used=account.credits_used,
    )
