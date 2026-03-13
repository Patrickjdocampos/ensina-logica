from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.explain_log import ExplanationLog
from app.schemas.explain import ExplainRequest, ExplainResponse

# IMPORT NOVO: Trazendo nosso serviço de IA recém-criado
from app.services import llm_service


def generate_pedagogical_explanation(data: ExplainRequest) -> ExplainResponse:
    """
    Usa a Inteligência Artificial para gerar uma explicação pedagógica dinâmica.
    """
    # Aqui a mágica acontece: o IF/ELSE morre e a IA assume.
    generated_text = llm_service.generate_explanation(data.topic, data.level)

    # Como a IA gera um texto único no nosso prompt atual,
    # deixamos um próximo passo genérico focando na prática.
    next_step = "Abra sua IDE (como o PyCharm ou VSCode) e teste esse conceito na prática!"

    return ExplainResponse(
        topic=data.topic,
        level=data.level,
        explanation=generated_text,
        suggested_next_step=next_step
    )


def save_explanation_log(
        db: Session,
        request_data: ExplainRequest,
        response_data: ExplainResponse
) -> ExplanationLog:
    log = ExplanationLog(
        topic=request_data.topic,
        level=request_data.level,
        code_example=request_data.code_example,
        explanation=response_data.explanation,
        suggested_next_step=response_data.suggested_next_step,
        # Mudamos a fonte para refletir que agora usamos IA real
        source="huggingface_llm"
    )

    db.add(log)
    db.commit()
    db.refresh(log)

    return log


def get_logs(db: Session, skip: int = 0, limit: int = 50):
    """
    Busca os logs no banco de dados, ordenados do mais recente para o mais antigo.
    """
    return db.query(ExplanationLog).order_by(ExplanationLog.created_at.desc()).offset(skip).limit(limit).all()


def get_stats(db: Session):
    """
    Gera estatísticas básicas: total de explicações e contagem por tópico.
    """
    total = db.query(ExplanationLog).count()

    # Conta quantas vezes cada tópico foi requisitado
    topics_count = db.query(
        ExplanationLog.topic,
        func.count(ExplanationLog.id)
    ).group_by(ExplanationLog.topic).all()

    return {
        "total_explanations": total,
        "topics_breakdown": [{"topic": topic, "count": count} for topic, count in topics_count]
    }