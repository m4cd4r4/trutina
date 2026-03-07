import uuid
from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import JSON, NUMERIC, TEXT, VARCHAR, Date, DateTime, ForeignKey, SmallInteger
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.core.database import Base


class BrokerProfile(Base):
    __tablename__ = "broker_profiles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    broker_name: Mapped[str] = mapped_column(TEXT, nullable=False)
    broker_abn: Mapped[str | None] = mapped_column(TEXT, unique=True)
    broker_license: Mapped[str | None] = mapped_column(TEXT)
    submission_count: Mapped[int] = mapped_column(default=0)
    fraud_flag_count: Mapped[int] = mapped_column(default=0)
    risk_score: Mapped[int] = mapped_column(SmallInteger, default=0)
    network_flags: Mapped[dict] = mapped_column(JSON, default=dict)
    first_seen_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    last_seen_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    cases: Mapped[list["Case"]] = relationship("Case", back_populates="broker")


class Case(Base):
    __tablename__ = "cases"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    reference: Mapped[str] = mapped_column(TEXT, unique=True, nullable=False)
    applicant_name: Mapped[str | None] = mapped_column(TEXT)
    applicant_dob: Mapped[date | None] = mapped_column(Date)
    loan_amount: Mapped[Decimal | None] = mapped_column(NUMERIC(15, 2))
    property_address: Mapped[str | None] = mapped_column(TEXT)
    broker_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("broker_profiles.id"))
    tenant_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("trial_accounts.id"), index=True)
    status: Mapped[str] = mapped_column(VARCHAR(32), default="pending")
    risk_score: Mapped[int | None] = mapped_column(SmallInteger)
    risk_level: Mapped[str | None] = mapped_column(VARCHAR(16))
    recommended_action: Mapped[str | None] = mapped_column(VARCHAR(32))
    summary: Mapped[str | None] = mapped_column(TEXT)
    submitted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    analysed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    metadata_: Mapped[dict] = mapped_column("metadata", JSON, default=dict)

    broker: Mapped["BrokerProfile | None"] = relationship("BrokerProfile", back_populates="cases")
    documents: Mapped[list["CaseDocument"]] = relationship("CaseDocument", back_populates="case", cascade="all, delete-orphan")
    flags: Mapped[list["FraudFlag"]] = relationship("FraudFlag", back_populates="case", cascade="all, delete-orphan")
    audit_events: Mapped[list["AuditEvent"]] = relationship("AuditEvent", back_populates="case", cascade="all, delete-orphan")


class CaseDocument(Base):
    __tablename__ = "case_documents"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("cases.id", ondelete="CASCADE"), nullable=False)
    doc_type: Mapped[str] = mapped_column(VARCHAR(32), default="other")
    filename: Mapped[str] = mapped_column(TEXT, nullable=False)
    file_path: Mapped[str] = mapped_column(TEXT, nullable=False)
    file_size: Mapped[int | None] = mapped_column()
    mime_type: Mapped[str | None] = mapped_column(TEXT)
    page_count: Mapped[int | None] = mapped_column()
    ocr_text: Mapped[str | None] = mapped_column(TEXT)
    pdf_metadata: Mapped[dict] = mapped_column(JSON, default=dict)
    status: Mapped[str] = mapped_column(TEXT, default="pending")
    uploaded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    processed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    case: Mapped["Case"] = relationship("Case", back_populates="documents")
    flags: Mapped[list["FraudFlag"]] = relationship("FraudFlag", back_populates="document")


class FraudFlag(Base):
    __tablename__ = "fraud_flags"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("cases.id", ondelete="CASCADE"), nullable=False)
    document_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("case_documents.id", ondelete="CASCADE"))
    category: Mapped[str] = mapped_column(VARCHAR(32), nullable=False)
    code: Mapped[str] = mapped_column(TEXT, nullable=False)
    title: Mapped[str] = mapped_column(TEXT, nullable=False)
    description: Mapped[str] = mapped_column(TEXT, nullable=False)
    severity: Mapped[str] = mapped_column(VARCHAR(16), nullable=False)
    weight: Mapped[int] = mapped_column(SmallInteger, default=5)
    evidence: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    case: Mapped["Case"] = relationship("Case", back_populates="flags")
    document: Mapped["CaseDocument | None"] = relationship("CaseDocument", back_populates="flags")


class AuditEvent(Base):
    __tablename__ = "audit_events"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("cases.id"))
    event_type: Mapped[str] = mapped_column(TEXT, nullable=False)
    actor: Mapped[str] = mapped_column(TEXT, default="system")
    detail: Mapped[dict] = mapped_column(JSON, default=dict)
    occurred_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    case: Mapped["Case | None"] = relationship("Case", back_populates="audit_events")
