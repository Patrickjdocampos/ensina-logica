from app.schemas.explain import ExplainRequest, ExplainResponse


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