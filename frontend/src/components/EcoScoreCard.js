import React from "react";
import { Leaf } from "lucide-react";

/**
 * EcoScoreCard
 * Displays a 0-100 sustainability score with a radial progress ring.
 *
 * Props:
 *  - score: number (0-100)
 *  - label: string override for the qualitative rating (auto-derived if omitted)
 */
export default function EcoScoreCard({ score = 0, label }) {
  const clamped = Math.max(0, Math.min(100, score));
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (clamped / 100) * circumference;

  const rating =
    label ||
    (clamped >= 90 ? "Excellent" :
     clamped >= 70 ? "Good" :
     clamped >= 50 ? "Fair" : "Needs Work");

  const ratingColor =
    clamped >= 90 ? "text-brand-700" :
    clamped >= 70 ? "text-brand-600" :
    clamped >= 50 ? "text-amber-600" : "text-status-danger";

  return (
    <div className="bg-surface-card border border-surface-border rounded-2xl p-6 shadow-card flex items-center gap-6">
      <div className="relative w-24 h-24 flex-shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#eef2f0" strokeWidth="10" />
          <circle
            cx="50" cy="50" r="42" fill="none"
            stroke="#22c274" strokeWidth="10" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold text-ink-900">{Math.round(clamped)}</span>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 text-brand-600 mb-1">
          <Leaf size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">Eco Score</span>
        </div>
        <p className={`text-lg font-bold ${ratingColor}`}>{rating}</p>
        <p className="text-xs text-ink-500 mt-1 max-w-[180px]">
          Based on your recent activity mix and emission trends.
        </p>
      </div>
    </div>
  );
}
