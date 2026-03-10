# JSO Agency Trust & Transparency Agent

An AI-powered platform for evaluating and monitoring recruitment agency trustworthiness on the JSO ecosystem.

---

## Overview

Users on job platforms cannot easily determine which recruitment agencies are trustworthy — leading to wasted time, fraud exposure, and platform credibility issues. The **Agency Trust & Transparency Agent** solves this by:

- Computing **transparent trust scores** (0–100) from reviews, placement success rates, feedback ratings, compliance records, and platform tenure
- Providing a **conversational AI interface** for querying agency trustworthiness
- Surfacing **real-time analytics** and trend monitoring across dashboards
- Detecting **anomalies** (fake reviews, declining agencies) and alerting stakeholders

## Prototype

### Tech Stack
- **Frontend:** Next.js 16 + React + TypeScript + Tailwind CSS
- **Charts:** Recharts
- **Icons:** Lucide React
- **Deployment-ready:** Vercel-compatible

### Running Locally

```bash
cd prototype
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Features

| Feature | Description |
|---------|-------------|
| **Agency Dashboard** | Browse agencies sorted by trust score with search, filter, and sort |
| **Trust Score Badges** | Visual score circles with tier labels (Excellent/Good/Fair/Poor) |
| **Agency Detail View** | Click any agency for full breakdown — score history charts, component analysis, reviews |
| **Compare Agencies** | Side-by-side radar chart comparison of up to 3 agencies with detailed metrics table |
| **Admin Reports** | Platform-wide analytics — flagged agencies, trust rankings, trend lines, compliance overview |
| **AI Chat Agent** | Conversational interface to ask about agency trust (bottom-right chat button) |
| **Trust Analytics** | Pie charts and bar charts showing trust distribution and placement rates |
| **Score Explanation** | Transparent algorithm display showing all weights and factors |

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/agencies` | GET | List all agencies with optional filters |
| `/api/agencies/[id]` | GET | Get agency details + trust score breakdown |
| `/api/agent/chat` | POST | Send natural language query to the trust agent |

### Architecture

```
Client (Next.js + React)
  → API Layer (Next.js API Routes)
    → Agent Orchestration (Trust Score Calculator + Chat Agent)
      → Data Layer (Mock data / Supabase in production)
        → AI Layer (Claude API in production)
```

## Trust Score Algorithm

```
Trust Score = (0.30 × Reviews) + (0.25 × Placements) + (0.20 × Feedback) 
            + (0.15 × Compliance) + (0.10 × Tenure)
```

| Tier | Score Range |
|------|-------------|
| Excellent | 80–100 |
| Good | 60–79 |
| Fair | 40–59 |
| Poor | 0–39 |

## Project Structure

```
JSO-Agent/
├── README.md                # This file
└── prototype/               # Next.js application
    └── src/
        ├── app/
        │   ├── page.tsx             # Main dashboard page
        │   ├── components/          # UI components
        │   │   ├── AdminReports.tsx   # Admin trust reports & flagged agencies
        │   │   ├── AgencyCard.tsx     # Agency listing card
        │   │   ├── AgencyDetail.tsx   # Detail modal with charts
        │   │   ├── ChatWidget.tsx     # AI chat interface
        │   │   ├── CompareView.tsx    # Side-by-side agency comparison
        │   │   ├── DashboardStats.tsx # Stats overview
        │   │   └── TrustDistribution.tsx # Analytics charts
        │   └── api/
        │       ├── agencies/         # Agency API routes
        │       └── agent/chat/       # Chat agent API
        └── lib/
            └── data.ts              # Data models, mock data, scoring logic
```

## Deployment

Deploy to Vercel with:
- **Root Directory:** `prototype`
- **Framework:** Next.js (auto-detected)
- **Build Command:** `npm run build`
- No environment variables required