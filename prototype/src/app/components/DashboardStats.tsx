"use client";

import { Agency } from "../../lib/data";
import {
  Shield,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  BarChart3,
} from "lucide-react";

interface DashboardStatsProps {
  agencies: Agency[];
}

export default function DashboardStats({ agencies }: DashboardStatsProps) {
  const avgScore =
    agencies.length > 0
      ? Math.round(
          agencies.reduce((sum, a) => sum + a.trustScore, 0) / agencies.length
        )
      : 0;

  const excellent = agencies.filter((a) => a.trustTier === "Excellent").length;
  const declining = agencies.filter((a) => a.trendDirection === "down").length;
  const underReview = agencies.filter(
    (a) => a.licenseStatus === "under_review"
  ).length;

  const stats = [
    {
      label: "Avg Trust Score",
      value: avgScore,
      suffix: "/100",
      icon: BarChart3,
      color: "text-blue-400",
      bg: "bg-blue-600/10",
      border: "border-blue-800/50",
    },
    {
      label: "Excellent Agencies",
      value: excellent,
      suffix: "",
      icon: Shield,
      color: "text-emerald-400",
      bg: "bg-emerald-600/10",
      border: "border-emerald-800/50",
    },
    {
      label: "Declining Scores",
      value: declining,
      suffix: "",
      icon: TrendingDown,
      color: "text-red-400",
      bg: "bg-red-600/10",
      border: "border-red-800/50",
    },
    {
      label: "Under Review",
      value: underReview,
      suffix: "",
      icon: AlertTriangle,
      color: "text-yellow-400",
      bg: "bg-yellow-600/10",
      border: "border-yellow-800/50",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`${stat.bg} border ${stat.border} rounded-xl p-4`}
        >
          <div className="flex items-center justify-between mb-2">
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </div>
          <div className={`text-2xl font-bold ${stat.color}`}>
            {stat.value}
            <span className="text-sm font-normal text-gray-500">
              {stat.suffix}
            </span>
          </div>
          <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
