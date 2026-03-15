from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.explain_log import ExplanationLog
from app.schemas.explain import ExplainRequest, ExplainResponse
from app.services import llm_service

def generate_pedagogical_explanation(data: ExplainRequest) -> ExplainResponse:
    """
    Aciona o LLM usando o histórico para manter o estado da conversa.
    """
    history_list = [msg.model_dump() for msg in data.messages] if data.messages else []

    resposta = llm_service.generate_explanation(
        topic=data.topic,
        level=data.level,
        prompt=data.prompt,
        history=history_list
    )

    return ExplainResponse(explanation=resposta)


def save_explanation_log(
        db: Session,
        request_data: ExplainRequest,
        response_data: ExplainResponse
) -> ExplanationLog:
    """
    Persiste apenas os dados essenciais do fluxo conversacional.
    """
    log = ExplanationLog(
        topic=request_data.topic,
        level=request_data.level,
        explanation=response_data.explanation,
        # Como mudamos para fluxo de chat contínuo, não exigimos os campos estáticos abaixo.
        # Eles ficarão vazios (nulos) no banco.
        code_example=None,
        suggested_next_step=None,
        source="gemini_chat"
    )

    db.add(log)
    db.commit()
    db.refresh(log)

    return log


def get_logs(db: Session, skip: int = 0, limit: int = 50):
    return db.query(ExplanationLog).order_by(ExplanationLog.created_at.desc()).offset(skip).limit(limit).all()


def get_stats(db: Session):
    total = db.query(ExplanationLog).count()

    topics_count = db.query(
        ExplanationLog.topic,
        func.count(ExplanationLog.id)
    ).group_by(ExplanationLog.topic).all()

    levels_count = db.query(
        ExplanationLog.level,
        func.count(ExplanationLog.id)
    ).group_by(ExplanationLog.level).all()

    return {
        "total_explanations": total,
        "topics_breakdown": [{"topic": t[0], "count": t[1]} for t in topics_count],
        "levels_breakdown": [{"level": l[0], "count": l[1]} for l in levels_count]
    }