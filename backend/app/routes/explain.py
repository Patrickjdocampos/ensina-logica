from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
# Agora importamos também o LogResponse
from app.schemas.explain import ExplainRequest, ExplainResponse, LogResponse
# E importamos as novas funções do service
from app.services.explain_service import (
    generate_pedagogical_explanation,
    save_explanation_log,
    get_logs,
    get_stats
)

router = APIRouter(prefix="/explain", tags=["Explain"])

@router.get("/test")
def explain_test():
    return {
        "feature": "explain",
        "message": "Rota de explicação inicial funcionando.",
        "next_step": "Integrar geração pedagógica de explicações."
    }

@router.post("/", response_model=ExplainResponse)
def explain_topic(data: ExplainRequest, db: Session = Depends(get_db)):
    response = generate_pedagogical_explanation(data)
    save_explanation_log(db, data, response)
    return response

# --- NOVAS ROTAS DE LEITURA ---

@router.get("/logs", response_model=List[LogResponse])
def read_logs(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    """
    Retorna o histórico de explicações geradas pelo sistema.
    """
    return get_logs(db, skip=skip, limit=limit)

@router.get("/stats")
def read_stats(db: Session = Depends(get_db)):
    """
    Retorna estatísticas de uso do sistema (total e temas mais buscados).
    Isso prepara o terreno para o nosso futuro dashboard.
    """
    return get_stats(db)