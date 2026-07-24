import shutil
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.core.dependencies import get_current_user
from app.core.exceptions import NotFoundException
from app.database import get_db
from app.models.resume import Resume
from app.models.user import User
from app.schemas.resume import ResumeResponse
from app.services import resume_analyzer, resume_parser

router = APIRouter(prefix="/api/v1/resumes", tags=["resumes"])

ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx"}


async def _get_owned_resume(resume_id: int, current_user: User, db: AsyncSession) -> Resume:
    resume = await db.get(Resume, resume_id)
    if resume is None or resume.user_id != current_user.id:
        raise NotFoundException("Resume not found")
    return resume


@router.post("", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Resume:
    extension = Path(file.filename or "").suffix.lower()
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Only PDF or DOCX resumes are supported")

    upload_dir = Path(settings.upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)
    file_path = upload_dir / f"{uuid4().hex}{extension}"

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        parsed_text = resume_parser.parse_resume(str(file_path), file.filename or file_path.name)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    analysis = resume_analyzer.analyze_resume(parsed_text)

    resume = Resume(
        user_id=current_user.id,
        filename=file.filename or file_path.name,
        file_path=str(file_path),
        parsed_text=parsed_text,
        analysis=analysis,
    )
    db.add(resume)
    await db.commit()
    await db.refresh(resume)
    return resume


@router.get("", response_model=list[ResumeResponse])
async def list_resumes(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[Resume]:
    result = await db.scalars(
        select(Resume).where(Resume.user_id == current_user.id).order_by(Resume.created_at.desc())
    )
    return list(result)


@router.get("/{resume_id}", response_model=ResumeResponse)
async def get_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Resume:
    return await _get_owned_resume(resume_id, current_user, db)


@router.post("/{resume_id}/analyze", response_model=ResumeResponse)
async def analyze_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Resume:
    resume = await _get_owned_resume(resume_id, current_user, db)
    resume.analysis = resume_analyzer.analyze_resume(resume.parsed_text or "")
    await db.commit()
    await db.refresh(resume)
    return resume


@router.get("/{resume_id}/suggestions")
async def get_suggestions(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> dict:
    resume = await _get_owned_resume(resume_id, current_user, db)
    return {"suggestions": (resume.analysis or {}).get("suggestions", [])}


@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    resume = await _get_owned_resume(resume_id, current_user, db)
    await db.delete(resume)
    await db.commit()
