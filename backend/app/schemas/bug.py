from datetime import datetime

from pydantic import BaseModel


class BugCreate(BaseModel):
    title: str
    description: str
    severity: str | None = None
    category: str | None = None
    expected_behavior: str | None = None
    actual_behavior: str | None = None
    steps_to_reproduce: str | None = None


class BugUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    severity: str | None = None
    category: str | None = None
    expected_behavior: str | None = None
    actual_behavior: str | None = None
    steps_to_reproduce: str | None = None
    status: str | None = None


class BugResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: str
    severity: str | None
    category: str | None
    expected_behavior: str | None
    actual_behavior: str | None
    steps_to_reproduce: str | None
    status: str
    screenshot_url: str | None

    # AI analysis
    analysis_status: str
    ai_summary: str | None = None
    ai_visual_evidence: str | None = None
    ai_root_cause: str | None = None
    ai_suggested_fix: str | None = None
    ai_severity: str | None = None
    ai_priority: str | None = None
    ai_confidence: int | None = None

    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True