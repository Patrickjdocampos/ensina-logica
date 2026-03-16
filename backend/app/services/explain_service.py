from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.chat import ChatSession, ChatMessage
from app.schemas.explain import ExplainRequest, ExplainResponse
from app.services import llm_service


def generate_pedagogical_explanation(db: Session, data: ExplainRequest) -> ExplainResponse:
    # 1. Recupera ou cria a sessão de chat
    if data.session_id:
        session = db.query(ChatSession).filter(ChatSession.id == data.session_id).first()
        if not session:
            session = ChatSession(topic=data.topic, level=data.level)
            db.add(session)
            db.commit()
            db.refresh(session)
    else:
        session = ChatSession(topic=data.topic, level=data.level)
        db.add(session)
        db.commit()
        db.refresh(session)

    # 2. Registra a mensagem do usuário
    user_msg = ChatMessage(session_id=session.id, role="user", content=data.prompt)
    db.add(user_msg)
    db.commit()

    # 3. Monta o histórico para a IA a partir do banco de dados
    history = db.query(ChatMessage).filter(ChatMessage.session_id == session.id).order_by(
        ChatMessage.created_at.asc()).all()
    history_list = [{"role": msg.role, "content": msg.content} for msg in history]

    # Remove o último prompt (do usuário atual) pois ele é o gatilho enviado separadamente ao LLM
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
            # Define uma mensagem padrão caso a IA falhe e não grava no banco para não sujar o histórico
            resposta = "Ocorreu um erro ao gerar a explicação (possível limite de uso da API excedido). Aguarde alguns instantes e tente novamente."

        return ExplainResponse(explanation=resposta, session_id=session.id)


def get_logs(db: Session, skip: int = 0, limit: int = 50):
    """
    Converte as sessões de chat para o formato compatível com a tabela do Dashboard.
    """
    sessions = db.query(ChatSession).order_by(ChatSession.created_at.desc()).offset(skip).limit(limit).all()
    result = []

    for s in sessions:
        # Extrai a última mensagem da IA para exibir no resumo da tabela
        last_msg = db.query(ChatMessage).filter(
            ChatMessage.session_id == s.id,
            ChatMessage.role == "assistant"
        ).order_by(ChatMessage.created_at.desc()).first()

        explanation_text = last_msg.content if last_msg else "Sessão iniciada."

        result.append({
            "id": s.id,
            "topic": s.topic,
            "level": s.level,
            "explanation": explanation_text
        })

    return result


def get_stats(db: Session):
    total = db.query(ChatSession).count()

    topics_count = db.query(
        ChatSession.topic,
        func.count(ChatSession.id)
    ).group_by(ChatSession.topic).all()

    levels_count = db.query(
        ChatSession.level,
        func.count(ChatSession.id)
    ).group_by(ChatSession.level).all()

    return {
        "total_explanations": total,
        "topics_breakdown": [{"topic": t[0], "count": t[1]} for t in topics_count],
        "levels_breakdown": [{"level": l[0], "count": l[1]} for l in levels_count]
    }

def get_session_chat(db: Session, session_id: int):
    """
    Recupera os dados de uma sessão específica e seu histórico de mensagens.
    """
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if not session:
        return None

    messages = db.query(ChatMessage).filter(
        ChatMessage.session_id == session_id
    ).order_by(ChatMessage.created_at.asc()).all()

    return {
        "session": {
            "id": session.id,
            "topic": session.topic,
            "level": session.level
        },
        "messages": [{"role": m.role, "content": m.content} for m in messages]
    }