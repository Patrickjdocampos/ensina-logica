from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas.explain import ExplainRequest, ExplainResponse, LogResponse
from app.models.user import User
from app.core.deps import get_current_user  # Importamos o cadeado
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
        "message": "Rota de explicação inicial funcionando."
    }

@router.post("/", response_model=ExplainResponse)
def explain_topic(data: ExplainRequest, db: Session = Depends(get_db)):
    response = generate_pedagogical_explanation(data)
    save_explanation_log(db, data, response)
    return response

# --- ROTAS PROTEGIDAS ---
# Adicionamos current_user: User = Depends(get_current_user) como parâmetro
# Isso obriga o FastAPI a rodar a verificação de token antes de executar a função

@router.get("/logs", response_model=List[LogResponse])
def read_logs(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retorna o histórico de explicações. Rota protegida.
    """
    return get_logs(db, skip=skip, limit=limit)

@router.get("/stats")
def read_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retorna estatísticas de uso. Rota protegida.
    """
    return get_stats(db)