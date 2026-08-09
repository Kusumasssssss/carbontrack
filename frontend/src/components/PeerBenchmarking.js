import React, { useEffect, useState } from "react";
import { fetchAuth } from "../api";
import { Users, TrendingDown, Award, BarChart3 } from "lucide-react";

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
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl animate-pulse text-gray-400">
        Loading peer benchmarks...
      </div>
    );
  }

  if (!benchmark) {
    return null;
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl text-white my-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            Peer Benchmarking & Standing
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Anonymous community comparison against platform users
          </p>
        </div>
        <span className="px-3 py-1 bg-emerald-900/50 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-semibold">
          {benchmark.standingSummary}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4">
          <div className="text-gray-400 text-xs font-medium mb-1">Your Total Footprint</div>
          <div className="text-2xl font-black text-white">{benchmark.userTotalFootprint} <span className="text-xs font-normal text-gray-400">kg CO₂e</span></div>
        </div>

        <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4">
          <div className="text-gray-400 text-xs font-medium mb-1">Community Average</div>
          <div className="text-2xl font-black text-emerald-400">{benchmark.communityAverageFootprint} <span className="text-xs font-normal text-gray-400">kg CO₂e</span></div>
        </div>

        <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4">
          <div className="text-gray-400 text-xs font-medium mb-1">Percentile Standing</div>
          <div className="text-2xl font-black text-cyan-400">Cleaner than {benchmark.percentileRanking}% <span className="text-xs font-normal text-gray-400">of users</span></div>
        </div>
      </div>

      {benchmark.categoryAverages && benchmark.categoryAverages.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            Platform Average Emissions by Category
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {benchmark.categoryAverages && benchmark.categoryAverages.map((cat, idx) => (
              <div key={idx} className="bg-gray-950/40 border border-gray-800 rounded-lg p-3">
                <div className="text-xs text-gray-400 capitalize">{cat.category}</div>
                <div className="text-sm font-bold text-gray-200 mt-1">
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
