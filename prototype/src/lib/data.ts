// Mock data representing agencies on the JSO platform
// In production, this would come from Supabase PostgreSQL

export interface Agency {
  id: string;
  name: string;
  industry: string[];
  location: string;
  joinedAt: string;
  licenseStatus: "active" | "suspended" | "under_review";
  trustScore: number;
  trustTier: "Excellent" | "Good" | "Fair" | "Poor";
  description: string;
  totalPlacements: number;
  successfulPlacements: number;
  totalReviews: number;
  averageRating: number;
  averageFeedback: number;
  complianceScore: number;
  trendDirection: "up" | "down" | "stable";
  scoreHistory: { month: string; score: number }[];
  recentReviews: Review[];
  strengths: string[];
  concerns: string[];
}

export interface Review {
  id: string;
  userId: string;
  rating: number;
  text: string;
  sentiment: "positive" | "neutral" | "negative";
  isVerified: boolean;
  createdAt: string;
}

export interface TrustScoreBreakdown {
  reviews: number;
  placements: number;
  feedback: number;
  compliance: number;
  tenure: number;
  total: number;
}

function getTrustTier(score: number): Agency["trustTier"] {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Poor";
}

export const agencies: Agency[] = [
  {
    id: "ag-001",
    name: "TechPlace Global",
    industry: ["Information Technology", "Software Engineering"],
    location: "Bangalore, India",
    joinedAt: "2023-03-15",
    licenseStatus: "active",
    trustScore: 94,
    trustTier: getTrustTier(94),
    description:
      "Leading IT placement agency with strong track record in European and North American markets. Specializes in software engineering, data science, and cloud architecture roles.",
    totalPlacements: 438,
    successfulPlacements: 342,
    totalReviews: 287,
    averageRating: 4.6,
    averageFeedback: 4.5,
    complianceScore: 100,
    trendDirection: "up",
    scoreHistory: [
      { month: "Oct", score: 88 },
      { month: "Nov", score: 89 },
      { month: "Dec", score: 91 },
      { month: "Jan", score: 92 },
      { month: "Feb", score: 93 },
      { month: "Mar", score: 94 },
    ],
    recentReviews: [
      {
        id: "r-001",
        userId: "u-101",
        rating: 5,
        text: "Excellent experience. Got placed within 6 weeks. The team was responsive and professional throughout.",
        sentiment: "positive",
        isVerified: true,
        createdAt: "2026-02-28",
      },
      {
        id: "r-002",
        userId: "u-102",
        rating: 4,
        text: "Good agency overall. Communication could be slightly faster but the placement quality is top-notch.",
        sentiment: "positive",
        isVerified: true,
        createdAt: "2026-02-15",
      },
      {
        id: "r-003",
        userId: "u-103",
        rating: 5,
        text: "They matched me with exactly the kind of role I was looking for. Very professional team.",
        sentiment: "positive",
        isVerified: true,
        createdAt: "2026-01-20",
      },
    ],
    strengths: [
      "High placement success rate (78%)",
      "Strong in EU tech markets",
      "96% verified genuine reviews",
      "Fast average time-to-placement (45 days)",
    ],
    concerns: [],
  },
  {
    id: "ag-002",
    name: "CareerBridge International",
    industry: ["Healthcare", "Nursing", "Medical"],
    location: "Mumbai, India",
    joinedAt: "2023-06-20",
    licenseStatus: "active",
    trustScore: 87,
    trustTier: getTrustTier(87),
    description:
      "Specialized healthcare recruitment agency connecting medical professionals with hospitals and clinics worldwide. Strong presence in UK and Middle East markets.",
    totalPlacements: 312,
    successfulPlacements: 203,
    totalReviews: 198,
    averageRating: 4.3,
    averageFeedback: 4.2,
    complianceScore: 95,
    trendDirection: "stable",
    scoreHistory: [
      { month: "Oct", score: 85 },
      { month: "Nov", score: 86 },
      { month: "Dec", score: 86 },
      { month: "Jan", score: 87 },
      { month: "Feb", score: 87 },
      { month: "Mar", score: 87 },
    ],
    recentReviews: [
      {
        id: "r-004",
        userId: "u-104",
        rating: 4,
        text: "They helped me find a nursing position in Dubai. Process took about 2 months but everything was transparent.",
        sentiment: "positive",
        isVerified: true,
        createdAt: "2026-03-01",
      },
      {
        id: "r-005",
        userId: "u-105",
        rating: 5,
        text: "Amazing support for healthcare workers. They handle all documentation and visa processes.",
        sentiment: "positive",
        isVerified: true,
        createdAt: "2026-02-10",
      },
    ],
    strengths: [
      "Excellent in healthcare sector",
      "End-to-end visa support",
      "Strong UK & Middle East network",
    ],
    concerns: ["Slightly longer placement times for specialized roles"],
  },
  {
    id: "ag-003",
    name: "GlobalReach Staffing",
    industry: ["Finance", "Banking", "Accounting"],
    location: "Delhi, India",
    joinedAt: "2024-01-10",
    licenseStatus: "active",
    trustScore: 72,
    trustTier: getTrustTier(72),
    description:
      "Finance and banking sector recruitment agency. Growing presence in Singapore and Hong Kong markets. Relatively new to the platform.",
    totalPlacements: 145,
    successfulPlacements: 87,
    totalReviews: 96,
    averageRating: 3.8,
    averageFeedback: 3.9,
    complianceScore: 85,
    trendDirection: "up",
    scoreHistory: [
      { month: "Oct", score: 62 },
      { month: "Nov", score: 64 },
      { month: "Dec", score: 66 },
      { month: "Jan", score: 68 },
      { month: "Feb", score: 70 },
      { month: "Mar", score: 72 },
    ],
    recentReviews: [
      {
        id: "r-006",
        userId: "u-106",
        rating: 4,
        text: "Good for finance roles. They're still growing but showing real improvement.",
        sentiment: "positive",
        isVerified: true,
        createdAt: "2026-02-25",
      },
      {
        id: "r-007",
        userId: "u-107",
        rating: 3,
        text: "Average experience. Got placed but took longer than expected. Communication needs improvement.",
        sentiment: "neutral",
        isVerified: true,
        createdAt: "2026-02-01",
      },
    ],
    strengths: [
      "Rapidly improving trust score",
      "Good finance sector specialization",
    ],
    concerns: [
      "Relatively new on platform",
      "Communication speed needs improvement",
    ],
  },
  {
    id: "ag-004",
    name: "QuickHire Solutions",
    industry: ["General", "Retail", "Hospitality"],
    location: "Hyderabad, India",
    joinedAt: "2024-06-01",
    licenseStatus: "under_review",
    trustScore: 45,
    trustTier: getTrustTier(45),
    description:
      "General staffing agency covering retail and hospitality sectors. Currently under review due to recent feedback concerns.",
    totalPlacements: 89,
    successfulPlacements: 31,
    totalReviews: 67,
    averageRating: 2.8,
    averageFeedback: 2.5,
    complianceScore: 60,
    trendDirection: "down",
    scoreHistory: [
      { month: "Oct", score: 58 },
      { month: "Nov", score: 55 },
      { month: "Dec", score: 52 },
      { month: "Jan", score: 50 },
      { month: "Feb", score: 48 },
      { month: "Mar", score: 45 },
    ],
    recentReviews: [
      {
        id: "r-008",
        userId: "u-108",
        rating: 2,
        text: "They promised a lot but delivery was poor. Took my documents and then went silent for weeks.",
        sentiment: "negative",
        isVerified: true,
        createdAt: "2026-03-02",
      },
      {
        id: "r-009",
        userId: "u-109",
        rating: 1,
        text: "Very disappointing experience. No follow-up after initial meeting.",
        sentiment: "negative",
        isVerified: true,
        createdAt: "2026-02-18",
      },
      {
        id: "r-010",
        userId: "u-110",
        rating: 3,
        text: "Okay for basic retail jobs, but don't expect much support during the process.",
        sentiment: "neutral",
        isVerified: true,
        createdAt: "2026-01-30",
      },
    ],
    strengths: ["Quick initial response time"],
    concerns: [
      "Declining trust score trend",
      "Low placement success rate (35%)",
      "Multiple negative reviews about communication",
      "Under compliance review",
    ],
  },
  {
    id: "ag-005",
    name: "EliteForce Consulting",
    industry: ["Engineering", "Manufacturing", "Construction"],
    location: "Chennai, India",
    joinedAt: "2023-09-01",
    licenseStatus: "active",
    trustScore: 81,
    trustTier: getTrustTier(81),
    description:
      "Engineering and manufacturing recruitment specialists. Strong connections with companies in Germany, Japan, and Australia.",
    totalPlacements: 256,
    successfulPlacements: 179,
    totalReviews: 164,
    averageRating: 4.1,
    averageFeedback: 4.0,
    complianceScore: 92,
    trendDirection: "stable",
    scoreHistory: [
      { month: "Oct", score: 80 },
      { month: "Nov", score: 80 },
      { month: "Dec", score: 81 },
      { month: "Jan", score: 81 },
      { month: "Feb", score: 81 },
      { month: "Mar", score: 81 },
    ],
    recentReviews: [
      {
        id: "r-011",
        userId: "u-111",
        rating: 4,
        text: "Solid agency for engineering roles. They have real contacts in German companies.",
        sentiment: "positive",
        isVerified: true,
        createdAt: "2026-02-20",
      },
      {
        id: "r-012",
        userId: "u-112",
        rating: 4,
        text: "Reliable and honest about realistic expectations. Got placed in a manufacturing firm in Melbourne.",
        sentiment: "positive",
        isVerified: true,
        createdAt: "2026-01-15",
      },
    ],
    strengths: [
      "Strong engineering sector expertise",
      "Good international connections",
      "Honest and transparent process",
    ],
    concerns: ["Limited to engineering/manufacturing sectors"],
  },
  {
    id: "ag-006",
    name: "NovaTalent Agency",
    industry: ["Marketing", "Design", "Creative"],
    location: "Pune, India",
    joinedAt: "2024-03-15",
    licenseStatus: "active",
    trustScore: 68,
    trustTier: getTrustTier(68),
    description:
      "Creative industry recruitment agency focusing on marketing, UX design, and digital media roles. Growing presence in North American and European markets.",
    totalPlacements: 98,
    successfulPlacements: 54,
    totalReviews: 72,
    averageRating: 3.6,
    averageFeedback: 3.7,
    complianceScore: 88,
    trendDirection: "up",
    scoreHistory: [
      { month: "Oct", score: 58 },
      { month: "Nov", score: 60 },
      { month: "Dec", score: 62 },
      { month: "Jan", score: 64 },
      { month: "Feb", score: 66 },
      { month: "Mar", score: 68 },
    ],
    recentReviews: [
      {
        id: "r-013",
        userId: "u-113",
        rating: 4,
        text: "Great for creative roles. They understand the design industry well.",
        sentiment: "positive",
        isVerified: true,
        createdAt: "2026-02-22",
      },
      {
        id: "r-014",
        userId: "u-114",
        rating: 3,
        text: "Decent experience. Still building their network but the team is genuinely helpful.",
        sentiment: "neutral",
        isVerified: true,
        createdAt: "2026-02-05",
      },
    ],
    strengths: [
      "Good understanding of creative industry",
      "Improving trust trajectory",
      "Supportive team",
    ],
    concerns: [
      "Smaller network compared to established agencies",
      "Relatively new on platform",
    ],
  },
];

