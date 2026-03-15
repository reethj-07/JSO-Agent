"""Agent tools — functions the LangGraph agent can invoke via Gemini tool-calling."""

from langchain_core.tools import tool
from database import get_supabase
from datetime import datetime, timezone


def _tier(score: float) -> str:
    if score >= 80:
        return "Excellent"
    if score >= 60:
        return "Good"
    if score >= 40:
        return "Fair"
    return "Poor"


@tool
def search_agencies(query: str = "", industry: str = "", min_score: str = "0") -> str:
    """Search for recruitment agencies on the platform. Filter by name, industry, or minimum trust score.
    Returns a summary of matching agencies with their trust scores and key metrics."""
    db = get_supabase()
    q = db.table("agencies").select("*")

    # Parse numeric threshold from string input (Groq tool calls commonly send strings).
    try:
        min_score_value = float(min_score)
    except (TypeError, ValueError):
        min_score_value = 0.0

    if min_score_value > 0:
        q = q.gte("trust_score", min_score_value)

    result = q.order("trust_score", desc=True).execute()
    agencies = result.data

    # Apply text filters in Python for flexibility
    if query:
        ql = query.lower()
        agencies = [a for a in agencies if ql in a["name"].lower() or ql in a.get("description", "").lower()]
    if industry:
        il = industry.lower()
        agencies = [a for a in agencies if any(il in i.lower() for i in a.get("industry", []))]

    if not agencies:
        return "No agencies found matching your criteria."

    lines = [f"Found {len(agencies)} agencies:\n"]
    for a in agencies:
        rate = round(a["successful_placements"] / a["total_placements"] * 100) if a["total_placements"] > 0 else 0
        lines.append(
            f"• {a['name']} (Score: {a['trust_score']}/100, Tier: {a['trust_tier']}, "
            f"Rating: {a['average_rating']}/5, Placements: {rate}% success, "
            f"Location: {a['location']}, Industry: {', '.join(a.get('industry', []))})"
        )
    return "\n".join(lines)


@tool
def get_agency_trust_details(agency_name: str) -> str:
    """Get detailed trust information for a specific agency including trust score breakdown,
    score history, recent reviews, and compliance status."""
    db = get_supabase()
    result = db.table("agencies").select("*").ilike("name", f"%{agency_name}%").execute()

    if not result.data:
        return f"No agency found matching '{agency_name}'."

    a = result.data[0]
    agency_id = a["id"]

    # Get score history
    history = db.table("score_history").select("*").eq("agency_id", agency_id).order("month").execute()
    # Get reviews
    reviews = db.table("reviews").select("*").eq("agency_id", agency_id).order("created_at", desc=True).limit(5).execute()

    # Compute breakdown
    reviews_component = (a["average_rating"] / 5) * 100 * 0.30
    rate = (a["successful_placements"] / a["total_placements"] * 100) if a["total_placements"] > 0 else 0
    placements_component = rate * 0.25
    feedback_component = (a["average_feedback"] / 5) * 100 * 0.20
    compliance_component = a["compliance_score"] * 0.15
    joined = datetime.strptime(a["joined_at"], "%Y-%m-%d")
    months_active = (datetime.now(timezone.utc) - joined.replace(tzinfo=timezone.utc)).days / 30
    tenure_component = min(months_active / 36 * 100, 100) * 0.10

    lines = [
        f"Agency: {a['name']}",
        f"Location: {a['location']}",
        f"Industry: {', '.join(a.get('industry', []))}",
        f"License: {a['license_status']}",
        f"Trust Score: {a['trust_score']}/100 ({a['trust_tier']})",
        f"Trend: {a['trend_direction']}",
        f"\nScore Breakdown:",
        f"  Reviews (30%):    {reviews_component:.1f}",
        f"  Placements (25%): {placements_component:.1f}",
        f"  Feedback (20%):   {feedback_component:.1f}",
        f"  Compliance (15%): {compliance_component:.1f}",
        f"  Tenure (10%):     {tenure_component:.1f}",
        f"\nPlacements: {a['successful_placements']}/{a['total_placements']} ({rate:.0f}% success)",
        f"Reviews: {a['total_reviews']} (avg {a['average_rating']}/5)",
        f"Compliance: {a['compliance_score']}%",
    ]

    if history.data:
        trend = ", ".join(f"{h['month']}: {h['score']}" for h in history.data)
        lines.append(f"\nScore History: {trend}")

    if reviews.data:
        lines.append(f"\nRecent Reviews:")
        for r in reviews.data:
            verified = "✓" if r["is_verified"] else "✗"
            lines.append(f"  [{verified}] {r['rating']}/5 - \"{r['text']}\" ({r['sentiment']})")

    return "\n".join(lines)


