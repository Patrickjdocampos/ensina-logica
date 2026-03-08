from fastapi import APIRouter
from app.schemas.explain import ExplainRequest, ExplainResponse
from app.services.explain_service import generate_pedagogical_explanation

router = APIRouter(prefix="/explain", tags=["Explain"])


@router.get("/test")
def explain_test():
    return {
        "feature": "explain",
        "message": "Rota de explicação inicial funcionando.",
        "next_step": "Integrar geração pedagógica de explicações."
    }


@router.post("/", response_model=ExplainResponse)
def explain_topic(data: ExplainRequest):
    return generate_pedagogical_explanation(data)