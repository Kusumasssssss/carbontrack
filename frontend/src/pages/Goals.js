import React, { useEffect, useState } from "react";
import { fetchAuth } from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Calendar, TrendingUp, CheckCircle, AlertCircle, Clock, Plus, Trash2, Award } from "lucide-react";

function Goals() {
  const [goal, setGoal] = useState(null);
  const [allGoals, setAllGoals] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    targetReductionPct: "",
    periodDays: "",
  });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([loadGoal(), loadProgress(), loadAllGoals()]);
    setLoading(false);
  };

  const loadGoal = async () => {
    try {
      const res = await fetchAuth("/goals/active");
      if (res.status === 204 || !res.ok) {
        setGoal(null);
      } else {
        const text = await res.text();
        setGoal(text ? JSON.parse(text) : null);
      }
    } catch {
      setGoal(null);
    }
  };

  const loadProgress = async () => {
    try {
      const res = await fetchAuth("/goals/progress");
      if (res.status === 204 || !res.ok) {
        setProgress(null);
      } else {
        const text = await res.text();
        setProgress(text ? JSON.parse(text) : null);
      }
    } catch {
      setProgress(null);
    }
  };

  const loadAllGoals = async () => {
    try {
      const res = await fetchAuth("/goals");
      if (res.ok) {
        const data = await res.json();
        setAllGoals(Array.isArray(data) ? data : []);
      }
    } catch {
      setAllGoals([]);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  const createGoal = async () => {
    const pct = parseFloat(formData.targetReductionPct);
    const days = parseInt(formData.periodDays);

    if (!pct || pct <= 0 || pct > 100) {
      setErrorMsg("Target reduction must be between 1% and 100%.");
      return;
    }
    if (!days || days <= 0) {
      setErrorMsg("Period must be a positive number of days.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    try {
      const res = await fetchAuth("/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetReductionPct: pct,
          periodDays: days,
        }),
      });

      if (res.ok) {
        setFormData({ targetReductionPct: "", periodDays: "" });
        setSuccessMsg("🎯 Goal created successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
        await loadAll();
      } else {
        setErrorMsg("Failed to create goal. Please try again.");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteGoal = async (id) => {
    if (!window.confirm("Delete this goal?")) return;
    try {
      await fetchAuth(`/goals/${id}`, { method: "DELETE" });
      await loadAll();
    } catch {
      // ignore
    }
  };

  const statusColor = (s) => {
    if (s === "ACTIVE") return "bg-brand-50 text-brand-700 border-brand-200";
    if (s === "ACHIEVED") return "bg-sky-50 text-sky-600 border-sky-200";
    if (s === "SUPERSEDED") return "bg-surface-muted text-ink-500 border-surface-border";
    return "bg-red-50 text-status-danger border-red-200";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto px-2 py-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-10 flex flex-col md:flex-row items-center justify-between bg-surface-card border border-surface-border p-8 rounded-3xl shadow-card">
        <div>
          <div className="flex items-center gap-2 text-brand-600 mb-2">
            <Target size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Goal Tracking</span>
          </div>
          <h1 className="text-4xl font-extrabold text-ink-900 tracking-tight mb-2">
            Carbon Reduction Goals
          </h1>
          <p className="text-ink-500 font-medium max-w-xl">
            Set targets, track your trajectory, and stay on course for a greener footprint.
          </p>
        </div>
        <div className="w-28 h-28 mt-4 md:mt-0 flex-shrink-0 rounded-3xl bg-gradient-brand flex items-center justify-center shadow-lg shadow-brand-500/20">
          <Target size={48} className="text-white" />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Create Goal Form */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-1 bg-surface-card border border-surface-border rounded-2xl p-7 shadow-card"
        >
          <h2 className="text-lg font-bold text-ink-900 mb-6 flex items-center gap-2">
            <Plus size={20} className="text-brand-600" />
            Set New Goal
          </h2>

          <div className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider block mb-2">
                Target Reduction (%)
              </label>
              <input
                type="number"
                name="targetReductionPct"
                min="1"
                max="100"
                value={formData.targetReductionPct}
                onChange={handleChange}
                placeholder="e.g. 20"
                className="w-full px-4 py-3 rounded-xl bg-surface-panel border border-surface-border text-ink-900 placeholder-ink-300 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400/30 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider block mb-2">
                Duration (Days)
              </label>
              <input
                type="number"
                name="periodDays"
                min="1"
                value={formData.periodDays}
                onChange={handleChange}
                placeholder="e.g. 30"
                className="w-full px-4 py-3 rounded-xl bg-surface-panel border border-surface-border text-ink-900 placeholder-ink-300 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400/30 transition-all"
              />
            </div>

            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 text-status-danger text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2"
                >
                  <AlertCircle size={14} />
                  {errorMsg}
                </motion.div>
              )}
              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 text-brand-700 text-sm bg-brand-50 border border-brand-200 rounded-lg px-3 py-2"
                >
                  <CheckCircle size={14} />
                  {successMsg}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={createGoal}
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-gradient-brand text-white font-bold hover:opacity-90 transition-all shadow-[0_4px_16px_rgba(34,194,116,0.25)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <>
                  <Target size={16} />
                  Save Goal
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Active Goal Card */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          {loading ? (
            <div className="bg-surface-card border border-surface-border rounded-2xl p-7 h-full animate-pulse">
              <div className="h-6 bg-surface-muted rounded w-1/3 mb-4" />
              <div className="h-4 bg-surface-muted rounded w-2/3 mb-8" />
              <div className="h-5 bg-surface-panel rounded-full mb-4" />
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 bg-surface-panel rounded-xl" />
                ))}
              </div>
            </div>
          ) : goal ? (
            <div className="bg-surface-card border border-surface-border rounded-2xl p-7 h-full shadow-card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-ink-900 flex items-center gap-2">
                    <TrendingUp size={20} className="text-brand-600" />
                    Active Goal
                  </h2>
                  <p className="text-ink-500 text-sm mt-1">
                    Reduce emissions by{" "}
                    <span className="text-brand-700 font-bold">{goal.targetReductionPct}%</span>{" "}
                    over{" "}
                    <span className="text-ink-900 font-semibold">{goal.periodDays} days</span>
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColor(goal.status)}`}
                >
                  {goal.status}
                </span>
              </div>

              {/* Dates */}
              <div className="flex items-center gap-6 mb-6 text-sm text-ink-500">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-ink-300" />
                  Started: <span className="text-ink-900 ml-1">{goal.startDate || "—"}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-ink-300" />
                  Deadline: <span className="text-ink-900 ml-1">{goal.deadline || "—"}</span>
                </span>
              </div>

              {/* Progress Bar */}
              {progress && (
                <>
                  <div className="mb-2 flex justify-between items-center text-xs font-semibold">
                    <span className="text-ink-500">Time Progress</span>
                    <span className="text-ink-900">{progress.progressPercentage?.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-surface-muted rounded-full h-3 mb-6 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress.progressPercentage || 0}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-3 rounded-full ${
                        progress.onTrack
                          ? "bg-gradient-brand"
                          : "bg-gradient-to-r from-amber-500 to-red-500"
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                      { label: "Progress", value: `${progress.progressPercentage?.toFixed(1)}%`, color: "text-ink-900" },
                      { label: "Days Elapsed", value: progress.daysElapsed, color: "text-ink-900" },
                      { label: "Days Remaining", value: progress.daysRemaining, color: "text-sky-600" },
                      {
                        label: "Status",
                        value: progress.onTrack ? "🟢 On Track" : "🔴 Behind",
                        color: progress.onTrack ? "text-brand-700" : "text-status-danger",
                      },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="bg-surface-panel rounded-xl p-4 border border-surface-border">
                        <p className="text-ink-300 text-xs mb-1">{label}</p>
                        <p className={`font-bold text-lg ${color}`}>{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-surface-panel border border-surface-border rounded-xl p-4">
                    <p className="text-ink-700 text-sm">{progress.message}</p>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="bg-surface-card border border-surface-border rounded-2xl p-7 h-full flex flex-col items-center justify-center text-center shadow-card min-h-[280px]">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center mb-4">
                <Target size={28} className="text-brand-600" />
              </div>
              <h3 className="text-ink-900 font-bold text-lg mb-2">No Active Goal</h3>
              <p className="text-ink-300 text-sm max-w-xs">
                Set your first carbon reduction goal using the form to start tracking your progress.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Goals History Table */}
      {allGoals.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="bg-surface-card border border-surface-border rounded-2xl p-7 shadow-card"
        >
          <h2 className="text-lg font-bold text-ink-900 mb-6 flex items-center gap-2">
            <Award size={20} className="text-ink-500" />
            Goal History
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-ink-300 text-xs uppercase tracking-wider border-b border-surface-border">
                  <th className="text-left pb-3 font-semibold">Target</th>
                  <th className="text-left pb-3 font-semibold">Period</th>
                  <th className="text-left pb-3 font-semibold">Start Date</th>
                  <th className="text-left pb-3 font-semibold">Deadline</th>
                  <th className="text-left pb-3 font-semibold">Status</th>
                  <th className="text-left pb-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {allGoals.map((g) => (
                  <tr key={g.id} className="hover:bg-surface-panel transition-colors">
                    <td className="py-4 text-ink-900 font-semibold">{g.targetReductionPct}%</td>
                    <td className="py-4 text-ink-500">{g.periodDays} days</td>
                    <td className="py-4 text-ink-500">{g.startDate || "—"}</td>
                    <td className="py-4 text-ink-500">{g.deadline || "—"}</td>
                    <td className="py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusColor(g.status)}`}
                      >
                        {g.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => deleteGoal(g.id)}
                        className="p-2 rounded-lg text-ink-300 hover:text-status-danger hover:bg-red-50 transition-all"
                        title="Delete goal"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default Goals;
