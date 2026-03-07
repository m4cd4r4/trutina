import uuid
from datetime import date, datetime
from decimal import Decimal
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.auth import get_tenant_id
from app.core.database import get_db
from app.models.case import AuditEvent, BrokerProfile, Case, CaseDocument, FraudFlag

router = APIRouter(prefix="/api/v1/cases", tags=["cases"])


# --- Schemas ---

class CaseCreate(BaseModel):
    applicant_name: str | None = None
    applicant_dob: date | None = None
    loan_amount: Decimal | None = None
    property_address: str | None = None
    broker_name: str | None = None
    broker_abn: str | None = None
    broker_license: str | None = None


class FlagOut(BaseModel):
    id: uuid.UUID
    category: str
    code: str
    title: str
    description: str
    severity: str
    weight: int
    evidence: dict
    document_id: uuid.UUID | None


class DocSummary(BaseModel):
    id: uuid.UUID
    doc_type: str
    filename: str
    status: str
    page_count: int | None


class BrokerSummary(BaseModel):
    id: uuid.UUID
    broker_name: str
    broker_abn: str | None
    risk_score: int


class CaseSummary(BaseModel):
    id: uuid.UUID
    reference: str
    applicant_name: str | None
    loan_amount: float | None
    status: str
    risk_score: int | None
    risk_level: str | None
    recommended_action: str | None
    submitted_at: datetime
    analysed_at: datetime | None
    broker: BrokerSummary | None
    document_count: int
    flag_counts: dict[str, int]


class CaseDetail(CaseSummary):
    property_address: str | None
    summary: str | None
    documents: list[DocSummary]
    flags: list[FlagOut]


ALLOWED_STATUSES = {"pending", "processing", "complete", "failed", "flagged_for_review"}


class CasePatch(BaseModel):
    status: str | None = None
    notes: str | None = None


# --- Helpers ---

def _flag_counts(flags: list) -> dict[str, int]:
    counts: dict[str, int] = {"critical": 0, "high": 0, "medium": 0, "low": 0}
    for f in flags:
        counts[f.severity] = counts.get(f.severity, 0) + 1
    return counts


async def _get_or_create_broker(db: AsyncSession, name: str, abn: str | None, license_num: str | None) -> BrokerProfile:
    if abn:
        result = await db.execute(select(BrokerProfile).where(BrokerProfile.broker_abn == abn))
        existing = result.scalar_one_or_none()
        if existing:
            existing.submission_count += 1
            existing.last_seen_at = datetime.utcnow()
            return existing

    broker = BrokerProfile(broker_name=name, broker_abn=abn, broker_license=license_num)
    db.add(broker)
    await db.flush()
    return broker


async def _generate_reference(db: AsyncSession) -> str:
    result = await db.execute(select(func.count()).select_from(Case))
    count = result.scalar() or 0
    year = datetime.utcnow().year
    return f"LL-{year}-{str(count + 1).zfill(5)}"


# --- Routes ---

@router.post("", response_model=CaseSummary, status_code=status.HTTP_201_CREATED)
async def create_case(body: CaseCreate, db: AsyncSession = Depends(get_db), tenant_id: uuid.UUID | None = Depends(get_tenant_id)):
    broker = None
    if body.broker_name:
        broker = await _get_or_create_broker(db, body.broker_name, body.broker_abn, body.broker_license)

    reference = await _generate_reference(db)
    case = Case(
        reference=reference,
        applicant_name=body.applicant_name,
        applicant_dob=body.applicant_dob,
        loan_amount=body.loan_amount,
        property_address=body.property_address,
        broker_id=broker.id if broker else None,
        tenant_id=tenant_id,
    )
    db.add(case)
    db.add(AuditEvent(case_id=None, event_type="case_created", detail={"reference": reference}))
    await db.commit()
    await db.refresh(case)

    return CaseSummary(
        id=case.id, reference=case.reference, applicant_name=case.applicant_name,
        loan_amount=float(case.loan_amount) if case.loan_amount else None,
        status=case.status, risk_score=case.risk_score, risk_level=case.risk_level,
        recommended_action=case.recommended_action, submitted_at=case.submitted_at,
        analysed_at=case.analysed_at,
        broker=BrokerSummary(id=broker.id, broker_name=broker.broker_name, broker_abn=broker.broker_abn, risk_score=broker.risk_score) if broker else None,
        document_count=0, flag_counts={"critical": 0, "high": 0, "medium": 0, "low": 0},
    )


