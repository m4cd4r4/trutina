from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.trial import TrialAccount, generate_access_code

router = APIRouter(prefix="/api/v1/trial", tags=["trial"])


class ProvisionRequest(BaseModel):
    name: str
    email: EmailStr
    company: str | None = None


class ProvisionResponse(BaseModel):
    access_code: str
    email: str
    is_new: bool


class ValidateRequest(BaseModel):
    access_code: str


class ValidateResponse(BaseModel):
    email: str
    name: str
    credits_remaining: int
    credits_used: int


@router.post("/provision", response_model=ProvisionResponse)
async def provision_trial(body: ProvisionRequest, db: AsyncSession = Depends(get_db)):
    email_lower = body.email.lower().strip()

    result = await db.execute(
        select(TrialAccount).where(TrialAccount.email == email_lower)
    )
    existing = result.scalar_one_or_none()

    if existing:
        return ProvisionResponse(
            access_code=existing.access_code,
            email=existing.email,
            is_new=False,
        )

    account = TrialAccount(
        email=email_lower,
        name=body.name.strip(),
        company=body.company.strip() if body.company else None,
    )
    db.add(account)
    await db.commit()
    await db.refresh(account)

    return ProvisionResponse(
        access_code=account.access_code,
        email=account.email,
        is_new=True,
    )


class ResendRequest(BaseModel):
    email: EmailStr


class ResendResponse(BaseModel):
    access_code: str
    name: str
    email: str


@router.post("/resend", response_model=ResendResponse)
async def resend_access_code(body: ResendRequest, db: AsyncSession = Depends(get_db)):
    email_lower = body.email.lower().strip()

    result = await db.execute(
        select(TrialAccount).where(TrialAccount.email == email_lower)
    )
    account = result.scalar_one_or_none()

    if not account or not account.is_active:
        raise HTTPException(status_code=404, detail="No account found for this email")

    return ResendResponse(
        access_code=account.access_code,
        name=account.name,
        email=account.email,
    )


@router.post("/validate", response_model=ValidateResponse)
async def validate_access_code(body: ValidateRequest, db: AsyncSession = Depends(get_db)):
    code = body.access_code.strip().upper()

    result = await db.execute(
        select(TrialAccount).where(TrialAccount.access_code == code)
    )
    account = result.scalar_one_or_none()

    if not account or not account.is_active:
        raise HTTPException(status_code=401, detail="Invalid access code")

    account.last_login_at = datetime.now(tz=timezone.utc)
    await db.commit()

    return ValidateResponse(
        email=account.email,
        name=account.name,
        credits_remaining=account.credits_remaining,
        credits_used=account.credits_used,
    )
