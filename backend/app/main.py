from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import APP_NAME, APP_VERSION, APP_DESCRIPTION
from app.database import Base, engine
from app.routes.health import router as health_router
from app.routes.explain import router as explain_router
from app.routes.auth import router as auth_router
import app.models  # noqa: F401

app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    description=APP_DESCRIPTION
)

# --- CONFIGURAÇÃO DO CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ----------------------------

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {
        "project": "Ensina Logica",
        "version": APP_VERSION,
        "message": "API inicial no ar."
    }

app.include_router(health_router)
app.include_router(explain_router)
app.include_router(auth_router)