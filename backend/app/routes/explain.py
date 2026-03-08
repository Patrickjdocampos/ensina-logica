from fastapi import APIRouter

router = APIRouter(prefix="/explain", tags=["Explain"])


@router.get("/test")
def explain_test():
    return {
        "feature": "explain",
        "message": "Rota de explicação inicial funcionando.",
        "next_step": "Integrar geração pedagógica de explicações."
    }