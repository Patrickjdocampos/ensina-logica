from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class MessageItem(BaseModel):
    role: str
    content: str

class ExplainRequest(BaseModel):
    topic: str
    level: str
    prompt: str
    messages: Optional[List[MessageItem]] = []
    session_id: Optional[int] = None  # Se for None, o backend criará um novo Chat

class ExplainResponse(BaseModel):
    explanation: str
    session_id: int  # O backend sempre devolverá o ID da sessão ativa

# Esquemas para leitura do Histórico no Dashboard e Sidebar
class ChatSessionResponse(BaseModel):
    id: int
    topic: str
    level: str
    created_at: datetime

    class Config:
        from_attributes = True

class ChatMessageResponse(BaseModel):
    id: int
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True