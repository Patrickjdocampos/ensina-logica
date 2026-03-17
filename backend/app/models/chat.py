from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(Integer, primary_key=True, index=True)

    # NOVA COLUNA: Vincula esta sessão a um usuário específico
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    topic = Column(String, nullable=False)
    level = Column(String, nullable=False)
    created_at = Column(DateTime, default=func.now())

    # Relacionamentos
    user = relationship("User")
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("chat_sessions.id"), nullable=False)
    role = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=func.now())

    session = relationship("ChatSession", back_populates="messages")