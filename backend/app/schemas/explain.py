from pydantic import BaseModel
from typing import Optional


class ExplainRequest(BaseModel):
    topic: str
    level: str
    code_example: Optional[str] = None


class ExplainResponse(BaseModel):
    topic: str
    level: str
    explanation: str
    suggested_next_step: str