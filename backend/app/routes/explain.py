from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.explain import ExplainRequest, ExplainResponse
from app.models.user import User
from app.core.deps import get_current_user
from app.services.explain_service import (
    generate_pedagogical_explanation,
    get_logs,
    get_stats,
    get_session_chat,
    get_user_history,
    delete_session_chat
)

router = APIRouter(prefix="/explain", tags=["Explain"])

@router.post("/", response_model=ExplainResponse)
def explain_topic(
    data: ExplainRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Gera explicação vinculando a sessão ao usuário logado."""
    response = generate_pedagogical_explanation(db, data, current_user.id)
    return response

@router.get("/history")
def read_user_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retorna o histórico de sessões do usuário logado."""
    return get_user_history(db, current_user.id)

@router.get("/session/{session_id}")
def read_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Lê uma sessão específica, validando a posse."""
    session_data = get_session_chat(db, session_id, current_user.id)
    if not session_data:
        raise HTTPException(status_code=404, detail="Sessão não encontrada ou acesso negado.")
    return session_data

@router.delete("/session/{session_id}")
def delete_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Exclui uma sessão específica do usuário."""
    success = delete_session_chat(db, session_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Sessão não encontrada ou acesso negado.")
    return {"detail": "Sessão excluída com sucesso."}

# --- ROTAS PROTEGIDAS DO DASHBOARD ---

@router.get("/logs")
def read_logs(
    skip: int = 0, limit: int = 50,
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