import base64
import shutil
import uuid
from datetime import date
from decimal import Decimal
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.case import AuditEvent, BrokerProfile, Case, CaseDocument
from app.worker import celery_app, run_case_analysis

router = APIRouter(prefix="/api/v1", tags=["analysis"])


@router.post("/cases/{case_id}/analyse")
async def trigger_analysis(case_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Case).where(Case.id == case_id))
    case = result.scalar_one_or_none()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    if case.status == "processing":
        raise HTTPException(status_code=409, detail="Analysis already in progress")

    task = run_case_analysis.delay(str(case_id))
    db.add(AuditEvent(case_id=case_id, event_type="analysis_queued", detail={"task_id": task.id}))
    await db.commit()

    return {"job_id": task.id, "case_id": str(case_id), "status": "queued"}


@router.get("/cases/{case_id}/analyse/status")
async def get_analysis_status(case_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Case).where(Case.id == case_id))
    case = result.scalar_one_or_none()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    return {
        "case_id": str(case_id),
        "status": case.status,
        "risk_score": case.risk_score,
        "risk_level": case.risk_level,
        "recommended_action": case.recommended_action,
        "analysed_at": case.analysed_at,
    }


# --- Webhook ingest (one-shot for bank API integration) ---

class WebhookDocument(BaseModel):
    filename: str
    doc_type: str = "other"
    content_base64: str


class BrokerInfo(BaseModel):
    name: str
    abn: str | None = None
    license: str | None = None


class WebhookIngestRequest(BaseModel):
    external_reference: str
    applicant_name: str | None = None
    applicant_dob: date | None = None
    loan_amount: Decimal | None = None
    property_address: str | None = None
    documents: list[WebhookDocument]
    broker: BrokerInfo | None = None


async def _or_create_broker(db: AsyncSession, info: BrokerInfo) -> BrokerProfile:
    if info.abn:
        res = await db.execute(select(BrokerProfile).where(BrokerProfile.broker_abn == info.abn))
        existing = res.scalar_one_or_none()
        if existing:
            existing.submission_count += 1
            await db.flush()
            return existing
    b = BrokerProfile(broker_name=info.name, broker_abn=info.abn, broker_license=info.license)
    db.add(b)
    await db.flush()
    return b


from sqlalchemy import func as sqlfunc


@router.post("/webhooks/ingest")
async def webhook_ingest(body: WebhookIngestRequest, db: AsyncSession = Depends(get_db)):
    """
    One-shot endpoint: accepts a full case with base64-encoded documents.
    Runs analysis synchronously (blocks until complete — suitable for <30s analysis).
    Returns risk score immediately.
    """
    # Generate reference
    count_res = await db.execute(select(sqlfunc.count()).select_from(Case))
    count = count_res.scalar() or 0
    from datetime import datetime
    reference = f"LL-{datetime.utcnow().year}-{str(count + 1).zfill(5)}"

    broker = None
    if body.broker:
        broker = await _or_create_broker(db, body.broker)

    case = Case(
        reference=reference,
        applicant_name=body.applicant_name,
        applicant_dob=body.applicant_dob,
        loan_amount=body.loan_amount,
        property_address=body.property_address,
        broker_id=broker.id if broker else None,
        metadata_={"external_reference": body.external_reference},
    )
    db.add(case)
    await db.flush()

    # Save documents
    upload_dir = Path("/uploads") / str(case.id)
    upload_dir.mkdir(parents=True, exist_ok=True)

    for doc_data in body.documents:
        file_bytes = base64.b64decode(doc_data.content_base64)
        file_id = uuid.uuid4()
        suffix = Path(doc_data.filename).suffix or ".pdf"
        dest = upload_dir / f"{file_id}{suffix}"
        dest.write_bytes(file_bytes)

        doc = CaseDocument(
            id=file_id, case_id=case.id,
            doc_type=doc_data.doc_type, filename=doc_data.filename,
            file_path=str(dest), file_size=len(file_bytes),
        )
        db.add(doc)

    db.add(AuditEvent(case_id=case.id, event_type="webhook_ingest", detail={"external_ref": body.external_reference}))
    await db.commit()

    # Trigger analysis and wait
    task = run_case_analysis.apply_async(args=[str(case.id)])
    task.get(timeout=120)  # Wait up to 2 minutes

    # Reload case with results
    await db.refresh(case)
    flags_res = await db.execute(
        select(CaseDocument).where(CaseDocument.case_id == case.id)
    )

    from app.models.case import FraudFlag
    flags_data = await db.execute(select(FraudFlag).where(FraudFlag.case_id == case.id))
    all_flags = flags_data.scalars().all()

    return {
        "case_id": str(case.id),
        "reference": reference,
        "risk_score": case.risk_score,
        "risk_level": case.risk_level,
        "recommended_action": case.recommended_action,
        "summary": case.summary,
        "flag_count": len(all_flags),
        "flags": [
            {"code": f.code, "title": f.title, "severity": f.severity, "category": f.category}
            for f in all_flags
        ],
        "analysed_at": case.analysed_at,
    }
