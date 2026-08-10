import React from "react";
import { Target, Calendar } from "lucide-react";
import { motion } from "framer-motion";

/**
 * GoalCard
 * Compact summary card for a single goal — pairs well in a list/grid,
 * unlike the larger GoalProgressCard used on the Dashboard.
 *
 * Props:
 *  - goal: { targetReductionPct, periodDays, deadline, status }
 *  - progressPercentage: number (0-100)
 */
export default function GoalCard({ goal, progressPercentage = 0 }) {
  if (!goal) return null;

  const statusStyle =
    goal.status === "ACTIVE" ? "bg-brand-50 text-brand-700 border-brand-200" :
    goal.status === "ACHIEVED" ? "bg-sky-50 text-sky-600 border-sky-200" :
    "bg-surface-muted text-ink-500 border-surface-border";

  return (
    <div className="bg-surface-card border border-surface-border rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-brand-600">
          <Target size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">Goal</span>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusStyle}`}>
          {goal.status}
        </span>
      </div>

      <p className="text-ink-900 font-bold text-lg mb-1">
        Reduce by {goal.targetReductionPct}%
      </p>
      <p className="text-ink-500 text-sm flex items-center gap-1.5 mb-4">
        <Calendar size={13} className="text-ink-300" />
        {goal.periodDays} days · deadline {goal.deadline || "—"}
      </p>

      <div className="w-full bg-surface-muted rounded-full h-2 overflow-hidden">
        <motion.div
          className="bg-gradient-brand h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      <p className="text-xs text-ink-500 mt-2 text-right">{progressPercentage.toFixed(0)}% complete</p>
    </div>
  );
}
