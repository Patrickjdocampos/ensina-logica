from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.explain import ExplainRequest, ExplainResponse
from app.models.user import User
from app.core.deps import get_current_user
from app.services.explain_service import (
    generate_pedagogical_explanation,
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
    # A persistência agora ocorre de forma integrada na geração da resposta
    response = generate_pedagogical_explanation(db, data)
    return response

# --- ROTAS PROTEGIDAS ---

@router.get("/logs")
def read_logs(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_logs(db, skip=skip, limit=limit)

@router.get("/stats")
def read_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_stats(db)