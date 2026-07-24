from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ResumeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    filename: str
    version: int
    parsed_text: str | None
    analysis: dict | None
    created_at: datetime