@router.get("", response_model=list[CaseSummary])
async def list_cases(
    status_filter: str | None = Query(None, alias="status"),
    risk_level: str | None = None,
    limit: int = Query(50, le=200),
    skip: int = 0,
    db: AsyncSession = Depends(get_db),
    tenant_id: uuid.UUID | None = Depends(get_tenant_id),
):
    q = select(Case).options(
        selectinload(Case.broker),
        selectinload(Case.documents),
        selectinload(Case.flags),
    ).order_by(Case.submitted_at.desc()).limit(limit).offset(skip)

    if tenant_id:
        q = q.where(Case.tenant_id == tenant_id)
    if status_filter:
        q = q.where(Case.status == status_filter)
    if risk_level:
        q = q.where(Case.risk_level == risk_level)

    result = await db.execute(q)
    cases = result.scalars().all()

    return [
        CaseSummary(
            id=c.id, reference=c.reference, applicant_name=c.applicant_name,
            loan_amount=float(c.loan_amount) if c.loan_amount else None,
            status=c.status, risk_score=c.risk_score, risk_level=c.risk_level,
            recommended_action=c.recommended_action, submitted_at=c.submitted_at,
            analysed_at=c.analysed_at,
            broker=BrokerSummary(id=c.broker.id, broker_name=c.broker.broker_name, broker_abn=c.broker.broker_abn, risk_score=c.broker.risk_score) if c.broker else None,
            document_count=len(c.documents),
            flag_counts=_flag_counts(c.flags),
        )
        for c in cases
    ]


@router.get("/{case_id}", response_model=CaseDetail)
async def get_case(case_id: uuid.UUID, db: AsyncSession = Depends(get_db), tenant_id: uuid.UUID | None = Depends(get_tenant_id)):
    q = select(Case).options(
        selectinload(Case.broker),
        selectinload(Case.documents),
        selectinload(Case.flags),
    ).where(Case.id == case_id)
    if tenant_id:
        q = q.where(Case.tenant_id == tenant_id)
    result = await db.execute(q)
    case = result.scalar_one_or_none()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    return CaseDetail(
        id=case.id, reference=case.reference, applicant_name=case.applicant_name,
        loan_amount=float(case.loan_amount) if case.loan_amount else None,
        property_address=case.property_address, summary=case.summary,
        status=case.status, risk_score=case.risk_score, risk_level=case.risk_level,
        recommended_action=case.recommended_action, submitted_at=case.submitted_at,
        analysed_at=case.analysed_at,
        broker=BrokerSummary(id=case.broker.id, broker_name=case.broker.broker_name, broker_abn=case.broker.broker_abn, risk_score=case.broker.risk_score) if case.broker else None,
        document_count=len(case.documents),
        flag_counts=_flag_counts(case.flags),
        documents=[DocSummary(id=d.id, doc_type=d.doc_type, filename=d.filename, status=d.status, page_count=d.page_count) for d in case.documents],
        flags=[FlagOut(id=f.id, category=f.category, code=f.code, title=f.title, description=f.description, severity=f.severity, weight=f.weight, evidence=f.evidence or {}, document_id=f.document_id) for f in case.flags],
    )


@router.patch("/{case_id}")
async def patch_case(case_id: uuid.UUID, body: CasePatch, db: AsyncSession = Depends(get_db), tenant_id: uuid.UUID | None = Depends(get_tenant_id)):
    q = select(Case).where(Case.id == case_id)
    if tenant_id:
        q = q.where(Case.tenant_id == tenant_id)
    result = await db.execute(q)
    case = result.scalar_one_or_none()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    if body.status:
        if body.status not in ALLOWED_STATUSES:
            raise HTTPException(status_code=400, detail=f"Invalid status. Allowed: {', '.join(sorted(ALLOWED_STATUSES))}")
        case.status = body.status
    if body.notes:
        case.metadata_["notes"] = body.notes[:2000]

    db.add(AuditEvent(case_id=case_id, event_type="case_updated", detail=body.model_dump(exclude_none=True)))
    await db.commit()
    return {"ok": True}


@router.get("/{case_id}/audit")
async def get_audit(case_id: uuid.UUID, db: AsyncSession = Depends(get_db), tenant_id: uuid.UUID | None = Depends(get_tenant_id)):
    # Verify case belongs to tenant before showing audit trail
    q = select(Case.id).where(Case.id == case_id)
    if tenant_id:
        q = q.where(Case.tenant_id == tenant_id)
    case_check = await db.execute(q)
    if not case_check.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Case not found")

    result = await db.execute(
        select(AuditEvent)
        .where(AuditEvent.case_id == case_id)
        .order_by(AuditEvent.occurred_at.asc())
    )
    events = result.scalars().all()
    return [{"id": str(e.id), "event_type": e.event_type, "actor": e.actor, "detail": e.detail, "occurred_at": e.occurred_at} for e in events]
