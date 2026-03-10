import { NextRequest, NextResponse } from "next/server";
import { getAgentResponse } from "../../../../lib/data";

export async function POST(request: NextRequest) {
  const { query } = await request.json();

  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return NextResponse.json(
      { error: "Query is required" },
      { status: 400 }
    );
  }

  // Sanitize input length
  const sanitizedQuery = query.trim().slice(0, 500);

  const response = getAgentResponse(sanitizedQuery);

  return NextResponse.json({
    query: sanitizedQuery,
    response,
    timestamp: new Date().toISOString(),
    model: "Agency Trust & Transparency Agent v1.0",
  });
}
