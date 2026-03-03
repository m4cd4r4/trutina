import secrets
import string
import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.core.database import Base

SAFE_CHARS = ''.join(c for c in string.ascii_uppercase + string.digits if c not in 'O0I1L')


def generate_access_code() -> str:
    body = ''.join(secrets.choice(SAFE_CHARS) for _ in range(8))
    return f"TRUT-{body[:4]}-{body[4:]}"


class TrialAccount(Base):
    __tablename__ = "trial_accounts"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(Text, unique=True, nullable=False)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    company: Mapped[str | None] = mapped_column(Text)
    access_code: Mapped[str] = mapped_column(Text, unique=True, nullable=False, default=generate_access_code)
    credits_remaining: Mapped[int] = mapped_column(Integer, default=5)
    credits_used: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    last_login_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
