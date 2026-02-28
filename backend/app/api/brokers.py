import uuid

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.models.case import BrokerProfile, Case

router = APIRouter(prefix="/api/v1/brokers", tags=["brokers"])


@router.get("")
async def list_brokers(
    limit: int = Query(50, le=200),
    skip: int = 0,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(BrokerProfile)
        .order_by(BrokerProfile.risk_score.desc())
        .limit(limit)
        .offset(skip)
    )
    brokers = result.scalars().all()
    return [
        {
            "id": str(b.id), "broker_name": b.broker_name, "broker_abn": b.broker_abn,
            "broker_license": b.broker_license, "submission_count": b.submission_count,
            "fraud_flag_count": b.fraud_flag_count, "risk_score": b.risk_score,
            "first_seen_at": b.first_seen_at, "last_seen_at": b.last_seen_at,
        }
        for b in brokers
    ]


@router.get("/{broker_id}")
async def get_broker(broker_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(BrokerProfile)
        .options(selectinload(BrokerProfile.cases))
        .where(BrokerProfile.id == broker_id)
    )
    b = result.scalar_one_or_none()
    if not b:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Broker not found")

    return {
        "id": str(b.id), "broker_name": b.broker_name, "broker_abn": b.broker_abn,
        "broker_license": b.broker_license, "submission_count": b.submission_count,
        "fraud_flag_count": b.fraud_flag_count, "risk_score": b.risk_score,
        "network_flags": b.network_flags,
        "first_seen_at": b.first_seen_at, "last_seen_at": b.last_seen_at,
        "recent_case_count": len(b.cases),
    }


@router.get("/{broker_id}/cases")
async def broker_cases(
    broker_id: uuid.UUID,
    limit: int = Query(50, le=200),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Case)
        .where(Case.broker_id == broker_id)
        .order_by(Case.submitted_at.desc())
        .limit(limit)
    )
    cases = result.scalars().all()
    return [
        {
            "id": str(c.id), "reference": c.reference, "applicant_name": c.applicant_name,
            "status": c.status, "risk_score": c.risk_score, "risk_level": c.risk_level,
            "submitted_at": c.submitted_at,
        }
        for c in cases
    ]
