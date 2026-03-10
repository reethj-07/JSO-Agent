"use client";

import { useState, useEffect } from "react";
import { agencies as allAgencies, Agency } from "../lib/data";
import AgencyCard from "./components/AgencyCard";
import AgencyDetail from "./components/AgencyDetail";
import ChatWidget from "./components/ChatWidget";
import DashboardStats from "./components/DashboardStats";
import TrustDistribution from "./components/TrustDistribution";
import CompareView from "./components/CompareView";
import AdminReports from "./components/AdminReports";
import {
  Search,
  Filter,
  Bot,
  Shield,
  ArrowUpDown,
} from "lucide-react";

type SortOption = "trustScore" | "rating" | "placements";
type FilterTier = "all" | "Excellent" | "Good" | "Fair" | "Poor";

export default function Home() {
  const [agencies, setAgencies] = useState<Agency[]>(allAgencies);
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("trustScore");
  const [filterTier, setFilterTier] = useState<FilterTier>("all");
  const [activeTab, setActiveTab] = useState<"agencies" | "analytics" | "compare" | "admin">(
    "agencies"
  );

  useEffect(() => {
    let filtered = [...allAgencies];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.industry.some((i) => i.toLowerCase().includes(q)) ||
          a.location.toLowerCase().includes(q)
      );
    }

    if (filterTier !== "all") {
      filtered = filtered.filter((a) => a.trustTier === filterTier);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "trustScore":
          return b.trustScore - a.trustScore;
        case "rating":
          return b.averageRating - a.averageRating;
        case "placements":
          return b.successfulPlacements - a.successfulPlacements;
        default:
          return 0;
      }
    });

    setAgencies(filtered);
  }, [searchQuery, sortBy, filterTier]);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">
                  JSO Trust Agent
                </h1>
                <p className="text-xs text-gray-400">
                  Agency Trust & Transparency Dashboard
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 hidden sm:block">
                Powered by
              </span>
              <div className="flex items-center gap-1.5 bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700">
                <Bot className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs font-medium text-gray-300">
                  Agentic AI
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <DashboardStats agencies={allAgencies} />

        <div className="flex items-center gap-4 border-b border-gray-800">
          <button
            onClick={() => setActiveTab("agencies")}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === "agencies"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Agency Listings
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === "analytics"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Trust Analytics
          </button>
          <button
            onClick={() => setActiveTab("compare")}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === "compare"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Compare
          </button>
          <button
            onClick={() => setActiveTab("admin")}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === "admin"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Admin Reports
          </button>
        </div>

        {activeTab === "agencies" && (
          <>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search agencies by name, industry, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-600 transition-colors"
                />
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <select
                    value={filterTier}
                    onChange={(e) =>
                      setFilterTier(e.target.value as FilterTier)
                    }
                    className="appearance-none bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-8 py-2.5 text-sm text-white focus:outline-none focus:border-blue-600 cursor-pointer"
                  >
                    <option value="all">All Tiers</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
                <div className="relative">
                  <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(e.target.value as SortOption)
                    }
                    className="appearance-none bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-8 py-2.5 text-sm text-white focus:outline-none focus:border-blue-600 cursor-pointer"
                  >
                    <option value="trustScore">Trust Score</option>
                    <option value="rating">Rating</option>
                    <option value="placements">Placements</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">
                Showing{" "}
                <span className="text-white font-medium">
                  {agencies.length}
                </span>{" "}
                {agencies.length === 1 ? "agency" : "agencies"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agencies.map((agency) => (
                <AgencyCard
                  key={agency.id}
                  agency={agency}
                  onClick={setSelectedAgency}
                />
              ))}
            </div>

            {agencies.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No agencies match your search criteria.
                </p>
              </div>
            )}
          </>
        )}

        {activeTab === "analytics" && (
          <TrustDistribution agencies={allAgencies} />
        )}

        {activeTab === "compare" && (
          <CompareView agencies={allAgencies} />
        )}

        {activeTab === "admin" && (
          <AdminReports agencies={allAgencies} />
        )}

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-400" />
            How Trust Scores Work
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            The Agency Trust & Transparency Agent computes a composite trust
            score (0-100) using a weighted multi-factor algorithm:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: "Reviews", weight: "30%", color: "border-blue-800 bg-blue-950/30" },
              { label: "Placements", weight: "25%", color: "border-emerald-800 bg-emerald-950/30" },
              { label: "Feedback", weight: "20%", color: "border-purple-800 bg-purple-950/30" },
              { label: "Compliance", weight: "15%", color: "border-yellow-800 bg-yellow-950/30" },
              { label: "Tenure", weight: "10%", color: "border-gray-700 bg-gray-800/30" },
            ].map((factor) => (
              <div
                key={factor.label}
                className={`text-center p-3 rounded-lg border ${factor.color}`}
              >
                <div className="text-white font-semibold text-lg">{factor.weight}</div>
                <div className="text-xs text-gray-400">{factor.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Excellent: 80-100
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              Good: 60-79
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              Fair: 40-59
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              Poor: 0-39
            </span>
          </div>
        </div>

        <footer className="text-center py-6 border-t border-gray-800">
          <p className="text-xs text-gray-500">
            Agency Trust & Transparency Agent — JSO Phase-2: Agentic Career Intelligence Development
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Prototype Demo | Powered by Anthropic Claude
          </p>
        </footer>
      </main>

      {selectedAgency && (
        <AgencyDetail
          agency={selectedAgency}
          onClose={() => setSelectedAgency(null)}
        />
      )}

      <ChatWidget />
    </div>
  );
}
