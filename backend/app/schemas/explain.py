from pydantic import BaseModel
from typing import List, Optional

class MessageItem(BaseModel):
    role: str
    content: str

class ExplainRequest(BaseModel):
    topic: str
    level: str
    prompt: Optional[str] = None
    messages: Optional[List[MessageItem]] = []

class ExplainResponse(BaseModel):
    explanation: str

class LogResponse(BaseModel):
    id: int
    topic: str
    level: str
    explanation: str

    class Config:
        from_attributes = True