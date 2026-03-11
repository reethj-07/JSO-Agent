import { NextRequest, NextResponse } from "next/server";
import { agencies } from "../../../lib/data";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Try Python backend first
  try {
    const backendUrl = new URL("/api/agencies", BACKEND_URL);
    searchParams.forEach((value, key) => backendUrl.searchParams.set(key, value));
    const res = await fetch(backendUrl.toString(), { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {
    // Backend unavailable — fall through to local data
  }

  // Fallback to local mock data
  const industry = searchParams.get("industry");
  const minScore = searchParams.get("minScore");
  const sortBy = searchParams.get("sortBy") || "trustScore";

  let filtered = [...agencies];

  if (industry) {
    filtered = filtered.filter((a) =>
      a.industry.some((i) => i.toLowerCase().includes(industry.toLowerCase()))
    );
  }

  if (minScore) {
    filtered = filtered.filter((a) => a.trustScore >= parseInt(minScore));
  }

  if (sortBy === "trustScore") {
    filtered.sort((a, b) => b.trustScore - a.trustScore);
  } else if (sortBy === "placements") {
    filtered.sort((a, b) => b.successfulPlacements - a.successfulPlacements);
  } else if (sortBy === "rating") {
    filtered.sort((a, b) => b.averageRating - a.averageRating);
  }

  return NextResponse.json({ agencies: filtered });
}
