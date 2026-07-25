import React, { useEffect, useState } from "react";
import { fetchAuth } from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Calendar, TrendingUp, CheckCircle, AlertCircle, Clock, Plus, Trash2, Award } from "lucide-react";
import LottieAnimation from "../components/LottieAnimation";

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
    if (s === "ACTIVE") return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    if (s === "ACHIEVED") return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    if (s === "SUPERSEDED") return "bg-slate-500/20 text-slate-400 border-slate-600/30";
    return "bg-red-500/20 text-red-300 border-red-500/30";
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
      <motion.div variants={itemVariants} className="mb-10 flex flex-col md:flex-row items-center justify-between bg-slate-900/60 border border-white/10 p-8 rounded-3xl backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <Target size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Goal Tracking</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
            Carbon Reduction Goals
          </h1>
          <p className="text-slate-400 font-medium max-w-xl">
            Set targets, track your trajectory, and stay on course for a greener footprint.
          </p>
        </div>
        <div className="w-36 h-36 mt-4 md:mt-0 flex-shrink-0">
          <LottieAnimation
            src="https://assets1.lottiefiles.com/packages/lf20_vnik4lq6.json"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Create Goal Form */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-1 bg-[#111827] border border-white/10 rounded-2xl p-7 shadow-xl"
        >
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Plus size={20} className="text-emerald-400" />
            Set New Goal
          </h2>

          <div className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
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
                className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Duration (Days)
              </label>
              <input
                type="number"
                name="periodDays"
                min="1"
                value={formData.periodDays}
                onChange={handleChange}
                placeholder="e.g. 30"
                className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
              />
            </div>

            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
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
                  className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2"
                >
                  <CheckCircle size={14} />
                  {successMsg}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={createGoal}
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold hover:from-emerald-400 hover:to-teal-500 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-7 h-full animate-pulse">
              <div className="h-6 bg-slate-700 rounded w-1/3 mb-4" />
              <div className="h-4 bg-slate-700 rounded w-2/3 mb-8" />
              <div className="h-5 bg-slate-800 rounded-full mb-4" />
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 bg-slate-800 rounded-xl" />
                ))}
              </div>
            </div>
          ) : goal ? (
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-7 h-full shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <TrendingUp size={20} className="text-emerald-400" />
                    Active Goal
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Reduce emissions by{" "}
                    <span className="text-emerald-400 font-bold">{goal.targetReductionPct}%</span>{" "}
                    over{" "}
                    <span className="text-white font-semibold">{goal.periodDays} days</span>
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColor(goal.status)}`}
                >
                  {goal.status}
                </span>
              </div>

              {/* Dates */}
              <div className="flex items-center gap-6 mb-6 text-sm text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-slate-500" />
                  Started: <span className="text-white ml-1">{goal.startDate || "—"}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-slate-500" />
                  Deadline: <span className="text-white ml-1">{goal.deadline || "—"}</span>
                </span>
              </div>

              {/* Progress Bar */}
              {progress && (
                <>
                  <div className="mb-2 flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-400">Time Progress</span>
                    <span className="text-white">{progress.progressPercentage?.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3 mb-6 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress.progressPercentage || 0}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-3 rounded-full ${
                        progress.onTrack
                          ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                          : "bg-gradient-to-r from-amber-500 to-red-500"
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                      { label: "Progress", value: `${progress.progressPercentage?.toFixed(1)}%`, color: "text-white" },
                      { label: "Days Elapsed", value: progress.daysElapsed, color: "text-white" },
                      { label: "Days Remaining", value: progress.daysRemaining, color: "text-sky-400" },
                      {
                        label: "Status",
                        value: progress.onTrack ? "🟢 On Track" : "🔴 Behind",
                        color: progress.onTrack ? "text-emerald-400" : "text-red-400",
                      },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="bg-slate-900/60 rounded-xl p-4 border border-white/5">
                        <p className="text-slate-500 text-xs mb-1">{label}</p>
                        <p className={`font-bold text-lg ${color}`}>{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-900/60 border border-white/5 rounded-xl p-4">
                    <p className="text-slate-300 text-sm">{progress.message}</p>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-7 h-full flex flex-col items-center justify-center text-center shadow-xl min-h-[280px]">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                <Target size={28} className="text-emerald-400" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">No Active Goal</h3>
              <p className="text-slate-500 text-sm max-w-xs">
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
          className="bg-[#111827] border border-white/10 rounded-2xl p-7 shadow-xl"
        >
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Award size={20} className="text-slate-400" />
            Goal History
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-white/5">
                  <th className="text-left pb-3 font-semibold">Target</th>
                  <th className="text-left pb-3 font-semibold">Period</th>
                  <th className="text-left pb-3 font-semibold">Start Date</th>
                  <th className="text-left pb-3 font-semibold">Deadline</th>
                  <th className="text-left pb-3 font-semibold">Status</th>
                  <th className="text-left pb-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {allGoals.map((g) => (
                  <tr key={g.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 text-white font-semibold">{g.targetReductionPct}%</td>
                    <td className="py-4 text-slate-400">{g.periodDays} days</td>
                    <td className="py-4 text-slate-400">{g.startDate || "—"}</td>
                    <td className="py-4 text-slate-400">{g.deadline || "—"}</td>
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
                        className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
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