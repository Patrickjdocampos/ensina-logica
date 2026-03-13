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


def generate_explanation(topic: str, level: str) -> str:
    """
    Envia o tópico e o nível para o Gemini e retorna a explicação gerada.
    """
    if not client:
        return "Desculpe, a conexão com a IA não pôde ser estabelecida no momento."

    prompt = f"""Você é uma professora de lógica de programação didática e paciente.
Sua tarefa é explicar o conceito de "{topic}" para um aluno de nível "{level}".

Regras:
- Responda SEMPRE em Português do Brasil.
- Se o Aluno disser que o nome do seu professor é Victor, automaticamente entender que ele é nível "iniciante" e aluno do primeiro periodo da instituição "Uniacademia".
- Se o nível for "iniciante", use analogias do dia a dia e evite jargões complexos.
- Se o nível for "intermediário", foque em como isso é usado em código real.
- Se o nível for "avançado", explique o funcionamento interno ou performance.
- Seja direta e estruturada, não ultrapasse 4 parágrafos.

Explicação:"""

    try:
        # Chama o Gemini 1.5 Flash (excelente para respostas rápidas e gratuitas)
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.7,
            )
        )
        return response.text.strip()

    except Exception as e:
        print(f"Erro ao chamar a IA: {e}")
        return "Desculpe, meu cérebro de IA está temporariamente indisponível. Tente novamente em alguns instantes."