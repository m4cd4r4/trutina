import shutil
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.models.case import AuditEvent, Case, CaseDocument

router = APIRouter(prefix="/api/v1/cases", tags=["documents"])

ALLOWED_MIME = {"application/pdf", "image/jpeg", "image/png", "image/tiff"}
ALLOWED_DOC_TYPES = {"payslip", "bank_statement", "employment_letter", "tax_return", "id_document", "other"}


@router.post("/{case_id}/documents")
async def upload_documents(
    case_id: uuid.UUID,
    files: list[UploadFile],
    doc_type: str = "other",
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Case).where(Case.id == case_id))
    case = result.scalar_one_or_none()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    if doc_type not in ALLOWED_DOC_TYPES:
        doc_type = "other"

    upload_dir = Path(settings.upload_dir) / str(case_id)
    upload_dir.mkdir(parents=True, exist_ok=True)

    saved = []
    for file in files:
        if file.size and file.size > settings.max_upload_bytes:
            raise HTTPException(status_code=413, detail=f"{file.filename} exceeds 20MB limit")

        file_id = uuid.uuid4()
        suffix = Path(file.filename or "doc.pdf").suffix or ".pdf"
        dest = upload_dir / f"{file_id}{suffix}"

        with open(dest, "wb") as f:
            shutil.copyfileobj(file.file, f)

        doc = CaseDocument(
            id=file_id,
            case_id=case_id,
            doc_type=doc_type,
            filename=file.filename or "document",
            file_path=str(dest),
            file_size=dest.stat().st_size,
            mime_type=file.content_type,
        )
        db.add(doc)
        saved.append({"id": str(file_id), "filename": file.filename, "doc_type": doc_type})

    db.add(AuditEvent(case_id=case_id, event_type="documents_uploaded", detail={"count": len(saved), "doc_type": doc_type}))
    await db.commit()
    return {"uploaded": saved}


@router.get("/{case_id}/documents")
async def list_documents(case_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CaseDocument).where(CaseDocument.case_id == case_id))
    docs = result.scalars().all()
    return [
        {
            "id": str(d.id), "doc_type": d.doc_type, "filename": d.filename,
            "status": d.status, "page_count": d.page_count,
            "file_size": d.file_size, "uploaded_at": d.uploaded_at,
        }
        for d in docs
    ]
