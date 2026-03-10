# JSO Agency Trust & Transparency Agent

**Assignment:** Agentic JSO — Phase-2: Agentic Career Intelligence Development  
**Candidate:** Reeth J  
**Role:** Agentic AI Engineer Intern (Career Intelligence Systems)  
**Company:** AariyaTech Corp Private Limited

---

## Overview

This repository contains the complete submission for the Agentic JSO assignment, including:

- **[ASSIGNMENT_ANSWERS.md](ASSIGNMENT_ANSWERS.md)** — Full written answers for Part A (all 7 sections), Part B (Agency Trust & Transparency Agent design), and Part C (Ethical & Governance considerations)
- **[prototype/](prototype/)** — A working Next.js prototype demonstrating the Agency Trust & Transparency Agent

## The Problem

Users on the JSO platform cannot easily determine which recruitment agencies are trustworthy. This leads to wasted time, fraud exposure, and platform credibility issues.

## The Solution

An AI-powered **Agency Trust & Transparency Agent** that:
- Computes **transparent trust scores** (0–100) from reviews, placement success rates, feedback ratings, compliance records, and platform tenure
- Provides a **conversational AI interface** for querying agency trustworthiness
- Surfaces **real-time analytics** and trend monitoring across all four JSO dashboards
- Detects **anomalies** (fake reviews, declining agencies) and alerts stakeholders

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
| **Agency Dashboard** | Browse agencies sorted by trust score with search and filter |
| **Trust Score Badges** | Visual score circles with tier labels (Excellent/Good/Fair/Poor) |
| **Agency Detail View** | Click any agency for full breakdown — score history charts, component analysis, reviews |
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
├── ASSIGNMENT_ANSWERS.md    # Complete assignment answers (Parts A, B, C)
├── README.md                # This file
├── Rules/                   # Assignment PDF
└── prototype/               # Working Next.js prototype
    └── src/
        ├── app/
        │   ├── page.tsx             # Main dashboard page
        │   ├── components/          # UI components
        │   │   ├── AgencyCard.tsx    # Agency listing card
        │   │   ├── AgencyDetail.tsx  # Detail modal with charts
        │   │   ├── ChatWidget.tsx    # AI chat interface
        │   │   ├── DashboardStats.tsx # Stats overview
        │   │   └── TrustDistribution.tsx # Analytics charts
        │   └── api/
        │       ├── agencies/         # Agency API routes
        │       └── agent/chat/       # Chat agent API
        └── lib/
            └── data.ts              # Data models, mock data, scoring logic
```

## Deployment

This prototype is ready to deploy on Vercel:

```bash
cd prototype
npx vercel
```