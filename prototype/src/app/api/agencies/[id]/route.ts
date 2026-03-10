import { NextRequest, NextResponse } from "next/server";
import { agencies, calculateTrustScore } from "../../../../lib/data";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const agency = agencies.find((a) => a.id === id);

  if (!agency) {
    return NextResponse.json({ error: "Agency not found" }, { status: 404 });
  }

  const breakdown = calculateTrustScore(agency);

  return NextResponse.json({ agency, breakdown });
}