// Trust Score Calculator
export function calculateTrustScore(agency: Agency): TrustScoreBreakdown {
  const W1 = 0.3; // Reviews
  const W2 = 0.25; // Placements
  const W3 = 0.2; // Feedback
  const W4 = 0.15; // Compliance
  const W5 = 0.1; // Tenure

  const reviewScore = (agency.averageRating / 5) * 100;
  const placementScore =
    agency.totalPlacements > 0
      ? (agency.successfulPlacements / agency.totalPlacements) * 100
      : 0;
  const feedbackScore = (agency.averageFeedback / 5) * 100;
  const complianceScoreVal = agency.complianceScore;

  const joinDate = new Date(agency.joinedAt);
  const now = new Date();
  const yearsOnPlatform =
    (now.getTime() - joinDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  const tenureScore = Math.min(yearsOnPlatform / 5, 1) * 100;

  const total =
    W1 * reviewScore +
    W2 * placementScore +
    W3 * feedbackScore +
    W4 * complianceScoreVal +
    W5 * tenureScore;

  return {
    reviews: Math.round(reviewScore),
    placements: Math.round(placementScore),
    feedback: Math.round(feedbackScore),
    compliance: Math.round(complianceScoreVal),
    tenure: Math.round(tenureScore),
    total: Math.round(total),
  };
}

// Simulated AI agent chat responses
export function getAgentResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes("most trusted") || q.includes("best") || q.includes("top") || q.includes("recommend")) {
    return `Based on my analysis of all agencies on the JSO platform, here are the top-trusted agencies:\n\n1. **TechPlace Global** — Trust Score: 94/100 (Excellent)\n   - Placement Rate: 78% | 287 verified reviews | Trend: ↑ Improving\n   - Specializes in IT/Software Engineering\n\n2. **CareerBridge International** — Trust Score: 87/100 (Excellent)\n   - Placement Rate: 65% | 198 verified reviews | Trend: → Stable\n   - Specializes in Healthcare/Nursing\n\n3. **EliteForce Consulting** — Trust Score: 81/100 (Excellent)\n   - Placement Rate: 70% | 164 verified reviews | Trend: → Stable\n   - Specializes in Engineering/Manufacturing\n\nThese agencies have consistently demonstrated high placement success rates, positive user feedback, and strong compliance records.`;
  }

  if (q.includes("compare")) {
    return `**Agency Comparison Analysis:**\n\n| Metric | TechPlace Global | CareerBridge Int. |\n|--------|:---:|:---:|\n| Trust Score | 94/100 | 87/100 |\n| Trust Tier | Excellent | Excellent |\n| Placement Rate | 78% | 65% |\n| Average Rating | 4.6/5 | 4.3/5 |\n| Total Reviews | 287 | 198 |\n| Trend | ↑ Improving | → Stable |\n\n**Summary:** TechPlace Global leads in overall metrics, particularly in placement success rate and review volume. CareerBridge International is strong in the healthcare sector specifically. Your choice should depend on your industry focus.`;
  }

  if (q.includes("drop") || q.includes("declin") || q.includes("concern") || q.includes("risk") || q.includes("warning") || q.includes("flag")) {
    return `⚠️ **Agencies with Declining Trust Scores:**\n\n**QuickHire Solutions** — Score: 45/100 (Fair) | Trend: ↓ Declining\n- Score dropped from 58 to 45 over the last 6 months\n- Placement success rate is only 35%\n- 12 negative reviews in the last 30 days\n- Currently under compliance review\n- Key concern: Multiple users report lack of follow-up after initial contact\n\n**Recommended Actions:**\n1. Issue a formal performance warning to QuickHire Solutions\n2. Require a corrective action plan within 14 days\n3. Consider temporary suspension of new user assignments until review is complete\n4. Flag for licensing dashboard compliance check`;
  }

  if (q.includes("techplace")) {
    return `**TechPlace Global — Detailed Trust Analysis**\n\nTrust Score: 94/100 (Excellent)\n\n**Score Breakdown:**\n- Reviews: 92/100 (4.6 avg rating, 96% verified genuine)\n- Placement Success: 78/100 (342 successful out of 438)\n- Feedback Quality: 90/100 (consistently positive user feedback)\n- Compliance: 100/100 (zero violations)\n- Platform Tenure: 60/100 (3 years on JSO)\n\n**Key Strengths:**\n- Highest placement success rate on the platform\n- Strong specialization in EU tech markets\n- Very fast average time-to-placement (45 days)\n- Zero compliance violations\n\n**No Active Concerns**\n\nThis agency is recommended for IT/Software Engineering job seekers targeting European markets.`;
  }

  if (q.includes("careerbridge") || q.includes("career bridge")) {
    return `**CareerBridge International — Detailed Trust Analysis**\n\nTrust Score: 87/100 (Excellent)\n\n**Score Breakdown:**\n- Reviews: 86/100 (4.3 avg rating, strong verified base)\n- Placement Success: 65/100 (203 successful out of 312)\n- Feedback Quality: 84/100 (above platform average)\n- Compliance: 95/100 (minor documentation note, resolved)\n- Platform Tenure: 55/100 (2.7 years on JSO)\n\n**Key Strengths:**\n- Excellent healthcare sector specialization\n- End-to-end visa & documentation support\n- Strong UK & Middle East network\n\n**Minor Concerns:**\n- Slightly longer placement times for specialized roles\n\nHighly recommended for healthcare professionals seeking overseas placements.`;
  }

  if (q.includes("eliteforce") || q.includes("elite force")) {
    return `**EliteForce Consulting — Detailed Trust Analysis**\n\nTrust Score: 81/100 (Excellent)\n\n**Score Breakdown:**\n- Reviews: 82/100 (4.1 avg rating, reliable reviews)\n- Placement Success: 70/100 (179 successful out of 256)\n- Feedback Quality: 80/100 (consistently good)\n- Compliance: 92/100 (clean record)\n- Platform Tenure: 50/100 (2.5 years on JSO)\n\n**Key Strengths:**\n- Deep engineering & manufacturing expertise\n- Strong connections in Germany, Japan, and Australia\n- Transparent and honest about expectations\n\n**Minor Concerns:**\n- Industry focus limits breadth of roles available\n\nRecommended for engineers seeking international placements.`;
  }

  if (q.includes("globalreach") || q.includes("global reach")) {
    return `**GlobalReach Staffing — Detailed Trust Analysis**\n\nTrust Score: 72/100 (Good)\n\n**Score Breakdown:**\n- Reviews: 76/100 (3.8 avg rating, growing review base)\n- Placement Success: 60/100 (87 successful out of 145)\n- Feedback Quality: 78/100 (improving trajectory)\n- Compliance: 85/100 (clean record)\n- Platform Tenure: 30/100 (1.2 years on JSO)\n\n**Key Strengths:**\n- Finance sector specialization\n- Rapidly improving trust score (+10 points in 6 months)\n- Growing Singapore & Hong Kong network\n\n**Areas for Improvement:**\n- Communication speed can be inconsistent\n- Still relatively new, building track record\n\nA promising agency in the finance sector showing strong upward momentum.`;
  }

  if (q.includes("novatalent") || q.includes("nova talent")) {
    return `**NovaTalent Agency — Detailed Trust Analysis**\n\nTrust Score: 68/100 (Good)\n\n**Score Breakdown:**\n- Reviews: 72/100 (3.6 avg rating, growing)\n- Placement Success: 55/100 (54 successful out of 98)\n- Feedback Quality: 74/100 (positive trend)\n- Compliance: 88/100 (clean record)\n- Platform Tenure: 25/100 (1 year on JSO)\n\n**Key Strengths:**\n- Good understanding of creative & marketing industry\n- Improving trust trajectory (+10 points in 6 months)\n- Genuinely supportive team\n\n**Areas for Improvement:**\n- Smaller network compared to established agencies\n- Placement success rate below platform average\n\nPromising for marketing/design professionals; growing rapidly.`;
  }

  if (q.includes("quickhire") || q.includes("quick hire")) {
    return `**QuickHire Solutions — Detailed Trust Analysis**\n\nTrust Score: 45/100 (Fair) ⚠️\n\n**Score Breakdown:**\n- Reviews: 56/100 (2.8 avg rating, mixed feedback)\n- Placement Success: 35/100 (31 successful out of 89)\n- Feedback Quality: 50/100 (below platform average)\n- Compliance: 60/100 (under active review)\n- Platform Tenure: 20/100 (relatively new)\n\n**Key Concerns:**\n- Declining trust score (down 13 points in 6 months)\n- Very low placement success rate\n- Multiple reports of poor communication\n- Currently under compliance review\n\n**Recommendation:** Users should exercise caution when engaging with this agency. The platform is actively monitoring their performance.`;
  }

  if (q.includes("how") && (q.includes("score") || q.includes("calculat") || q.includes("work"))) {
    return `**How Trust Scores Are Calculated:**\n\nThe Agency Trust Score is a composite metric (0-100) computed from five weighted factors:\n\n| Factor | Weight | Description |\n|--------|:---:|-------------|\n| Reviews | 30% | Average rating from verified user reviews, weighted by recency |\n| Placement Success | 25% | Ratio of successful placements to total placements |\n| Feedback Rating | 20% | Average structured feedback score from users |\n| Compliance | 15% | Adherence to platform policies, zero violations = full score |\n| Platform Tenure | 10% | Years active on JSO, capped at 5 years |\n\n**Trust Tiers:**\n- 🟢 Excellent: 80-100\n- 🔵 Good: 60-79\n- 🟡 Fair: 40-59\n- 🔴 Poor: 0-39\n\nScores are recalculated daily and significant changes trigger automatic admin alerts. All factors and weights are transparent to ensure accountability.`;
  }

  if (q.includes("it") || q.includes("tech") || q.includes("software") || q.includes("engineer")) {
    return `**Agencies for IT / Software Engineering:**\n\n1. **TechPlace Global** — Trust Score: 94/100 (Excellent) ⭐ Top Pick\n   - 78% placement success | 287 reviews | Trend: ↑\n   - Specializes in software engineering, data science, cloud architecture\n   - Strong EU & North American market presence\n\n2. **EliteForce Consulting** — Trust Score: 81/100 (Excellent)\n   - 70% placement success | 164 reviews | Trend: → Stable\n   - Engineering focus includes software-adjacent roles\n   - Strong in Germany, Japan, Australia\n\nTechPlace Global is the clear recommendation for IT professionals, with the highest trust score and placement rate on the platform.`;
  }

  if (q.includes("healthcare") || q.includes("nurs") || q.includes("medical") || q.includes("doctor")) {
    return `**Agencies for Healthcare / Medical:**\n\n1. **CareerBridge International** — Trust Score: 87/100 (Excellent) ⭐ Top Pick\n   - 65% placement success | 198 reviews | Trend: → Stable\n   - Specializes in nursing, medical, and healthcare roles\n   - End-to-end visa and documentation support\n   - Strong UK & Middle East network\n\nCareerBridge is the clear leader for healthcare professionals on the JSO platform, with comprehensive support services and a strong track record.`;
  }

  if (q.includes("finance") || q.includes("bank") || q.includes("account")) {
    return `**Agencies for Finance / Banking:**\n\n1. **GlobalReach Staffing** — Trust Score: 72/100 (Good) ⭐ Top Pick\n   - 60% placement success | 96 reviews | Trend: ↑ Improving\n   - Specializes in finance, banking, and accounting roles\n   - Growing Singapore & Hong Kong network\n   - Score has improved +10 points in 6 months\n\nGlobalReach is the primary finance-focused agency. While still growing, their rapid improvement trend and sector specialization make them the best option for finance professionals.`;
  }

  if (q.includes("marketing") || q.includes("design") || q.includes("creative")) {
    return `**Agencies for Marketing / Design / Creative:**\n\n1. **NovaTalent Agency** — Trust Score: 68/100 (Good) ⭐ Top Pick\n   - 55% placement success | 72 reviews | Trend: ↑ Improving\n   - Specializes in marketing, UX design, and digital media\n   - Growing North American & European network\n   - Trust score improving steadily (+10 points in 6 months)\n\nNovaTalent is the best option for creative professionals. They have genuine industry understanding and a supportive team, though their network is still growing.`;
  }

  if (q.includes("safe") || q.includes("trust") || q.includes("reliable") || q.includes("legit")) {
    return `**Agency Safety Guide:**\n\nHere's how to identify trustworthy agencies on JSO:\n\n✅ **Green Flags (Score 80+):**\n- High placement success rate (>60%)\n- Large number of verified reviews (>100)\n- Stable or improving trend\n- Clean compliance record\n- Active license status\n\n⚠️ **Yellow Flags (Score 40-79):**\n- Moderate placement rates\n- Newer to the platform\n- Some mixed reviews\n\n🔴 **Red Flags (Score <40):**\n- Declining trust scores\n- Low placement success (<40%)\n- Under compliance review\n- Multiple negative reviews about communication\n\n**Currently Safest:** TechPlace Global (94), CareerBridge Int. (87), EliteForce (81)\n**Use Caution:** QuickHire Solutions (45, declining)`;
  }

  if (q.includes("report") || q.includes("admin") || q.includes("summary") || q.includes("overview")) {
    return `**Platform Trust Report — March 2026**\n\n**Overview:**\n- Total Agencies Monitored: 6\n- Average Trust Score: 74.5/100\n- Excellent Tier: 3 agencies (50%)\n- Good Tier: 2 agencies (33%)\n- Fair Tier: 1 agency (17%)\n\n**Highlights:**\n- TechPlace Global leads with 94/100, up 6 points in 6 months\n- GlobalReach Staffing showing strongest improvement trajectory\n- NovaTalent Agency steadily climbing from 58 to 68\n\n**Concerns:**\n- QuickHire Solutions declining (58 → 45), now under compliance review\n- Recommended: Issue performance warning, require corrective action plan\n\n**Recommendations:**\n1. Increase monitoring frequency for QuickHire Solutions\n2. Consider recognition program for top-tier agencies\n3. Expand agency onboarding vetting process`;
  }

  if (q.includes("hello") || q.includes("hi") || q.includes("hey") || q.includes("help")) {
    return `Hello! I'm the **Agency Trust & Transparency Agent** for the JSO platform. I analyze agency data to give you transparent, data-driven trust assessments.\n\nHere's what I can help with:\n\n📊 **Agency Analysis:**\n- "Tell me about TechPlace Global"\n- "Tell me about CareerBridge International"\n\n🏆 **Rankings:**\n- "Which are the most trusted agencies?"\n- "Best agencies for healthcare"\n- "Best agencies for IT"\n\n⚠️ **Risk Assessment:**\n- "Which agencies have declining scores?"\n- "Is QuickHire Solutions safe?"\n\n🔍 **How It Works:**\n- "How are trust scores calculated?"\n- "What makes an agency trustworthy?"\n\n📋 **Reports:**\n- "Give me a platform trust report"\n- "Compare top agencies"`;
  }

  return `I can help you evaluate agency trustworthiness on the JSO platform. Here are some things you can ask me:\n\n- "Which are the most trusted agencies?"\n- "Tell me about [agency name]"\n- "Best agencies for IT / healthcare / finance"\n- "Compare the top agencies"\n- "Which agencies have declining trust scores?"\n- "How are trust scores calculated?"\n- "Is [agency] safe?"\n- "Give me a platform trust report"\n\nI analyze reviews, placement success rates, feedback ratings, compliance records, and platform tenure to provide transparent, data-driven trust assessments.`;
}
