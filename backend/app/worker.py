"""
Celery Worker — MortgageShield Analysis Pipeline
"""
from __future__ import annotations

import asyncio
import uuid
from datetime import datetime, timezone
from pathlib import Path

import fitz
from celery import Celery
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.analysers import ai_detector, consistency_checker, cross_reference, pdf_forensics, risk_scorer
from app.analysers.pdf_forensics import Flag
from app.core.config import settings
from app.core.database import AsyncSessionLocal
from app.models.case import AuditEvent, Case, CaseDocument, FraudFlag

celery_app = Celery(
    "mortgageshield",
    broker=settings.redis_url,
    backend=settings.redis_url,
)
celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="Australia/Sydney",
    enable_utc=True,
)


def _extract_text_and_metadata(file_path: str) -> tuple[str, dict, int]:
    """Extract OCR text, PDF metadata, and page count using PyMuPDF."""
    try:
        doc = fitz.open(file_path)
        meta = doc.metadata or {}
        page_count = len(doc)
        text = "\n".join(page.get_text("text") for page in doc)
        doc.close()
        return text, meta, page_count
    except Exception:
        return "", {}, 0


def _flags_to_db(
    flags: list[Flag],
    case_id: uuid.UUID,
    document_id: uuid.UUID | None = None,
) -> list[FraudFlag]:
    rows = []
    for f in flags:
        doc_uuid = None
        if f.document_id:
            try:
                doc_uuid = uuid.UUID(str(f.document_id))
            except ValueError:
                pass
        elif document_id:
            doc_uuid = document_id

        rows.append(FraudFlag(
            case_id=case_id,
            document_id=doc_uuid,
            category=f.category,
            code=f.code,
            title=f.title,
            description=f.description,
            severity=f.severity,
            weight=f.weight,
            evidence=f.evidence or {},
        ))
    return rows


async def _run_pipeline(case_id: str) -> None:
    case_uuid = uuid.UUID(case_id)

    async with AsyncSessionLocal() as db:
        # Mark as processing
        await db.execute(
            update(Case)
            .where(Case.id == case_uuid)
            .values(status="processing")
        )
        await db.commit()

        await _audit(db, case_uuid, "analysis_started")

        try:
            # Load documents
            result = await db.execute(select(CaseDocument).where(CaseDocument.case_id == case_uuid))
            documents = result.scalars().all()

            all_flags: list[FraudFlag] = []
            payslip_fields: dict = {}
            bank_fields: dict = {}
            bank_transactions: list[dict] = []

            for doc in documents:
                ocr_text, pdf_meta, page_count = _extract_text_and_metadata(doc.file_path)

                # Update document with extracted data
                doc.ocr_text = ocr_text
                doc.pdf_metadata = pdf_meta
                doc.page_count = page_count
                doc.status = "processed"
                doc.processed_at = datetime.now(tz=timezone.utc)
                await db.flush()

                doc_id_str = str(doc.id)

                # 1. PDF forensics
                forensic_flags = pdf_forensics.analyse(doc.file_path, doc.doc_type, doc_id_str)
                all_flags.extend(_flags_to_db(forensic_flags, case_uuid, doc.id))
                await _audit(db, case_uuid, "pdf_forensics_complete", {"document_id": doc_id_str, "flag_count": len(forensic_flags)})

                # 2. Claude AI detector
                ai_flags, extracted = await ai_detector.analyse(ocr_text, doc.doc_type, doc_id_str)
                all_flags.extend(_flags_to_db(ai_flags, case_uuid, doc.id))
                await _audit(db, case_uuid, "ai_analysis_complete", {"document_id": doc_id_str, "flag_count": len(ai_flags)})

                # Stash extracted fields for consistency checking
                if doc.doc_type == "payslip":
                    payslip_fields = extracted
                elif doc.doc_type == "bank_statement":
                    bank_fields = extracted
                    bank_transactions = extracted.get("transactions", [])

                # 3. Consistency checker
                if doc.doc_type == "payslip" and extracted:
                    consistency_flags = consistency_checker.check_payslip(extracted, ocr_text, doc_id_str)
                    all_flags.extend(_flags_to_db(consistency_flags, case_uuid, doc.id))
                elif doc.doc_type == "bank_statement" and extracted:
                    consistency_flags = consistency_checker.check_bank_statement(
                        extracted, bank_transactions, doc_id_str
                    )
                    all_flags.extend(_flags_to_db(consistency_flags, case_uuid, doc.id))

                # 4. Cross-reference (ABN, BSB)
                abn = extracted.get("employer_abn")
                employer = extracted.get("employer_name")
                if abn:
                    abn_flags = await cross_reference.check_abn(abn, employer or "", doc_id_str)
                    all_flags.extend(_flags_to_db(abn_flags, case_uuid, doc.id))

                bsb = extracted.get("bsb")
                if bsb:
                    bsb_flags = cross_reference.check_bsb(bsb, doc_id_str)
                    all_flags.extend(_flags_to_db(bsb_flags, case_uuid, doc.id))

                income = payslip_fields.get("gross_pay") or payslip_fields.get("gross_annual")
                if income:
                    try:
                        income_float = float(str(income).replace(",", ""))
                    except ValueError:
                        income_float = 0.0
                    if income_float:
                        income_flags = cross_reference.check_income_plausibility(
                            income_float, payslip_fields.get("occupation"), doc_id_str
                        )
                        all_flags.extend(_flags_to_db(income_flags, case_uuid, doc.id))

            # 5. Cross-document income consistency
            if payslip_fields and bank_transactions:
                cross_flags = consistency_checker.cross_document_income_check(
                    payslip_fields, bank_fields, bank_transactions
                )
                all_flags.extend(_flags_to_db(cross_flags, case_uuid))

            # Persist all flags
            db.add_all(all_flags)
            await db.flush()

            # 6. Score
            plain_flags = [
                pdf_forensics.Flag(
                    category=f.category, code=f.code, title=f.title,
                    description=f.description, severity=f.severity, weight=f.weight,
                    evidence=f.evidence or {},
                )
                for f in all_flags
            ]
            result_score = risk_scorer.score(plain_flags)

            new_status = "flagged_for_review" if result_score.score >= 20 else "complete"

            await db.execute(
                update(Case)
                .where(Case.id == case_uuid)
                .values(
                    status=new_status,
                    risk_score=result_score.score,
                    risk_level=result_score.risk_level,
                    recommended_action=result_score.recommended_action,
                    summary=result_score.summary,
                    analysed_at=datetime.now(tz=timezone.utc),
                )
            )
            await db.commit()
            await _audit(db, case_uuid, "analysis_complete", {
                "risk_score": result_score.score,
                "risk_level": result_score.risk_level,
                "flag_count": len(all_flags),
            })

        except Exception as exc:
            await db.execute(
                update(Case).where(Case.id == case_uuid).values(status="failed")
            )
            await db.commit()
            await _audit(db, case_uuid, "analysis_failed", {"error": str(exc)})
            raise


async def _audit(db: AsyncSession, case_id: uuid.UUID, event_type: str, detail: dict | None = None) -> None:
    db.add(AuditEvent(case_id=case_id, event_type=event_type, detail=detail or {}))
    await db.flush()


@celery_app.task(bind=True, max_retries=2, default_retry_delay=30)
def run_case_analysis(self, case_id: str):
    """Entry point: run the full analysis pipeline for a case."""
    try:
        asyncio.run(_run_pipeline(case_id))
    except Exception as exc:
        raise self.retry(exc=exc)
