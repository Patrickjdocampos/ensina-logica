from fastapi import FastAPI
from app.core.config import APP_NAME, APP_VERSION, APP_DESCRIPTION
from app.routes.health import router as health_router
from app.routes.explain import router as explain_router

app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    description=APP_DESCRIPTION
)


@app.get("/")
def root():
    return {
        "project": "Ensina Logica",
        "version": APP_VERSION,
        "message": "API inicial no ar."
    }


app.include_router(health_router)
app.include_router(explain_router)