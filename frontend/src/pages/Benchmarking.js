import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, TrendingDown, Award, BarChart3 } from "lucide-react";
import { fetchAuth } from "../api";

export default function Benchmarking() {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-4 py-8"
      >
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
        </div>
      </motion.div>
    );
  }

  if (!benchmark) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-4 py-8"
      >
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-surface-panel flex items-center justify-center">
            <Users size={48} className="text-ink-300" />
          </div>
          <h2 className="text-2xl font-bold text-ink-900 mb-2">No Benchmark Data Available</h2>
          <p className="text-ink-500">Log some activities to see how you compare to the community.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto px-4 py-8"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-brand-600 mb-2">
          <Users size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">Community Analysis</span>
        </div>
        <h1 className="text-4xl font-extrabold text-ink-900 tracking-tight mb-2">
          Peer Benchmarking
        </h1>
        <p className="text-ink-500 font-medium max-w-xl">
          Compare your carbon footprint against the community and see where you stand
        </p>
      </div>

      {/* User Standing Card */}
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-brand-50 to-teal-50 border border-brand-200 rounded-3xl p-6 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div>
            <p className="text-ink-500 text-sm mb-1">Your Community Standing</p>
            <h2 className="text-3xl font-bold text-ink-900">{benchmark.standingSummary}</h2>
            <p className="text-brand-700 text-sm mt-2">
              You're in the top {benchmark.percentileRanking}% of eco-conscious users
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-surface-card border border-surface-border flex items-center justify-center shadow-card">
                <Users size={32} className="text-brand-600" />
              </div>
              <p className="text-2xl font-bold text-ink-900 mt-2">{benchmark.totalUsers}</p>
              <p className="text-xs text-ink-500 uppercase tracking-wider">Total Users</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div variants={itemVariants} className="bg-surface-card border border-surface-border rounded-3xl p-6 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
              <TrendingDown size={20} className="text-brand-600" />
            </div>
            <h3 className="text-sm font-semibold text-ink-500">Your Footprint</h3>
          </div>
          <div className="text-3xl font-bold text-ink-900 mb-1">
            {benchmark.userTotalFootprint} <span className="text-lg font-normal text-ink-300">kg CO₂e</span>
          </div>
          <p className="text-xs text-ink-300">Total emissions across all categories</p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-surface-card border border-surface-border rounded-3xl p-6 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
              <Users size={20} className="text-accent" />
            </div>
            <h3 className="text-sm font-semibold text-ink-500">Community Average</h3>
          </div>
          <div className="text-3xl font-bold text-brand-700 mb-1">
            {benchmark.communityAverageFootprint} <span className="text-lg font-normal text-ink-300">kg CO₂e</span>
          </div>
          <p className="text-xs text-ink-300">Average per community member</p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-surface-card border border-surface-border rounded-3xl p-6 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
              <TrendingDown size={20} className="text-violet-500" />
            </div>
            <h3 className="text-sm font-semibold text-ink-500">Your Standing</h3>
          </div>
          <div className="text-3xl font-bold text-sky-600 mb-1">
            {benchmark.percentileRanking}% <span className="text-lg font-normal text-ink-300">percentile</span>
          </div>
          <p className="text-xs text-ink-300">You're cleaner than {benchmark.percentileRanking}% of users</p>
        </motion.div>
      </div>

      {/* Category Comparison */}
      {benchmark.categoryAverages && benchmark.categoryAverages.length > 0 && (
        <motion.div variants={itemVariants} className="bg-surface-card border border-surface-border rounded-3xl overflow-hidden shadow-card">
          <div className="p-6 border-b border-surface-border">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-brand-600" />
              <h3 className="text-lg font-bold text-ink-900">Category Breakdown</h3>
            </div>
            <p className="text-sm text-ink-500 mt-1">
              Compare your emissions by category against platform averages
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {benchmark.categoryAverages.map((cat, idx) => {
                const isBetter = cat.userVsAverage < 100;
                const color = isBetter ? "bg-brand-500" : cat.userVsAverage < 130 ? "bg-amber-500" : "bg-red-500";

                return (
                  <div key={idx} className="relative">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-ink-900 capitalize">{cat.category}</span>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${isBetter ? "bg-brand-50 text-brand-700" : "bg-red-50 text-status-danger"}`}>
                          {isBetter ? "Better" : "Higher"} than avg
                        </span>
                        <span className="text-sm text-ink-500">
                          {cat.userValue !== undefined ? cat.userValue.toFixed(2) : 'N/A'} kg
                        </span>
                      </div>
                    </div>
                    <div className="relative h-3 bg-surface-muted rounded-full overflow-hidden">
                      {/* Community average marker */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-ink-300"
                        style={{ left: `${cat.communityAverageValue / (cat.userValue * 1.5) * 100}%` }}
                      />
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${color}`}
                        style={{ width: `${Math.min(cat.userValue / (cat.communityAverageValue * 0.7) * 50, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-ink-300 mt-1">
                      <span>0</span>
                      <span>Community Avg: {cat.communityAverageValue !== undefined ? cat.communityAverageValue.toFixed(2) : 'N/A'} kg</span>
                      <span>High</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* How It Works */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-surface-card border border-surface-border rounded-2xl p-6 shadow-card">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
            <Users size={20} className="text-brand-600" />
          </div>
          <h3 className="text-ink-900 font-bold mb-2">Anonymous Comparison</h3>
          <p className="text-sm text-ink-500">
            Your data is anonymized and compared against the community without exposing personal information.
          </p>
        </div>
        <div className="bg-surface-card border border-surface-border rounded-2xl p-6 shadow-card">
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center mb-4">
            <TrendingDown size={20} className="text-accent" />
          </div>
          <h3 className="text-ink-900 font-bold mb-2">Category Analysis</h3>
          <p className="text-sm text-ink-500">
            See which categories contribute most to your footprint and how you compare to others.
          </p>
        </div>
        <div className="bg-surface-card border border-surface-border rounded-2xl p-6 shadow-card">
          <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center mb-4">
            <Award size={20} className="text-violet-500" />
          </div>
          <h3 className="text-ink-900 font-bold mb-2">Motivation</h3>
          <p className="text-sm text-ink-500">
            Use benchmarking as motivation to reduce your carbon footprint and climb the ranks.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
