import React from "react";
import { BarChart3 } from "lucide-react";
import CarbonTrendChart from "./CarbonTrendChart";
import CarbonPieChart from "./CarbonPieChart";

/**
 * ChartSection
 * A titled section combining the trend line chart and category pie chart
 * side by side — a lighter-weight alternative to wiring both up manually
 * on a page.
 *
 * Props:
 *  - title: string (default "Emissions Overview")
 */
export default function ChartSection({ title = "Emissions Overview" }) {
  return (
    <div className="bg-surface-card border border-surface-border rounded-2xl shadow-card p-6">
      <div className="flex items-center gap-2 text-ink-900 mb-5">
        <BarChart3 size={18} className="text-brand-600" />
        <h3 className="text-lg font-bold">{title}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-3">Weekly Trend</p>
          <CarbonTrendChart />
        </div>
        <div>
          <p className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-3">By Category</p>
          <CarbonPieChart />
        </div>
      </div>
    </div>
  );
}
