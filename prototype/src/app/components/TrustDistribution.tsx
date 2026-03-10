"use client";

import { Agency } from "../../lib/data";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

interface TrustDistributionProps {
  agencies: Agency[];
}

const TIER_COLORS: Record<string, string> = {
  Excellent: "#34d399",
  Good: "#60a5fa",
  Fair: "#fbbf24",
  Poor: "#f87171",
};

export default function TrustDistribution({
  agencies,
}: TrustDistributionProps) {
  const distribution = ["Excellent", "Good", "Fair", "Poor"].map((tier) => ({
    name: tier,
    value: agencies.filter((a) => a.trustTier === tier).length,
    color: TIER_COLORS[tier],
  }));

  const placementData = agencies
    .sort((a, b) => b.trustScore - a.trustScore)
    .map((a) => ({
      name: a.name.split(" ")[0],
      score: a.trustScore,
      rate:
        a.totalPlacements > 0
          ? Math.round((a.successfulPlacements / a.totalPlacements) * 100)
          : 0,
    }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Tier Distribution */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">
          Trust Tier Distribution
        </h3>
        <div className="h-48 flex items-center">
          <ResponsiveContainer width="50%" height="100%">
            <PieChart>
              <Pie
                data={distribution.filter((d) => d.value > 0)}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                dataKey="value"
                stroke="none"
              >
                {distribution
                  .filter((d) => d.value > 0)
                  .map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2">
            {distribution.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-sm">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: d.color }}
                />
                <span className="text-gray-400">{d.name}</span>
                <span className="text-white font-medium">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust vs Placement Rate */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">
          Trust Score vs Placement Rate
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={placementData}>
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                fontSize={11}
                tickLine={false}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={11}
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
              <Bar dataKey="score" name="Trust Score" fill="#60a5fa" radius={[4, 4, 0, 0]} />
              <Bar
                dataKey="rate"
                name="Placement %"
                fill="#34d399"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
