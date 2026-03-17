from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.chat import ChatSession, ChatMessage
from app.schemas.explain import ExplainRequest, ExplainResponse
from app.services import llm_service


def generate_pedagogical_explanation(db: Session, data: ExplainRequest, user_id: int) -> ExplainResponse:
    # 1. Recupera ou cria a sessão de chat vinculada ao usuário logado
    if data.session_id:
        session = db.query(ChatSession).filter(
            ChatSession.id == data.session_id,
            ChatSession.user_id == user_id
        ).first()

        if not session:
            session = ChatSession(topic=data.topic, level=data.level, user_id=user_id)
            db.add(session)
            db.commit()
            db.refresh(session)
    else:
        session = ChatSession(topic=data.topic, level=data.level, user_id=user_id)
        db.add(session)
        db.commit()
        db.refresh(session)

    # 2. Registra a mensagem do usuário
    user_msg = ChatMessage(session_id=session.id, role="user", content=data.prompt)
    db.add(user_msg)
    db.commit()

    # 3. Monta o histórico para a IA
    history = db.query(ChatMessage).filter(ChatMessage.session_id == session.id).order_by(
        ChatMessage.created_at.asc()
    ).all()
    history_list = [{"role": msg.role, "content": msg.content} for msg in history]

    # Remove o último prompt pois ele é enviado separadamente
    if history_list:
        history_list.pop()

    # 4. Aciona o LLM
    resposta = llm_service.generate_explanation(
        topic=session.topic,
        level=session.level,
        prompt=data.prompt,
        history=history_list
    )

    # 5. Registra a resposta da IA APENAS se houver conteúdo válido
    if resposta:
        ia_msg = ChatMessage(session_id=session.id, role="assistant", content=resposta)
        db.add(ia_msg)
        db.commit()
    else:
        resposta = "Ocorreu um erro ao gerar a explicação (possível limite de uso da API excedido). Aguarde alguns instantes e tente novamente."

    return ExplainResponse(explanation=resposta, session_id=session.id)


def get_user_history(db: Session, user_id: int):
    """Retorna apenas as sessões do usuário logado para a barra lateral."""
    sessions = db.query(ChatSession).filter(
        ChatSession.user_id == user_id
    ).order_by(ChatSession.created_at.desc()).all()

    return [{"id": s.id, "topic": s.topic, "level": s.level} for s in sessions]


def get_session_chat(db: Session, session_id: int, user_id: int):
    """Recupera o histórico de mensagens de uma sessão, garantindo que pertence ao usuário."""
    session = db.query(ChatSession).filter(
        ChatSession.id == session_id,
        ChatSession.user_id == user_id
    ).first()

    if not session:
        return None

    messages = db.query(ChatMessage).filter(
        ChatMessage.session_id == session_id
    ).order_by(ChatMessage.created_at.asc()).all()

    return {
        "session": {"id": session.id, "topic": session.topic, "level": session.level},
        "messages": [{"role": m.role, "content": m.content} for m in messages]
    }


def delete_session_chat(db: Session, session_id: int, user_id: int):
    """Exclui uma sessão de chat e suas mensagens em cascata."""
    session = db.query(ChatSession).filter(
        ChatSession.id == session_id,
        ChatSession.user_id == user_id
    ).first()

    if session:
        db.delete(session)
        db.commit()
        return True
    return False


# --- FUNÇÕES DO DASHBOARD ---
def get_logs(db: Session, skip: int = 0, limit: int = 50):
    sessions = db.query(ChatSession).order_by(ChatSession.created_at.desc()).offset(skip).limit(limit).all()
    result = []
    for s in sessions:
        last_msg = db.query(ChatMessage).filter(
            ChatMessage.session_id == s.id, ChatMessage.role == "assistant"
        ).order_by(ChatMessage.created_at.desc()).first()
        explanation_text = last_msg.content if last_msg else "Sessão iniciada."
        result.append({"id": s.id, "topic": s.topic, "level": s.level, "explanation": explanation_text})
    return result


def get_stats(db: Session):
    total = db.query(ChatSession).count()
    topics_count = db.query(ChatSession.topic, func.count(ChatSession.id)).group_by(ChatSession.topic).all()
    levels_count = db.query(ChatSession.level, func.count(ChatSession.id)).group_by(ChatSession.level).all()
    return {
        "total_explanations": total,
        "topics_breakdown": [{"topic": t[0], "count": t[1]} for t in topics_count],
        "levels_breakdown": [{"level": l[0], "count": l[1]} for l in levels_count]
    }