from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.explain import ExplainRequest, ExplainResponse
from app.services.explain_service import (
    generate_pedagogical_explanation,
    save_explanation_log
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