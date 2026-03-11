import { NextRequest, NextResponse } from "next/server";
import { getAgentResponse } from "../../../../lib/data";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  const { query } = await request.json();

  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return NextResponse.json(
      { error: "Query is required" },
      { status: 400 }
    );
  }

  const sanitizedQuery = query.trim().slice(0, 500);

  // Try Python backend (LangGraph + Gemini) first
  try {
    const res = await fetch(`${BACKEND_URL}/api/agent/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: sanitizedQuery }),
      signal: AbortSignal.timeout(30000),
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {
    // Backend unavailable — fall through to local keyword matching
  }

  // Fallback to local mock responses
  const response = getAgentResponse(sanitizedQuery);

  return NextResponse.json({
    query: sanitizedQuery,
    response,
    timestamp: new Date().toISOString(),
    model: "Agency Trust & Transparency Agent v1.0 (offline)",
  });
}
