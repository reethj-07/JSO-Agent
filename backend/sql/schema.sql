-- JSO Agency Trust & Transparency Agent — Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- Agencies table
CREATE TABLE IF NOT EXISTS agencies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    industry TEXT[] NOT NULL DEFAULT '{}',
    location TEXT NOT NULL,
    joined_at DATE NOT NULL,
    license_status TEXT NOT NULL DEFAULT 'active'
        CHECK (license_status IN ('active', 'suspended', 'under_review')),
    trust_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    trust_tier TEXT NOT NULL DEFAULT 'Poor'
        CHECK (trust_tier IN ('Excellent', 'Good', 'Fair', 'Poor')),
    description TEXT,
    total_placements INTEGER NOT NULL DEFAULT 0,
    successful_placements INTEGER NOT NULL DEFAULT 0,
    total_reviews INTEGER NOT NULL DEFAULT 0,
    average_rating NUMERIC(3,2) NOT NULL DEFAULT 0,
    average_feedback NUMERIC(3,2) NOT NULL DEFAULT 0,
    compliance_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    trend_direction TEXT NOT NULL DEFAULT 'stable'
        CHECK (trend_direction IN ('up', 'down', 'stable')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    agency_id TEXT NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    rating NUMERIC(3,2) NOT NULL CHECK (rating >= 0 AND rating <= 5),
    text TEXT NOT NULL,
    sentiment TEXT NOT NULL DEFAULT 'neutral'
        CHECK (sentiment IN ('positive', 'neutral', 'negative')),
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Score history table
CREATE TABLE IF NOT EXISTS score_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id TEXT NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    month TEXT NOT NULL,
    score NUMERIC(5,2) NOT NULL,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent interaction logs
CREATE TABLE IF NOT EXISTS agent_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query TEXT NOT NULL,
    response TEXT NOT NULL,
    tools_used TEXT[] DEFAULT '{}',
    model TEXT NOT NULL,
    latency_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_agencies_trust_score ON agencies(trust_score DESC);
CREATE INDEX IF NOT EXISTS idx_agencies_trust_tier ON agencies(trust_tier);
CREATE INDEX IF NOT EXISTS idx_agencies_industry ON agencies USING GIN(industry);
CREATE INDEX IF NOT EXISTS idx_reviews_agency_id ON reviews(agency_id);
CREATE INDEX IF NOT EXISTS idx_score_history_agency_id ON score_history(agency_id);
CREATE INDEX IF NOT EXISTS idx_agent_interactions_created ON agent_interactions(created_at DESC);

-- Row Level Security
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE score_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_interactions ENABLE ROW LEVEL SECURITY;

-- Public read access policies (anon key can read)
CREATE POLICY "Public read agencies" ON agencies FOR SELECT USING (true);
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Public read score_history" ON score_history FOR SELECT USING (true);

-- Agent can insert interaction logs
CREATE POLICY "Agent insert interactions" ON agent_interactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read interactions" ON agent_interactions FOR SELECT USING (true);
