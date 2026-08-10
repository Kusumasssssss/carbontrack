import React, { useState } from "react";
import { Lightbulb, ChevronLeft, ChevronRight } from "lucide-react";

const DEFAULT_TIPS = [
  "Switch to LED bulbs — they use up to 80% less energy than incandescent bulbs.",
  "Try a plant-based meal once a week to cut your food-related emissions.",
  "Combine errands into one trip to reduce transportation emissions.",
  "Unplug chargers and electronics when not in use to avoid phantom energy draw.",
  "Choose public transit or carpooling for your commute a few days a week.",
];

/**
 * EcoTipsCard
 * Shows a small carousel of sustainability tips.
 *
 * Props:
 *  - tips: string[] (defaults to DEFAULT_TIPS)
 */
export default function EcoTipsCard({ tips = DEFAULT_TIPS }) {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % tips.length);
  const prev = () => setIndex((i) => (i - 1 + tips.length) % tips.length);

  return (
    <div className="bg-surface-card border border-surface-border rounded-2xl p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-brand-600">
          <Lightbulb size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">Eco Tip</span>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={prev}
            className="p-1.5 rounded-lg bg-surface-panel text-ink-500 hover:text-ink-900 hover:bg-surface-muted transition-colors"
            aria-label="Previous tip"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={next}
            className="p-1.5 rounded-lg bg-surface-panel text-ink-500 hover:text-ink-900 hover:bg-surface-muted transition-colors"
            aria-label="Next tip"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <p className="text-sm text-ink-700 leading-relaxed min-h-[3.5rem]">{tips[index]}</p>

      <div className="flex gap-1.5 mt-4">
        {tips.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-brand-500" : "w-1.5 bg-surface-muted"}`}
          />
        ))}
      </div>
    </div>
  );
}
