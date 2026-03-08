from datetime import datetime

from sqlalchemy import DateTime, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class ExplanationLog(Base):
    __tablename__ = "explanation_logs"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    topic: Mapped[str] = mapped_column(String(100), index=True)
    level: Mapped[str] = mapped_column(String(50), index=True)
    code_example: Mapped[str | None] = mapped_column(Text, nullable=True)
    explanation: Mapped[str] = mapped_column(Text)
    suggested_next_step: Mapped[str] = mapped_column(Text)
    source: Mapped[str] = mapped_column(String(50), default="local_rule_engine")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)