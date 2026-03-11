"""Seed the Supabase database with agency data."""

import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from database import get_supabase

AGENCIES = [
    {
        "id": "ag-001",
        "name": "TechPlace Global",
        "industry": ["Information Technology", "Software Engineering"],
        "location": "Bangalore, India",
        "joined_at": "2023-03-15",
        "license_status": "active",
        "trust_score": 94,
        "trust_tier": "Excellent",
        "description": "Leading IT placement agency with strong track record in European and North American markets. Specializes in software engineering, data science, and cloud architecture roles.",
        "total_placements": 438,
        "successful_placements": 342,
        "total_reviews": 287,
        "average_rating": 4.6,
        "average_feedback": 4.5,
        "compliance_score": 100,
        "trend_direction": "up",
    },
    {
        "id": "ag-002",
        "name": "CareerBridge Solutions",
        "industry": ["Healthcare", "Nursing"],
        "location": "Manila, Philippines",
        "joined_at": "2022-08-20",
        "license_status": "active",
        "trust_score": 78,
        "trust_tier": "Good",
        "description": "Healthcare-focused agency providing nursing and medical professional placements in the Gulf and European markets.",
        "total_placements": 312,
        "successful_placements": 218,
        "total_reviews": 156,
        "average_rating": 3.9,
        "average_feedback": 3.8,
        "compliance_score": 85,
        "trend_direction": "stable",
    },
    {
        "id": "ag-003",
        "name": "EliteForce Staffing",
        "industry": ["Construction", "Engineering"],
        "location": "Lagos, Nigeria",
        "joined_at": "2024-01-10",
        "license_status": "under_review",
        "trust_score": 45,
        "trust_tier": "Fair",
        "description": "Construction and engineering staffing agency primarily serving Middle Eastern infrastructure projects.",
        "total_placements": 89,
        "successful_placements": 41,
        "total_reviews": 67,
        "average_rating": 2.8,
        "average_feedback": 2.5,
        "compliance_score": 55,
        "trend_direction": "down",
    },
    {
        "id": "ag-004",
        "name": "GlobalReach HR",
        "industry": ["Finance", "Banking", "Consulting"],
        "location": "London, UK",
        "joined_at": "2021-11-05",
        "license_status": "active",
        "trust_score": 87,
        "trust_tier": "Excellent",
        "description": "Premium finance and consulting placement firm with a global network across 30+ countries. Known for executive-level placements.",
        "total_placements": 567,
        "successful_placements": 489,
        "total_reviews": 402,
        "average_rating": 4.4,
        "average_feedback": 4.3,
        "compliance_score": 95,
        "trend_direction": "up",
    },
    {
        "id": "ag-005",
        "name": "NovaTalent Asia",
        "industry": ["Marketing", "Creative", "Digital Media"],
        "location": "Singapore",
        "joined_at": "2023-06-01",
        "license_status": "active",
        "trust_score": 65,
        "trust_tier": "Good",
        "description": "Creative and digital marketing talent agency serving Southeast Asian markets. Growing rapidly with focus on startup ecosystems.",
        "total_placements": 145,
        "successful_placements": 98,
        "total_reviews": 89,
        "average_rating": 3.5,
        "average_feedback": 3.6,
        "compliance_score": 78,
        "trend_direction": "up",
    },
    {
        "id": "ag-006",
        "name": "SwiftHire International",
        "industry": ["Hospitality", "Tourism", "Retail"],
        "location": "Dubai, UAE",
        "joined_at": "2024-03-20",
        "license_status": "active",
        "trust_score": 32,
        "trust_tier": "Poor",
        "description": "Hospitality and retail staffing agency focused on Gulf markets. New entrant with limited track record.",
        "total_placements": 56,
        "successful_placements": 23,
        "total_reviews": 34,
        "average_rating": 2.1,
        "average_feedback": 2.0,
        "compliance_score": 40,
        "trend_direction": "down",
    },
]

