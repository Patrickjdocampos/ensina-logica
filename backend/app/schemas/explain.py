from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class ExplainRequest(BaseModel):
    topic: str
    level: str
    code_example: Optional[str] = None

class ExplainResponse(BaseModel):
    topic: str
    level: str
    explanation: str
    suggested_next_step: str

# NOVO: Esquema para ler os logs do banco de dados
class LogResponse(BaseModel):
    id: int
    topic: str
    level: str
    code_example: Optional[str] = None
    explanation: str
    suggested_next_step: str
    source: str
    created_at: datetime

    # Isso permite que o Pydantic leia diretamente objetos do SQLAlchemy
    model_config = ConfigDict(from_attributes=True)