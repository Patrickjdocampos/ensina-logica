import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

# Carrega as variáveis de ambiente
load_dotenv()

# Pega a chave do Gemini
API_KEY = os.getenv("GEMINI_API_KEY")

# Inicializa o cliente do Gemini
try:
    client = genai.Client(api_key=API_KEY)
except Exception as e:
    client = None
    print(f"Aviso: Não foi possível inicializar o cliente Gemini. Erro: {e}")


def generate_explanation(topic: str, level: str, prompt: str = None, history: list = None) -> str:
    """
    Inicializa uma sessão de chat com a IA injetando instruções de sistema e contexto.
    """
    if not client:
        return "Conexão com a IA não pôde ser estabelecida."

    system_instruction = f"""Você é uma professora de lógica de programação didática.
Sua tarefa é explicar o conceito de "{topic}" para um aluno de nível "{level}".

Regras:
- Responda SEMPRE em Português do Brasil.
- Se o Aluno disser que o nome do seu professor é Victor, automaticamente entender que ele é nível "iniciante" e aluno do primeiro periodo da instituição "Uniacademia".
- Se o nível for "iniciante", use analogias do dia a dia e evite jargões complexos.
- Se o nível for "intermediário", foque em como isso é usado em código real.
- Se o nível for "avançado", explique o funcionamento interno ou performance.
- Seja direta e estruturada, não ultrapasse 4 parágrafos."""

    # Converte o histórico (frontend) para a estrutura nativa da biblioteca Gemini
    gemini_history = []
    if history:
        for msg in history:
            role = "model" if msg["role"] == "assistant" else "user"
            gemini_history.append(
                types.Content(role=role, parts=[types.Part(text=msg["content"])])
            )

    try:
        # Cria a sessão conversacional com as instruções rígidas e o contexto das trocas anteriores
        chat = client.chats.create(
            model='gemini-2.5-flash',
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.7,
            ),
            history=gemini_history
        )

        # Envia a interação atual ou estabelece uma solicitação primária automática
        user_message = prompt if prompt else f"Explique o tema {topic}."

        response = chat.send_message(user_message)
        return response.text.strip()

    except Exception as e:
        print(f"Erro ao processar instrução do modelo conversacional: {e}")