SCORE_HISTORIES = {
    "ag-001": [
        ("Oct", 88), ("Nov", 89), ("Dec", 91), ("Jan", 92), ("Feb", 93), ("Mar", 94),
    ],
    "ag-002": [
        ("Oct", 75), ("Nov", 77), ("Dec", 76), ("Jan", 78), ("Feb", 77), ("Mar", 78),
    ],
    "ag-003": [
        ("Oct", 52), ("Nov", 50), ("Dec", 48), ("Jan", 47), ("Feb", 46), ("Mar", 45),
    ],
    "ag-004": [
        ("Oct", 82), ("Nov", 83), ("Dec", 84), ("Jan", 85), ("Feb", 86), ("Mar", 87),
    ],
    "ag-005": [
        ("Oct", 58), ("Nov", 59), ("Dec", 61), ("Jan", 62), ("Feb", 64), ("Mar", 65),
    ],
    "ag-006": [
        ("Oct", 40), ("Nov", 38), ("Dec", 36), ("Jan", 34), ("Feb", 33), ("Mar", 32),
    ],
}

REVIEWS = {
    "ag-001": [
        {"id": "r-001", "user_id": "u-101", "rating": 5.0, "text": "Excellent placement experience. Got placed within 3 weeks.", "sentiment": "positive", "is_verified": True},
        {"id": "r-002", "user_id": "u-102", "rating": 4.5, "text": "Very professional team. Good communication throughout.", "sentiment": "positive", "is_verified": True},
        {"id": "r-003", "user_id": "u-103", "rating": 4.0, "text": "Good service but could improve onboarding documentation.", "sentiment": "positive", "is_verified": False},
    ],
    "ag-002": [
        {"id": "r-004", "user_id": "u-104", "rating": 4.0, "text": "Reliable healthcare placements. Process was smooth.", "sentiment": "positive", "is_verified": True},
        {"id": "r-005", "user_id": "u-105", "rating": 3.5, "text": "Decent agency but placement took longer than expected.", "sentiment": "neutral", "is_verified": True},
    ],
    "ag-003": [
        {"id": "r-006", "user_id": "u-106", "rating": 2.0, "text": "Poor communication and hidden fees. Would not recommend.", "sentiment": "negative", "is_verified": True},
        {"id": "r-007", "user_id": "u-107", "rating": 3.0, "text": "Average service. Got the job but process was disorganized.", "sentiment": "neutral", "is_verified": False},
    ],
    "ag-004": [
        {"id": "r-008", "user_id": "u-108", "rating": 5.0, "text": "Top-tier finance placement. They placed me at a Big 4 firm.", "sentiment": "positive", "is_verified": True},
        {"id": "r-009", "user_id": "u-109", "rating": 4.0, "text": "Professional and well-connected. Great for banking roles.", "sentiment": "positive", "is_verified": True},
    ],
    "ag-005": [
        {"id": "r-010", "user_id": "u-110", "rating": 3.5, "text": "Growing agency with potential. Good for creative roles.", "sentiment": "neutral", "is_verified": True},
        {"id": "r-011", "user_id": "u-111", "rating": 4.0, "text": "Found me a great marketing role in Singapore. Responsive team.", "sentiment": "positive", "is_verified": True},
    ],
    "ag-006": [
        {"id": "r-012", "user_id": "u-112", "rating": 2.0, "text": "Very slow process. No updates for weeks.", "sentiment": "negative", "is_verified": True},
        {"id": "r-013", "user_id": "u-113", "rating": 1.5, "text": "Misleading job descriptions. The actual role was completely different.", "sentiment": "negative", "is_verified": True},
    ],
}


def seed():
    db = get_supabase()

    print("Seeding agencies...")
    for agency in AGENCIES:
        db.table("agencies").upsert(agency).execute()
    print(f"  ✓ {len(AGENCIES)} agencies seeded")

    print("Seeding score history...")
    # Clear existing and re-insert
    for agency_id in SCORE_HISTORIES:
        db.table("score_history").delete().eq("agency_id", agency_id).execute()
    count = 0
    for agency_id, months in SCORE_HISTORIES.items():
        for month, score in months:
            db.table("score_history").insert(
                {"agency_id": agency_id, "month": month, "score": score}
            ).execute()
            count += 1
    print(f"  ✓ {count} score history records seeded")

    print("Seeding reviews...")
    count = 0
    for agency_id, reviews in REVIEWS.items():
        for review in reviews:
            review["agency_id"] = agency_id
            db.table("reviews").upsert(review).execute()
            count += 1
    print(f"  ✓ {count} reviews seeded")

    print("\n✅ Database seeded successfully!")


if __name__ == "__main__":
    seed()