@tool
def compare_agencies(agency_names: str) -> str:
    """Compare two or more agencies side by side. Provide agency names separated by commas.
    Returns a comparison table of all key metrics."""
    names = [n.strip() for n in agency_names.split(",") if n.strip()]
    if len(names) < 2:
        return "Please provide at least two agency names separated by commas."

    db = get_supabase()
    found = []
    for name in names:
        result = db.table("agencies").select("*").ilike("name", f"%{name}%").execute()
        if result.data:
            found.append(result.data[0])

    if len(found) < 2:
        return f"Could only find {len(found)} agencies. Need at least 2 to compare."

    header = f"{'Metric':<25}" + "".join(f"{a['name']:<25}" for a in found)
    separator = "-" * (25 + 25 * len(found))

    rows = [
        ("Trust Score", [f"{a['trust_score']}/100" for a in found]),
        ("Trust Tier", [a["trust_tier"] for a in found]),
        ("Rating", [f"{a['average_rating']}/5" for a in found]),
        ("Placement Rate", [
            f"{round(a['successful_placements']/a['total_placements']*100)}%" if a["total_placements"] > 0 else "0%"
            for a in found
        ]),
        ("Total Reviews", [str(a["total_reviews"]) for a in found]),
        ("Compliance", [f"{a['compliance_score']}%" for a in found]),
        ("Trend", [a["trend_direction"] for a in found]),
        ("License", [a["license_status"] for a in found]),
        ("Location", [a["location"] for a in found]),
        ("Industry", [", ".join(a.get("industry", [])) for a in found]),
    ]

    lines = [header, separator]
    for label, values in rows:
        lines.append(f"{label:<25}" + "".join(f"{v:<25}" for v in values))

    # Determine winner
    best = max(found, key=lambda a: a["trust_score"])
    lines.append(f"\n→ {best['name']} has the highest trust score at {best['trust_score']}/100.")

    return "\n".join(lines)


@tool
def get_platform_stats() -> str:
    """Get platform-wide statistics including average trust score, total placements,
    flagged agencies, and overall health metrics. Used for admin reports."""
    db = get_supabase()
    result = db.table("agencies").select("*").execute()
    agencies = result.data

    if not agencies:
        return "No agency data available."

    total = len(agencies)
    avg_score = sum(a["trust_score"] for a in agencies) / total
    total_placements = sum(a["total_placements"] for a in agencies)
    total_success = sum(a["successful_placements"] for a in agencies)
    total_reviews = sum(a["total_reviews"] for a in agencies)
    success_rate = round(total_success / total_placements * 100) if total_placements > 0 else 0

    flagged = [a for a in agencies if a["trust_score"] < 50 or a["trend_direction"] == "down" or a["license_status"] != "active"]
    excellent = [a for a in agencies if a["trust_tier"] == "Excellent"]
    declining = [a for a in agencies if a["trend_direction"] == "down"]

    lines = [
        f"Platform Overview ({total} agencies):",
        f"  Average Trust Score: {avg_score:.1f}/100",
        f"  Total Placements: {total_success:,}/{total_placements:,} ({success_rate}% success)",
        f"  Total Reviews: {total_reviews:,}",
        f"  Excellent Agencies: {len(excellent)}",
        f"  Declining Agencies: {len(declining)}",
        f"  Flagged (need attention): {len(flagged)}",
    ]

    if flagged:
        lines.append(f"\nFlagged Agencies:")
        for a in flagged:
            reasons = []
            if a["trust_score"] < 50:
                reasons.append("low score")
            if a["trend_direction"] == "down":
                reasons.append("declining")
            if a["license_status"] != "active":
                reasons.append(f"license: {a['license_status']}")
            lines.append(f"  ⚠ {a['name']} (Score: {a['trust_score']}) — {', '.join(reasons)}")

    return "\n".join(lines)


