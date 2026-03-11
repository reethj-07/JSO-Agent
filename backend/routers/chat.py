"""Chat endpoint — invokes the LangGraph agent."""

import logging
from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone
from models import ChatRequest, ChatResponse
from agent.graph import run_agent
from database import get_supabase

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/agent", tags=["agent"])


@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    query = req.query.strip()

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
            "model": "gemini-2.0-flash + LangGraph",
        }).execute()
    except Exception:
        pass  # Don't fail the response if logging fails

    return ChatResponse(
        query=query,
        response=response_text,
        timestamp=datetime.now(timezone.utc).isoformat(),
        model="gemini-2.0-flash + LangGraph",
        tools_used=tools_used,
    )
