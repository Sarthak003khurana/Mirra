from datetime import datetime, timezone

from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user
from app.core.exceptions import NotFoundException
from app.database import get_db
from app.models.answer import Answer
from app.models.resume import Resume
from app.models.score import Score
from app.models.session import InterviewSession
from app.models.user import User
from app.schemas.session import ReportResponse, SessionCreate, SessionResponse
from app.services import report_generator
from app.websocket import interview_handler

router = APIRouter(prefix="/api/v1/interviews", tags=["interviews"])


async def _get_owned_session(session_id: int, current_user: User, db: AsyncSession) -> InterviewSession:
    session = await db.get(InterviewSession, session_id)
    if session is None or session.user_id != current_user.id:
        raise NotFoundException("Interview session not found")
    return session


@router.post("/sessions", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
async def create_session(
    data: SessionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> InterviewSession:
    resume = await db.get(Resume, data.resume_id)
    if resume is None or resume.user_id != current_user.id:
        raise NotFoundException("Resume not found")

    session = InterviewSession(
        user_id=current_user.id,
        resume_id=data.resume_id,
        status="created",
        config=data.config.model_dump(),
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session


@router.get("/sessions", response_model=list[SessionResponse])
async def list_sessions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[InterviewSession]:
    result = await db.scalars(
        select(InterviewSession).where(InterviewSession.user_id == current_user.id).order_by(InterviewSession.id.desc())
    )
    return list(result)


@router.get("/sessions/{session_id}", response_model=SessionResponse)
async def get_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> InterviewSession:
    return await _get_owned_session(session_id, current_user, db)


@router.post("/sessions/{session_id}/start")
async def start_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> dict:
    session = await _get_owned_session(session_id, current_user, db)
    resume = await db.get(Resume, session.resume_id)

    session.status = "active"
    session.started_at = datetime.now(timezone.utc)
    await db.commit()

    question_text = await interview_handler.start_first_question(
        str(session_id), (resume.parsed_text if resume else "") or "", session.config or {}
    )
    return {"status": "active", "question": {"id": 1, "text": question_text}}


@router.post("/sessions/{session_id}/end")
async def end_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> dict:
    await _get_owned_session(session_id, current_user, db)
    await interview_handler.finish_session(str(session_id))
    return {"status": "completed"}


@router.get("/sessions/{session_id}/report", response_model=ReportResponse)
async def get_report(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ReportResponse | dict:
    await _get_owned_session(session_id, current_user, db)
    score = await db.scalar(select(Score).where(Score.session_id == session_id))
    if score is not None:
        return score

    answers = list(await db.scalars(select(Answer).where(Answer.session_id == session_id)))
    return report_generator.build_report(answers)
