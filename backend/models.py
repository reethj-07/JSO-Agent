from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime


class LicenseStatus(str, Enum):
    active = "active"
    suspended = "suspended"
    under_review = "under_review"


class TrustTier(str, Enum):
    excellent = "Excellent"
    good = "Good"
    fair = "Fair"
    poor = "Poor"


class TrendDirection(str, Enum):
    up = "up"
    down = "down"
    stable = "stable"


class Sentiment(str, Enum):
    positive = "positive"
    neutral = "neutral"
    negative = "negative"


class Agency(BaseModel):
    id: str
    name: str
    industry: list[str]
    location: str
    joined_at: str
    license_status: LicenseStatus
    trust_score: float
    trust_tier: TrustTier
    description: str
    total_placements: int
    successful_placements: int
    total_reviews: int
    average_rating: float
    average_feedback: float
    compliance_score: float
    trend_direction: TrendDirection


class Review(BaseModel):
    id: str
    agency_id: str
    user_id: str
    rating: float
    text: str
    sentiment: Sentiment
    is_verified: bool
    created_at: str


class ScoreHistory(BaseModel):
    id: str | None = None
    agency_id: str
    month: str
    score: float


class TrustScoreBreakdown(BaseModel):
    reviews: float
    placements: float
    feedback: float
    compliance: float
    tenure: float
    total: float


class ChatRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=500)


class ChatResponse(BaseModel):
    query: str
    response: str
    timestamp: str
    model: str
    tools_used: list[str] = []


class AgencyListParams(BaseModel):
    industry: str | None = None
    min_score: float | None = None
    sort_by: str = "trust_score"
