from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user
from app.database import get_db
from app.models.score import Score
from app.models.session import InterviewSession
from app.models.user import User

router = APIRouter(prefix="/api/v1/reports", tags=["reports"])


@router.get("")
async def list_reports(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[dict]:
    result = await db.execute(
        select(Score, InterviewSession)
        .join(InterviewSession, Score.session_id == InterviewSession.id)
        .where(InterviewSession.user_id == current_user.id)
        .order_by(InterviewSession.id.desc())
    )
    return [
        {
            "session_id": session.id,
            "overall": score.overall,
            "status": session.status,
            "ended_at": session.ended_at,
        }
        for score, session in result.all()
    ]
