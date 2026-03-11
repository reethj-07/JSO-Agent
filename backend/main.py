"""FastAPI application — JSO Agency Trust & Transparency Agent backend."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import get_settings
from routers import agencies, chat

settings = get_settings()

app = FastAPI(
    title="JSO Agency Trust & Transparency Agent",
    description="Agentic AI backend powered by LangGraph + Gemini for evaluating recruitment agency trustworthiness.",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agencies.router)
app.include_router(chat.router)


@app.get("/health")
def health():
    return {"status": "ok", "version": "2.0.0", "agent": "LangGraph + Gemini 2.0 Flash"}