@tool
def detect_anomalies() -> str:
    """Detect anomalies across all agencies — suspicious review patterns, rapid score drops,
    compliance violations, and potential fraud indicators."""
    db = get_supabase()
    agencies_result = db.table("agencies").select("*").execute()
    agencies = agencies_result.data

    alerts = []

    for a in agencies:
        # Check for rapid decline
        history = db.table("score_history").select("*").eq("agency_id", a["id"]).order("month").execute()
        if len(history.data) >= 3:
            recent = [h["score"] for h in history.data[-3:]]
            if recent[0] - recent[-1] > 5:
                alerts.append(f"⚠ {a['name']}: Score dropped {recent[0] - recent[-1]} points over 3 months ({recent[0]} → {recent[-1]})")

        # Low placement success rate
        if a["total_placements"] > 20:
            rate = a["successful_placements"] / a["total_placements"] * 100
            if rate < 50:
                alerts.append(f"⚠ {a['name']}: Low placement success rate ({rate:.0f}%)")

        # License issues
        if a["license_status"] != "active":
            alerts.append(f"🔴 {a['name']}: License status is '{a['license_status']}'")

        # Compliance below threshold
        if a["compliance_score"] < 60:
            alerts.append(f"⚠ {a['name']}: Compliance score below threshold ({a['compliance_score']}%)")

        # Check for unverified review ratio
        reviews = db.table("reviews").select("*").eq("agency_id", a["id"]).execute()
        if reviews.data:
            unverified = sum(1 for r in reviews.data if not r["is_verified"])
            ratio = unverified / len(reviews.data) * 100
            if ratio > 50:
                alerts.append(f"⚠ {a['name']}: {ratio:.0f}% of reviews are unverified — possible fake review risk")

    if not alerts:
        return "✅ No anomalies detected. All agencies are operating within normal parameters."

    return f"Anomaly Report ({len(alerts)} alerts):\n\n" + "\n".join(alerts)


@tool
def explain_trust_algorithm() -> str:
    """Explain how the trust score algorithm works, including all factors, weights, and tier thresholds."""
    return """Trust Score Algorithm:

The JSO platform uses a weighted multi-factor trust score from 0-100:

Formula: Score = (0.30 × Reviews) + (0.25 × Placements) + (0.20 × Feedback) + (0.15 × Compliance) + (0.10 × Tenure)

Factor Breakdown:
• Reviews (30%): Normalized average rating (rating/5 × 100)
• Placements (25%): Successful placement rate (successful/total × 100)
• Feedback (20%): Normalized employer+candidate feedback (feedback/5 × 100)
• Compliance (15%): Regulatory compliance score (0-100)
• Tenure (10%): Platform tenure capped at 36 months (months/36 × 100, max 100)

Trust Tiers:
• Excellent: 80-100 — Highly trusted, verified track record
• Good: 60-79 — Generally reliable, minor areas for improvement
• Fair: 40-59 — Use with caution, notable gaps in performance
• Poor: 0-39 — Not recommended, serious concerns flagged

The algorithm is transparent — agencies can request a full breakdown of their score at any time.
Scores are recalculated daily. All changes are logged in an audit trail."""


ALL_TOOLS = [
    search_agencies,
    get_agency_trust_details,
    compare_agencies,
    get_platform_stats,
    detect_anomalies,
    explain_trust_algorithm,
]
