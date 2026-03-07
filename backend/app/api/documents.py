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
ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png", ".tiff", ".tif"}
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
        raise HTTPException(status_code=400, detail=f"Invalid document type. Allowed: {', '.join(sorted(ALLOWED_DOC_TYPES))}")

    upload_dir = Path(settings.upload_dir) / str(case_id)
    upload_dir.mkdir(parents=True, exist_ok=True)

    saved = []
    for file in files:
        # Validate file extension from original filename
        original_suffix = Path(file.filename or "").suffix.lower() if file.filename else ""
        if original_suffix not in ALLOWED_EXTENSIONS:
            raise HTTPException(status_code=400, detail=f"{file.filename}: invalid file type. Allowed: {', '.join(sorted(ALLOWED_EXTENSIONS))}")

        # Validate MIME type from Content-Type header
        if file.content_type and file.content_type not in ALLOWED_MIME:
            raise HTTPException(status_code=400, detail=f"{file.filename}: invalid content type '{file.content_type}'")

        # Read file content to validate size (don't trust file.size header)
        content = await file.read()
        if len(content) > settings.max_upload_bytes:
            raise HTTPException(status_code=413, detail=f"{file.filename} exceeds {settings.max_upload_bytes // (1024*1024)}MB limit")

        # Generate safe filename — never use user-supplied filename for storage
        file_id = uuid.uuid4()
        safe_ext = original_suffix if original_suffix in ALLOWED_EXTENSIONS else ".pdf"
        dest = upload_dir / f"{file_id}{safe_ext}"

        with open(dest, "wb") as f:
            f.write(content)

        # Sanitize the display filename (strip path components)
        display_name = Path(file.filename or "document").name[:255] if file.filename else "document"

        doc = CaseDocument(
            id=file_id,
            case_id=case_id,
            doc_type=doc_type,
            filename=display_name,
            file_path=str(dest),
            file_size=len(content),
            mime_type=file.content_type,
        )
        db.add(doc)
        saved.append({"id": str(file_id), "filename": display_name, "doc_type": doc_type})

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
