"""Chat endpoint — invokes the LangGraph agent."""

import logging
from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone
from models import ChatRequest, ChatResponse
from agent.graph import run_agent, get_model_name
from database import get_supabase

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/agent", tags=["agent"])


@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    query = req.query.strip()
    model_label = f"{get_model_name()} + LangGraph"

    try:
        response_text, tools_used = await run_agent(query)
    except Exception as e:
        logger.error(f"Agent error: {e}")
        raise HTTPException(status_code=502, detail=f"Agent error: {str(e)}")

    # Log the interaction to Supabase
    try:
        db = get_supabase()
        db.table("agent_interactions").insert({
            "query": query,
            "response": response_text[:5000],
            "tools_used": tools_used,
            "model": model_label,
        }).execute()
    except Exception:
        pass  # Don't fail the response if logging fails

    return ChatResponse(
        query=query,
        response=response_text,
        timestamp=datetime.now(timezone.utc).isoformat(),
        model=model_label,
        tools_used=tools_used,
    )
