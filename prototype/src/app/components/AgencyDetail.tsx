"use client";

import { Agency, TrustScoreBreakdown } from "../../lib/data";
import {
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  Star,
  CheckCircle,
  AlertTriangle,
  Shield,
  ExternalLink,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { useEffect, useState } from "react";

interface AgencyDetailProps {
  agency: Agency;
  onClose: () => void;
}

function getScoreColor(score: number) {
  if (score >= 80) return "#34d399";
  if (score >= 60) return "#60a5fa";
  if (score >= 40) return "#fbbf24";
  return "#f87171";
}

function getSentimentColor(sentiment: string) {
  switch (sentiment) {
    case "positive":
      return "text-emerald-400";
    case "negative":
      return "text-red-400";
    default:
      return "text-gray-400";
  }
}

export default function AgencyDetail({ agency, onClose }: AgencyDetailProps) {
  const [breakdown, setBreakdown] = useState<TrustScoreBreakdown | null>(null);

  useEffect(() => {
    fetch(`/api/agencies/${agency.id}`)
      .then((r) => r.json())
      .then((data) => setBreakdown(data.breakdown));
  }, [agency.id]);

  const placementRate =
    agency.totalPlacements > 0
      ? Math.round(
          (agency.successfulPlacements / agency.totalPlacements) * 100
        )
      : 0;

  const breakdownData = breakdown
    ? [
        { name: "Reviews", score: breakdown.reviews, weight: "30%" },
        { name: "Placements", score: breakdown.placements, weight: "25%" },
        { name: "Feedback", score: breakdown.feedback, weight: "20%" },
        { name: "Compliance", score: breakdown.compliance, weight: "15%" },
        { name: "Tenure", score: breakdown.tenure, weight: "10%" },
      ]
    : [];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto p-4 pt-8">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-3xl relative">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-bold text-white">{agency.name}</h2>
              {agency.licenseStatus === "active" ? (
                <Shield className="w-5 h-5 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
              )}
            </div>
            <p className="text-gray-400">{agency.location}</p>
            <div className="flex gap-2 mt-2">
              {agency.industry.map((ind) => (
                <span
                  key={ind}
                  className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-300 border border-gray-700"
                >
                  {ind}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Trust Score Hero */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800/50 rounded-xl p-5 text-center border border-gray-700">
              <div
                className="text-5xl font-bold mb-1"
                style={{ color: getScoreColor(agency.trustScore) }}
              >
                {agency.trustScore}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                Trust Score
              </div>
              <span
                className="text-sm font-medium px-3 py-1 rounded-full border"
                style={{
                  color: getScoreColor(agency.trustScore),
                  borderColor: getScoreColor(agency.trustScore) + "40",
                  backgroundColor: getScoreColor(agency.trustScore) + "10",
                }}
              >
                {agency.trustTier}
              </span>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Placement Rate</span>
                  <span className="text-white font-medium">
                    {placementRate}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Avg Rating</span>
                  <span className="text-white font-medium flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400" />
                    {agency.averageRating}/5
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Placements</span>
                  <span className="text-white font-medium">
                    {agency.successfulPlacements}/{agency.totalPlacements}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Reviews</span>
                  <span className="text-white font-medium">
                    {agency.totalReviews}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
              <div className="text-sm text-gray-400 mb-2">Trend (6 months)</div>
              <div className="flex items-center gap-2 mb-3">
                {agency.trendDirection === "up" ? (
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                ) : agency.trendDirection === "down" ? (
                  <TrendingDown className="w-5 h-5 text-red-400" />
                ) : (
                  <Minus className="w-5 h-5 text-gray-400" />
                )}
                <span className="text-white font-medium capitalize">
                  {agency.trendDirection}
                </span>
              </div>
              <div className="h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={agency.scoreHistory}>
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke={getScoreColor(agency.trustScore)}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Score History Chart */}
          <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
            <h3 className="text-white font-semibold mb-4">
              Trust Score History
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={agency.scoreHistory}>
                  <XAxis
                    dataKey="month"
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke={getScoreColor(agency.trustScore)}
                    strokeWidth={2}
                    dot={{ r: 4, fill: getScoreColor(agency.trustScore) }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Score Breakdown */}
          {breakdown && (
            <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
              <h3 className="text-white font-semibold mb-4">
                Trust Score Breakdown
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={breakdownData} layout="vertical">
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      stroke="#6b7280"
                      fontSize={12}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      stroke="#6b7280"
                      fontSize={12}
                      width={80}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                      formatter={(value, _name, props) => [
                        `${value}/100 (Weight: ${(props as { payload: { weight: string } }).payload.weight})`,
                        "Score",
                      ]}
                    />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                      {breakdownData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={getScoreColor(entry.score)}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Strengths & Concerns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agency.strengths.length > 0 && (
              <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
                <h3 className="text-emerald-400 font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Strengths
                </h3>
                <ul className="space-y-2">
                  {agency.strengths.map((s, i) => (
                    <li
                      key={i}
                      className="text-sm text-gray-300 flex items-start gap-2"
                    >
                      <span className="text-emerald-400 mt-1">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {agency.concerns.length > 0 && (
              <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
                <h3 className="text-yellow-400 font-semibold mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Concerns
                </h3>
                <ul className="space-y-2">
                  {agency.concerns.map((c, i) => (
                    <li
                      key={i}
                      className="text-sm text-gray-300 flex items-start gap-2"
                    >
                      <span className="text-yellow-400 mt-1">•</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Recent Reviews */}
          <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
            <h3 className="text-white font-semibold mb-4">Recent Reviews</h3>
            <div className="space-y-3">
              {agency.recentReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-gray-900/50 rounded-lg p-4 border border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span
                        className={`text-xs capitalize ${getSentimentColor(
                          review.sentiment
                        )}`}
                      >
                        {review.sentiment}
                      </span>
                      {review.isVerified && (
                        <span className="text-xs text-emerald-400 flex items-center gap-0.5">
                          <CheckCircle className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {review.createdAt}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{review.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
            <h3 className="text-white font-semibold mb-2">About</h3>
            <p className="text-sm text-gray-300">{agency.description}</p>
            <div className="mt-3 text-xs text-gray-500">
              Member since {agency.joinedAt} · License:{" "}
              <span
                className={
                  agency.licenseStatus === "active"
                    ? "text-emerald-400"
                    : "text-yellow-400"
                }
              >
                {agency.licenseStatus}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
