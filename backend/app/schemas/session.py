from datetime import datetime

from pydantic import BaseModel, ConfigDict


class SessionConfig(BaseModel):
    personality: str = "friendly"
    difficulty: str = "medium"


class SessionCreate(BaseModel):
    resume_id: int
    config: SessionConfig = SessionConfig()


class SessionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    resume_id: int
    status: str
    config: dict
    started_at: datetime | None
    ended_at: datetime | None
    created_at: datetime


class QuestionOut(BaseModel):
    id: int
    text: str


class ReportResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    confidence: float
    communication: float
    technical: float
    structure: float
    overall: float
    breakdown: dict
    suggestions: list[str]
