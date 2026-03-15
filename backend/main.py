"""FastAPI application — JSO Agency Trust & Transparency Agent backend."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import get_settings
from agent.graph import get_model_name
from routers import agencies, chat

settings = get_settings()

app = FastAPI(
    title="JSO Agency Trust & Transparency Agent",
    description="Agentic AI backend powered by LangGraph with Groq/Gemini for evaluating recruitment agency trustworthiness.",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agencies.router)
app.include_router(chat.router)


@app.get("/health")
def health():
    model = "unavailable"
    try:
        model = get_model_name()
    except Exception:
        # Health should stay available even if LLM init fails.
        pass

    return {
        "status": "ok",
        "version": "2.0.0",
        "agent": "LangGraph",
        "model": model,
    }
