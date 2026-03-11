"""Agency API endpoints — backed by Supabase."""

from fastapi import APIRouter, HTTPException, Query
from database import get_supabase

router = APIRouter(prefix="/api/agencies", tags=["agencies"])


@router.get("")
def list_agencies(
    industry: str | None = Query(None),
    min_score: float | None = Query(None, alias="minScore"),
    sort_by: str = Query("trust_score", alias="sortBy"),
):
    db = get_supabase()
    q = db.table("agencies").select("*")

    if min_score is not None:
        q = q.gte("trust_score", min_score)

    sort_col = {
        "trustScore": "trust_score",
        "trust_score": "trust_score",
        "placements": "successful_placements",
        "rating": "average_rating",
    }.get(sort_by, "trust_score")

    result = q.order(sort_col, desc=True).execute()
    agencies = result.data

    if industry:
        il = industry.lower()
        agencies = [a for a in agencies if any(il in i.lower() for i in a.get("industry", []))]

    # Convert snake_case to camelCase for frontend compatibility
    return {"agencies": [_to_camel(a) for a in agencies]}


@router.get("/{agency_id}")
def get_agency(agency_id: str):
    db = get_supabase()
    result = db.table("agencies").select("*").eq("id", agency_id).execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Agency not found")

    a = result.data[0]

    # Get score history
    history = db.table("score_history").select("month, score").eq("agency_id", agency_id).order("month").execute()

    # Get reviews
    reviews = db.table("reviews").select("*").eq("agency_id", agency_id).order("created_at", desc=True).execute()

    # Compute trust score breakdown
    from datetime import datetime, timezone
    reviews_c = (a["average_rating"] / 5) * 100 * 0.30
    rate = (a["successful_placements"] / a["total_placements"] * 100) if a["total_placements"] > 0 else 0
    placements_c = rate * 0.25
    feedback_c = (a["average_feedback"] / 5) * 100 * 0.20
    compliance_c = a["compliance_score"] * 0.15
    joined = datetime.strptime(a["joined_at"], "%Y-%m-%d")
    months = (datetime.now(timezone.utc) - joined.replace(tzinfo=timezone.utc)).days / 30
    tenure_c = min(months / 36 * 100, 100) * 0.10

    breakdown = {
        "reviews": round(reviews_c, 1),
        "placements": round(placements_c, 1),
        "feedback": round(feedback_c, 1),
        "compliance": round(compliance_c, 1),
        "tenure": round(tenure_c, 1),
        "total": round(reviews_c + placements_c + feedback_c + compliance_c + tenure_c, 1),
    }

    agency_data = _to_camel(a)
    agency_data["scoreHistory"] = history.data
    agency_data["recentReviews"] = [_review_to_camel(r) for r in reviews.data]

    return {"agency": agency_data, "breakdown": breakdown}


def _to_camel(a: dict) -> dict:
    """Convert agency row to camelCase for frontend."""
    return {
        "id": a["id"],
        "name": a["name"],
        "industry": a.get("industry", []),
        "location": a["location"],
        "joinedAt": a["joined_at"],
        "licenseStatus": a["license_status"],
        "trustScore": float(a["trust_score"]),
        "trustTier": a["trust_tier"],
        "description": a.get("description", ""),
        "totalPlacements": a["total_placements"],
        "successfulPlacements": a["successful_placements"],
        "totalReviews": a["total_reviews"],
        "averageRating": float(a["average_rating"]),
        "averageFeedback": float(a["average_feedback"]),
        "complianceScore": float(a["compliance_score"]),
        "trendDirection": a["trend_direction"],
    }


def _review_to_camel(r: dict) -> dict:
    return {
        "id": r["id"],
        "userId": r["user_id"],
        "rating": float(r["rating"]),
        "text": r["text"],
        "sentiment": r["sentiment"],
        "isVerified": r["is_verified"],
        "createdAt": r["created_at"],
    }
