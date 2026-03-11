import { NextRequest, NextResponse } from "next/server";
import { agencies, calculateTrustScore } from "../../../../lib/data";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Try Python backend first
  try {
    const res = await fetch(`${BACKEND_URL}/api/agencies/${encodeURIComponent(id)}`, {
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {
    // Backend unavailable — fall through to local data
  }

  // Fallback to local mock data
  const agency = agencies.find((a) => a.id === id);

  if (!agency) {
    return NextResponse.json({ error: "Agency not found" }, { status: 404 });
  }

  const breakdown = calculateTrustScore(agency);

  return NextResponse.json({ agency, breakdown });
}
