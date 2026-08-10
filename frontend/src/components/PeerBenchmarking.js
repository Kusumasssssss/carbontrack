import React, { useEffect, useState } from "react";
import { fetchAuth } from "../api";
import { Users, Award, BarChart3 } from "lucide-react";

export default function PeerBenchmarking() {
  const [benchmark, setBenchmark] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuth("/benchmarks")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setBenchmark(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading benchmarks:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-surface-card border border-surface-border rounded-2xl p-6 shadow-card animate-pulse text-ink-500">
        Loading peer benchmarks...
      </div>
    );
  }

  if (!benchmark) {
    return null;
  }

  return (
    <div className="bg-surface-card border border-surface-border rounded-2xl p-6 shadow-card text-ink-900">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-brand-700 flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-600" />
            Peer Benchmarking & Standing
          </h2>
          <p className="text-xs text-ink-500 mt-1">
            Anonymous community comparison against platform users
          </p>
        </div>
        <span className="px-3 py-1 bg-brand-50 text-brand-700 border border-brand-200 rounded-full text-xs font-semibold">
          {benchmark.standingSummary}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-surface-panel border border-surface-border rounded-xl p-4">
          <div className="text-ink-500 text-xs font-medium mb-1">Your Total Footprint</div>
          <div className="text-2xl font-black text-ink-900">{benchmark.userTotalFootprint} <span className="text-xs font-normal text-ink-500">kg CO₂e</span></div>
        </div>

        <div className="bg-surface-panel border border-surface-border rounded-xl p-4">
          <div className="text-ink-500 text-xs font-medium mb-1">Community Average</div>
          <div className="text-2xl font-black text-brand-700">{benchmark.communityAverageFootprint} <span className="text-xs font-normal text-ink-500">kg CO₂e</span></div>
        </div>

        <div className="bg-surface-panel border border-surface-border rounded-xl p-4">
          <div className="text-ink-500 text-xs font-medium mb-1 flex items-center gap-1"><Award size={12} /> Percentile Standing</div>
          <div className="text-2xl font-black text-sky-600">Cleaner than {benchmark.percentileRanking}% <span className="text-xs font-normal text-ink-500">of users</span></div>
        </div>
      </div>

      {benchmark.categoryAverages && benchmark.categoryAverages.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-ink-700 mb-3 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-brand-600" />
            Platform Average Emissions by Category
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {benchmark.categoryAverages && benchmark.categoryAverages.map((cat, idx) => (
              <div key={idx} className="bg-surface-base border border-surface-border rounded-lg p-3">
                <div className="text-xs text-ink-500 capitalize">{cat.category}</div>
                <div className="text-sm font-bold text-ink-900 mt-1">
                  {cat.totalCo2e !== undefined ? Math.round(cat.totalCo2e * 100) / 100 : 'N/A'} kg
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
