"use client";

import { useState } from "react";
import { Agency } from "../../lib/data";
import {
  Star,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  X,
} from "lucide-react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface CompareViewProps {
  agencies: Agency[];
}

function getScoreColor(score: number) {
  if (score >= 80) return "#34d399";
  if (score >= 60) return "#60a5fa";
  if (score >= 40) return "#fbbf24";
  return "#f87171";
}

const COMPARE_COLORS = ["#60a5fa", "#34d399", "#a78bfa"];

export default function CompareView({ agencies }: CompareViewProps) {
  const [selected, setSelected] = useState<Agency[]>([]);

  function toggleSelection(agency: Agency) {
    setSelected((prev) => {
      const exists = prev.find((a) => a.id === agency.id);
      if (exists) return prev.filter((a) => a.id !== agency.id);
      if (prev.length >= 3) return prev;
      return [...prev, agency];
    });
  }

  const radarData =
    selected.length > 0
      ? [
          {
            metric: "Reviews",
            ...Object.fromEntries(
              selected.map((a) => [a.name, (a.averageRating / 5) * 100])
            ),
          },
          {
            metric: "Placements",
            ...Object.fromEntries(
              selected.map((a) => [
                a.name,
                a.totalPlacements > 0
                  ? Math.round(
                      (a.successfulPlacements / a.totalPlacements) * 100
                    )
                  : 0,
              ])
            ),
          },
          {
            metric: "Feedback",
            ...Object.fromEntries(
              selected.map((a) => [a.name, (a.averageFeedback / 5) * 100])
            ),
          },
          {
            metric: "Compliance",
            ...Object.fromEntries(
              selected.map((a) => [a.name, a.complianceScore])
            ),
          },
          {
            metric: "Trust Score",
            ...Object.fromEntries(
              selected.map((a) => [a.name, a.trustScore])
            ),
          },
        ]
      : [];

  return (
    <div className="space-y-6">
      {/* Agency Selection */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-1">
          Select Agencies to Compare
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Choose up to 3 agencies for side-by-side comparison
        </p>
        <div className="flex flex-wrap gap-2">
          {agencies.map((agency) => {
            const isSelected = selected.some((s) => s.id === agency.id);
            return (
              <button
                key={agency.id}
                onClick={() => toggleSelection(agency)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-all ${
                  isSelected
                    ? "bg-blue-600/20 border-blue-600 text-blue-400"
                    : "bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600"
                } ${
                  !isSelected && selected.length >= 3
                    ? "opacity-40 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                disabled={!isSelected && selected.length >= 3}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor: isSelected
                      ? COMPARE_COLORS[selected.findIndex((s) => s.id === agency.id)]
                      : getScoreColor(agency.trustScore),
                  }}
                />
                {agency.name}
                <span className="text-xs opacity-60">
                  {agency.trustScore}/100
                </span>
                {isSelected && <X className="w-3 h-3" />}
              </button>
            );
          })}
        </div>
      </div>

      {selected.length === 0 && (
        <div className="text-center py-16">
          <ArrowRight className="w-8 h-8 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500">
            Select agencies above to start comparing
          </p>
        </div>
      )}

      {selected.length >= 2 && (
        <>
          {/* Radar Chart */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4">
              Performance Radar
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis
                    dataKey="metric"
                    stroke="#9ca3af"
                    fontSize={12}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    stroke="#4b5563"
                    fontSize={10}
                  />
                  {selected.map((agency, idx) => (
                    <Radar
                      key={agency.id}
                      name={agency.name}
                      dataKey={agency.name}
                      stroke={COMPARE_COLORS[idx]}
                      fill={COMPARE_COLORS[idx]}
                      fillOpacity={0.15}
                      strokeWidth={2}
                    />
                  ))}
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {selected.map((agency, idx) => (
                <div
                  key={agency.id}
                  className="flex items-center gap-1.5 text-xs text-gray-400"
                >
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COMPARE_COLORS[idx] }}
                  />
                  {agency.name}
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Comparison Table */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left text-gray-400 font-medium px-5 py-3">
                      Metric
                    </th>
                    {selected.map((agency, idx) => (
                      <th
                        key={agency.id}
                        className="text-center font-medium px-5 py-3"
                        style={{ color: COMPARE_COLORS[idx] }}
                      >
                        {agency.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      label: "Trust Score",
                      values: selected.map((a) => ({
                        text: `${a.trustScore}/100`,
                        highlight: a.trustScore === Math.max(...selected.map((s) => s.trustScore)),
                      })),
                    },
                    {
                      label: "Trust Tier",
                      values: selected.map((a) => ({
                        text: a.trustTier,
                        highlight: false,
                      })),
                    },
                    {
                      label: "Placement Rate",
                      values: selected.map((a) => {
                        const rate =
                          a.totalPlacements > 0
                            ? Math.round(
                                (a.successfulPlacements / a.totalPlacements) * 100
                              )
                            : 0;
                        const maxRate = Math.max(
                          ...selected.map((s) =>
                            s.totalPlacements > 0
                              ? Math.round(
                                  (s.successfulPlacements / s.totalPlacements) * 100
                                )
                              : 0
                          )
                        );
                        return { text: `${rate}%`, highlight: rate === maxRate };
                      }),
                    },
                    {
                      label: "Avg Rating",
                      values: selected.map((a) => ({
                        text: `${a.averageRating}/5`,
                        highlight:
                          a.averageRating ===
                          Math.max(...selected.map((s) => s.averageRating)),
                      })),
                    },
                    {
                      label: "Total Reviews",
                      values: selected.map((a) => ({
                        text: `${a.totalReviews}`,
                        highlight:
                          a.totalReviews ===
                          Math.max(...selected.map((s) => s.totalReviews)),
                      })),
                    },
                    {
                      label: "Successful Placements",
                      values: selected.map((a) => ({
                        text: `${a.successfulPlacements}`,
                        highlight:
                          a.successfulPlacements ===
                          Math.max(
                            ...selected.map((s) => s.successfulPlacements)
                          ),
                      })),
                    },
                    {
                      label: "Compliance Score",
                      values: selected.map((a) => ({
                        text: `${a.complianceScore}%`,
                        highlight:
                          a.complianceScore ===
                          Math.max(...selected.map((s) => s.complianceScore)),
                      })),
                    },
                    {
                      label: "Trend",
                      values: selected.map((a) => ({
                        text: a.trendDirection,
                        highlight: a.trendDirection === "up",
                      })),
                    },
                    {
                      label: "License Status",
                      values: selected.map((a) => ({
                        text: a.licenseStatus,
                        highlight: a.licenseStatus === "active",
                      })),
                    },
                    {
                      label: "Location",
                      values: selected.map((a) => ({
                        text: a.location,
                        highlight: false,
                      })),
                    },
                  ].map((row, rowIdx) => (
                    <tr
                      key={row.label}
                      className={`border-b border-gray-800/50 ${
                        rowIdx % 2 === 0 ? "bg-gray-800/20" : ""
                      }`}
                    >
                      <td className="text-gray-400 px-5 py-3">{row.label}</td>
                      {row.values.map((val, colIdx) => (
                        <td
                          key={colIdx}
                          className={`text-center px-5 py-3 ${
                            val.highlight
                              ? "text-white font-medium"
                              : "text-gray-400"
                          }`}
                        >
                          <span className="inline-flex items-center gap-1">
                            {row.label === "Trend" &&
                              (val.text === "up" ? (
                                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                              ) : val.text === "down" ? (
                                <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                              ) : (
                                <Minus className="w-3.5 h-3.5 text-gray-500" />
                              ))}
                            {row.label === "License Status" &&
                              (val.text === "active" ? (
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                              ) : null)}
                            {row.label === "Avg Rating" && (
                              <Star className="w-3.5 h-3.5 text-yellow-400" />
                            )}
                            {val.text}
                            {val.highlight && row.label !== "Trend" && row.label !== "License Status" && row.label !== "Location" && (
                              <span className="text-emerald-400 text-[10px]">
                                ★
                              </span>
                            )}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Summary */}
          <div className="bg-blue-950/30 border border-blue-800/50 rounded-xl p-5">
            <h3 className="text-blue-400 font-semibold mb-2 text-sm">
              AI Comparison Summary
            </h3>
            <p className="text-sm text-gray-300">
              {selected.length === 2
                ? `**${selected.sort((a, b) => b.trustScore - a.trustScore)[0].name}** leads with a trust score of ${selected[0].trustScore}/100 compared to ${selected[1].name}'s ${selected[1].trustScore}/100. `
                : `Comparing ${selected.length} agencies: `}
              {(() => {
                const best = [...selected].sort(
                  (a, b) => b.trustScore - a.trustScore
                )[0];
                const bestRate =
                  best.totalPlacements > 0
                    ? Math.round(
                        (best.successfulPlacements / best.totalPlacements) * 100
                      )
                    : 0;
                return `${best.name} has the highest overall trust score with a ${bestRate}% placement success rate and ${best.totalReviews} reviews. `;
              })()}
              Your choice should depend on your specific industry needs and
              geographic preferences.
            </p>
          </div>
        </>
      )}

      {selected.length === 1 && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            Select at least one more agency to compare
          </p>
        </div>
      )}
    </div>
  );
}
