import { NextRequest, NextResponse } from "next/server";
import { agencies } from "../../../lib/data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
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
