from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.database import Base


class ExplanationLog(Base):
    __tablename__ = "explanation_logs"

    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String, index=True, nullable=False)
    level = Column(String, index=True, nullable=False)

    # Estes campos podem ficar nulos se você não for mais usá-los ativamente
    code_example = Column(Text, nullable=True)
    programming_language = Column(String, nullable=True)
    language_version = Column(String, nullable=True)

    explanation = Column(Text, nullable=False)
    suggested_next_step = Column(Text, nullable=True)
    source = Column(String, default="google_gemini")

    created_at = Column(DateTime(timezone=True), server_default=func.now())