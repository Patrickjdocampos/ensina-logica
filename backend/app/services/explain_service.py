from sqlalchemy.orm import Session
from app.models.explain_log import ExplanationLog
from app.schemas.explain import ExplainRequest, ExplainResponse
from sqlalchemy import func


def generate_pedagogical_explanation(data: ExplainRequest) -> ExplainResponse:
    topic = data.topic.lower().strip()
    level = data.level.lower().strip()

    if topic == "if":
        explanation = (
            "A estrutura 'if' é usada para tomar decisões no programa. "
            "Ela verifica se uma condição é verdadeira. "
            "Se for, o bloco de código dentro do if é executado."
        )
        next_step = "Tente comparar valores numéricos e observar quando a condição é verdadeira."
    elif topic == "if/else":
        explanation = (
            "A estrutura 'if/else' permite dois caminhos possíveis. "
            "Se a condição for verdadeira, o programa segue pelo bloco do if. "
            "Se for falsa, ele segue pelo bloco do else."
        )
        next_step = "Experimente alterar a condição para ver como o fluxo do programa muda."
    elif topic == "for":
        explanation = (
            "O laço 'for' é usado quando sabemos quantas repetições queremos executar. "
            "Ele percorre uma sequência de valores e executa o bloco de código a cada repetição."
        )
        next_step = "Teste diferentes intervalos com range() para observar o comportamento do laço."
    elif topic == "while":
        explanation = (
            "O laço 'while' repete um bloco de código enquanto uma condição for verdadeira. "
            "Ele é útil quando não sabemos exatamente quantas repetições serão necessárias."
        )
        next_step = "Tome cuidado para atualizar a variável de controle e evitar loops infinitos."
    else:
        explanation = (
            f"O tema '{data.topic}' ainda não possui uma explicação específica nesta versão inicial. "
            "Mas a estrutura da API já está preparada para evoluir."
        )
        next_step = "Escolha entre: if, if/else, for ou while."

    if level == "iniciante":
        explanation += " Esta explicação foi ajustada para um nível iniciante."
    elif level == "intermediario":
        explanation += " Esta explicação foi ajustada para um nível intermediário."
    elif level == "avancado":
        explanation += " Esta explicação foi ajustada para um nível avançado."

    return ExplainResponse(
        topic=data.topic,
        level=data.level,
        explanation=explanation,
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
        source="local_rule_engine"
    )

    db.add(log)
    db.commit()
    db.refresh(log)

    return log


# Adicione este import lá no topo do arquivo, junto com os outros:
# from sqlalchemy import func

# ... (mantenha as funções generate_pedagogical_explanation e save_explanation_log intactas) ...

def get_logs(db: Session, skip: int = 0, limit: int = 50):
    """
    Busca os logs no banco de dados, ordenados do mais recente para o mais antigo.
    """
    return db.query(ExplanationLog).order_by(ExplanationLog.created_at.desc()).offset(skip).limit(limit).all()


def get_stats(db: Session):
    """
    Gera estatísticas básicas: total de explicações e contagem por tópico.
    Isso é o embrião do nosso futuro dashboard de análise educacional.
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