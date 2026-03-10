"use client";

import { Agency } from "../../lib/data";
import {
  AlertTriangle,
  CheckCircle,
  TrendingDown,
  TrendingUp,
  Minus,
  Shield,
  FileText,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

interface AdminReportsProps {
  agencies: Agency[];
}

function getScoreColor(score: number) {
  if (score >= 80) return "#34d399";
  if (score >= 60) return "#60a5fa";
  if (score >= 40) return "#fbbf24";
  return "#f87171";
}

export default function AdminReports({ agencies }: AdminReportsProps) {
  const sorted = [...agencies].sort((a, b) => b.trustScore - a.trustScore);
  const avgScore = Math.round(
    agencies.reduce((sum, a) => sum + a.trustScore, 0) / agencies.length
  );
  const totalPlacements = agencies.reduce(
    (sum, a) => sum + a.totalPlacements,
    0
  );
  const totalSuccess = agencies.reduce(
    (sum, a) => sum + a.successfulPlacements,
    0
  );
  const totalReviews = agencies.reduce((sum, a) => sum + a.totalReviews, 0);
  const overallPlacementRate =
    totalPlacements > 0 ? Math.round((totalSuccess / totalPlacements) * 100) : 0;

  const flaggedAgencies = agencies.filter(
    (a) =>
      a.trustScore < 50 ||
      a.trendDirection === "down" ||
      a.licenseStatus !== "active"
  );

  const trendData = agencies[0]?.scoreHistory.map((_, idx) => {
    const point: Record<string, string | number> = {
      month: agencies[0].scoreHistory[idx].month,
    };
    agencies.forEach((a) => {
      if (a.scoreHistory[idx]) {
        point[a.name] = a.scoreHistory[idx].score;
      }
    });
    return point;
  }) ?? [];

  const complianceData = sorted.map((a) => ({
    name: a.name.split(" ")[0],
    compliance: a.complianceScore,
    trust: a.trustScore,
  }));

  const TREND_COLORS = [
    "#60a5fa",
    "#34d399",
    "#a78bfa",
    "#f87171",
    "#fbbf24",
    "#f472b6",
  ];

  return (
    <div className="space-y-6">
      {/* Platform Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-xs text-gray-500 mb-1">Platform Avg Score</div>
          <div
            className="text-3xl font-bold"
            style={{ color: getScoreColor(avgScore) }}
          >
            {avgScore}
          </div>
          <div className="text-xs text-gray-500">/ 100</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-xs text-gray-500 mb-1">Total Placements</div>
          <div className="text-3xl font-bold text-white">
            {totalSuccess.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">
            of {totalPlacements.toLocaleString()} ({overallPlacementRate}%
            success)
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-xs text-gray-500 mb-1">Total Reviews</div>
          <div className="text-3xl font-bold text-white">
            {totalReviews.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">across {agencies.length} agencies</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-xs text-gray-500 mb-1">Flagged Agencies</div>
          <div className="text-3xl font-bold text-red-400">
            {flaggedAgencies.length}
          </div>
          <div className="text-xs text-gray-500">require attention</div>
        </div>
      </div>

      {/* Flagged Agencies Alert */}
      {flaggedAgencies.length > 0 && (
        <div className="bg-red-950/30 border border-red-800/50 rounded-xl p-5">
          <h3 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Agencies Requiring Attention
          </h3>
          <div className="space-y-3">
            {flaggedAgencies.map((agency) => (
              <div
                key={agency.id}
                className="flex items-center justify-between bg-gray-900/50 rounded-lg px-4 py-3 border border-red-900/30"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
                    style={{
                      backgroundColor: getScoreColor(agency.trustScore) + "20",
                      color: getScoreColor(agency.trustScore),
                    }}
                  >
                    {agency.trustScore}
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">
                      {agency.name}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {agency.trendDirection === "down" && (
                        <span className="flex items-center gap-0.5 text-red-400">
                          <TrendingDown className="w-3 h-3" />
                          Declining
                        </span>
                      )}
                      {agency.licenseStatus !== "active" && (
                        <span className="flex items-center gap-0.5 text-yellow-400">
                          <Clock className="w-3 h-3" />
                          {agency.licenseStatus}
                        </span>
                      )}
                      {agency.trustScore < 50 && (
                        <span className="text-red-400">Below threshold</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  <span className="px-2 py-1 rounded-full bg-red-900/30 text-red-400 border border-red-800/50">
                    Action Required
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Agency Scores */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-400" />
          Agency Trust Rankings
        </h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={complianceData} layout="vertical">
              <XAxis
                type="number"
                domain={[0, 100]}
                stroke="#6b7280"
                fontSize={11}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#6b7280"
                fontSize={11}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Bar dataKey="trust" name="Trust Score" radius={[0, 4, 4, 0]}>
                {complianceData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getScoreColor(entry.trust)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trust Score Trends */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          Trust Score Trends (All Agencies)
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <XAxis
                dataKey="month"
                stroke="#6b7280"
                fontSize={11}
                tickLine={false}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={11}
                tickLine={false}
                domain={[30, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "11px", color: "#9ca3af" }}
              />
              {agencies.map((agency, idx) => (
                <Line
                  key={agency.id}
                  type="monotone"
                  dataKey={agency.name}
                  stroke={TREND_COLORS[idx % TREND_COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 3, fill: TREND_COLORS[idx % TREND_COLORS.length] }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Agency Detail Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-400" />
            Detailed Agency Report
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3">Agency</th>
                <th className="text-center px-3 py-3">Score</th>
                <th className="text-center px-3 py-3">Tier</th>
                <th className="text-center px-3 py-3">Placement %</th>
                <th className="text-center px-3 py-3">Rating</th>
                <th className="text-center px-3 py-3">Reviews</th>
                <th className="text-center px-3 py-3">Compliance</th>
                <th className="text-center px-3 py-3">Trend</th>
                <th className="text-center px-3 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((agency, idx) => {
                const rate =
                  agency.totalPlacements > 0
                    ? Math.round(
                        (agency.successfulPlacements /
                          agency.totalPlacements) *
                          100
                      )
                    : 0;
                return (
                  <tr
                    key={agency.id}
                    className={`border-b border-gray-800/50 hover:bg-gray-800/30 ${
                      idx % 2 === 0 ? "bg-gray-800/10" : ""
                    }`}
                  >
                    <td className="px-5 py-3">
                      <div className="text-white font-medium">
                        {agency.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {agency.location}
                      </div>
                    </td>
                    <td className="text-center px-3 py-3">
                      <span
                        className="font-bold"
                        style={{ color: getScoreColor(agency.trustScore) }}
                      >
                        {agency.trustScore}
                      </span>
                    </td>
                    <td className="text-center px-3 py-3">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full border"
                        style={{
                          color: getScoreColor(agency.trustScore),
                          borderColor: getScoreColor(agency.trustScore) + "40",
                        }}
                      >
                        {agency.trustTier}
                      </span>
                    </td>
                    <td className="text-center text-gray-300 px-3 py-3">
                      {rate}%
                    </td>
                    <td className="text-center text-gray-300 px-3 py-3">
                      {agency.averageRating}
                    </td>
                    <td className="text-center text-gray-300 px-3 py-3">
                      {agency.totalReviews}
                    </td>
                    <td className="text-center px-3 py-3">
                      <span
                        style={{
                          color: getScoreColor(agency.complianceScore),
                        }}
                      >
                        {agency.complianceScore}%
                      </span>
                    </td>
                    <td className="text-center px-3 py-3">
                      {agency.trendDirection === "up" ? (
                        <TrendingUp className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : agency.trendDirection === "down" ? (
                        <TrendingDown className="w-4 h-4 text-red-400 mx-auto" />
                      ) : (
                        <Minus className="w-4 h-4 text-gray-500 mx-auto" />
                      )}
                    </td>
                    <td className="text-center px-3 py-3">
                      {agency.licenseStatus === "active" ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-yellow-400 mx-auto" />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Governance Note */}
      <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-5">
        <h4 className="text-gray-300 font-medium text-sm mb-2">
          Governance & Transparency Notice
        </h4>
        <p className="text-xs text-gray-500 leading-relaxed">
          All trust scores are computed using a transparent, weighted algorithm.
          Score factors and weights are publicly documented. Agencies can request
          a detailed breakdown of their score. Admin overrides require
          documented justification and are logged in the audit trail. This
          report is auto-generated by the Agency Trust & Transparency Agent and
          is updated daily.
        </p>
      </div>
    </div>
  );
}
