"use client";

import { Agency } from "../../lib/data";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Star,
  Users,
  CheckCircle,
  AlertTriangle,
  Shield,
} from "lucide-react";

interface AgencyCardProps {
  agency: Agency;
  onClick: (agency: Agency) => void;
}

function getTierColor(tier: string) {
  switch (tier) {
    case "Excellent":
      return "text-emerald-400 bg-emerald-950/50 border-emerald-800";
    case "Good":
      return "text-blue-400 bg-blue-950/50 border-blue-800";
    case "Fair":
      return "text-yellow-400 bg-yellow-950/50 border-yellow-800";
    case "Poor":
      return "text-red-400 bg-red-950/50 border-red-800";
    default:
      return "text-gray-400 bg-gray-950/50 border-gray-800";
  }
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-blue-400";
  if (score >= 40) return "text-yellow-400";
  return "text-red-400";
}

function getScoreRingColor(score: number) {
  if (score >= 80) return "stroke-emerald-400";
  if (score >= 60) return "stroke-blue-400";
  if (score >= 40) return "stroke-yellow-400";
  return "stroke-red-400";
}

function TrendIcon({ direction }: { direction: string }) {
  switch (direction) {
    case "up":
      return <TrendingUp className="w-4 h-4 text-emerald-400" />;
    case "down":
      return <TrendingDown className="w-4 h-4 text-red-400" />;
    default:
      return <Minus className="w-4 h-4 text-gray-400" />;
  }
}

export default function AgencyCard({ agency, onClick }: AgencyCardProps) {
  const tierColor = getTierColor(agency.trustTier);
  const scoreColor = getScoreColor(agency.trustScore);
  const ringColor = getScoreRingColor(agency.trustScore);
  const placementRate =
    agency.totalPlacements > 0
      ? Math.round(
          (agency.successfulPlacements / agency.totalPlacements) * 100
        )
      : 0;

  const circumference = 2 * Math.PI * 36;
  const dashOffset = circumference - (agency.trustScore / 100) * circumference;

  return (
    <div
      onClick={() => onClick(agency)}
      className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-600 hover:bg-gray-850 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
              {agency.name}
            </h3>
            {agency.licenseStatus === "active" && (
              <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            )}
            {agency.licenseStatus === "under_review" && (
              <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-gray-400">{agency.location}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {agency.industry.slice(0, 2).map((ind) => (
              <span
                key={ind}
                className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-300 border border-gray-700"
              >
                {ind}
              </span>
            ))}
          </div>
        </div>

        {/* Trust Score Circle */}
        <div className="relative flex-shrink-0 ml-3">
          <svg width="84" height="84" className="-rotate-90">
            <circle
              cx="42"
              cy="42"
              r="36"
              fill="none"
              stroke="#1f2937"
              strokeWidth="5"
            />
            <circle
              cx="42"
              cy="42"
              r="36"
              fill="none"
              className={ringColor}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: "stroke-dashoffset 0.8s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-xl font-bold ${scoreColor}`}>
              {agency.trustScore}
            </span>
            <span className="text-[10px] text-gray-500 uppercase">Trust</span>
          </div>
        </div>
      </div>

      {/* Trust Tier Badge */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full border ${tierColor}`}
        >
          {agency.trustTier}
        </span>
        <div className="flex items-center gap-1 text-sm text-gray-400">
          <TrendIcon direction={agency.trendDirection} />
          <span className="capitalize">{agency.trendDirection}</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-800">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-gray-300 text-sm font-medium">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            {placementRate}%
          </div>
          <div className="text-[11px] text-gray-500 mt-0.5">Placement</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-gray-300 text-sm font-medium">
            <Star className="w-3.5 h-3.5 text-yellow-400" />
            {agency.averageRating}
          </div>
          <div className="text-[11px] text-gray-500 mt-0.5">Rating</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-gray-300 text-sm font-medium">
            <Users className="w-3.5 h-3.5 text-blue-400" />
            {agency.totalReviews}
          </div>
          <div className="text-[11px] text-gray-500 mt-0.5">Reviews</div>
        </div>
      </div>
    </div>
  );
}
