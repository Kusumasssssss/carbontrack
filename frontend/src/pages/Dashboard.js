import React, { useEffect, useState, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Sparkles,
  Calendar,
  TrendingDown,
  BarChart2
} from "lucide-react";
import { isAuthenticated, fetchAuth } from "../api";
import LottieAnimation from "../components/LottieAnimation";

// Lazy-load the heavy Three.js chart
const ThreeCarbonChart = React.lazy(() =>
  import("../components/ThreeCarbonChart")
);

// ── Lottie URLs for each card ──────────────────────────────────────────────
const LOTTIE = {
  today:   "https://assets9.lottiefiles.com/packages/lf20_hg7zdf8w.json",  // transport/motion
  week:    "https://assets7.lottiefiles.com/packages/lf20_m6cu980y.json",  // electricity
  month:   "https://assets1.lottiefiles.com/packages/lf20_vnik4lq6.json",  // leaf/eco
  goal:    "https://assets4.lottiefiles.com/packages/lf20_touohxv0.json",  // trophy
  ai:      "https://assets2.lottiefiles.com/packages/lf20_5njp3vgg.json",  // globe
};

function Dashboard() {
  const navigate = useNavigate();
  const [activities, setActivities]       = useState([]);
  const [dailyCarbon, setDailyCarbon]     = useState(0);
  const [weeklyCarbon, setWeeklyCarbon]   = useState(0);
  const [monthlyCarbon, setMonthlyCarbon] = useState(0);
  const [recommendations, setRecommendations] = useState(null);
  const [loadingRecs, setLoadingRecs]     = useState(true);
  const [goalProgress, setGoalProgress]   = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) { navigate("/login"); return; }

    const fetchData = () => {
      fetchAuth("/activity")
        .then((r) => r.json()).then((d) => { if (Array.isArray(d)) setActivities(d); })
        .catch(console.error);

      fetchAuth("/footprint/daily")
        .then((r) => r.json()).then((d) => {
          if (Array.isArray(d)) setDailyCarbon(d.reduce((a, c) => a + Number(c.totalCo2e || 0), 0));
        }).catch(console.error);

      fetchAuth("/footprint/weekly")
        .then((r) => r.json()).then((d) => {
          if (Array.isArray(d)) setWeeklyCarbon(d.reduce((a, c) => a + Number(c.totalCo2e || 0), 0));
        }).catch(console.error);

      fetchAuth("/footprint/monthly")
        .then((r) => r.json()).then((d) => {
          if (Array.isArray(d)) setMonthlyCarbon(d.reduce((a, c) => a + Number(c.totalCo2e || 0), 0));
        }).catch(console.error);

      fetchAuth("/goals/progress")
        .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
        .then(setGoalProgress).catch(() => setGoalProgress(null));

      fetchAuth("/recommendations")
        .then((r) => r.json()).then((d) => {
          if (d?.recommendations) setRecommendations(d.recommendations);
          setLoadingRecs(false);
        }).catch(() => setLoadingRecs(false));
    };

    fetchData();
    const id = setInterval(fetchData, 10000);
    return () => clearInterval(id);
  }, [navigate]);

  const trendPercent = 12.4;
  const isTrendDown  = true;

  const containerVariants = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const itemVariants = {
    hidden:  { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 22 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto space-y-8"
    >

      {/* ── HERO SECTION WITH AVATARS ───────────────────────────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl"
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] via-[#1a1a1a] to-[#1a1a1a]"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 via-[#1a1a1a]/5 to-transparent"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#1a1a1a]/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 p-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            
            {/* Left Side - Avatars Row */}
            <div className="flex items-center gap-6">
              {/* Main Avatar - Large with Ring */}
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-orange-400 to-[#fb923c] rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-[#f97316] p-0.5">
                  <div className="w-full h-full rounded-full bg-[#0f0f0f] flex items-center justify-center overflow-hidden">
                    <LottieAnimation 
                      src="https://assets4.lottiefiles.com/packages/lf20_vnik4lq6.json"
                      style={{ width: "60px", height: "60px" }} 
                    />
                  </div>
                </div>
                {/* Level Badge */}
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-[#1a1a1a]">
                  <span className="text-xs font-black text-white">5</span>
                </div>
              </div>

              {/* Avatar Stack */}
              <div className="flex -space-x-4">
                {/* Avatar 2 */}
                <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[#a855f7] to-[#7c3aed] p-0.5 ring-2 ring-[#1a1a1a] hover:scale-110 transition-transform cursor-pointer">
                  <div className="w-full h-full rounded-full bg-[#0f0f0f] flex items-center justify-center">
                    <LottieAnimation 
                      src="https://assets7.lottiefiles.com/packages/lf20_q5pk6p1k.json"
                      style={{ width: "40px", height: "40px" }} 
                    />
                  </div>
                </div>
                {/* Avatar 3 */}
                <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[#ec4899] to-[#be185d] p-0.5 ring-2 ring-[#1a1a1a] hover:scale-110 transition-transform cursor-pointer">
                  <div className="w-full h-full rounded-full bg-[#0f0f0f] flex items-center justify-center">
                    <LottieAnimation 
                      src="https://assets4.lottiefiles.com/packages/lf20_touohxv0.json"
                      style={{ width: "40px", height: "40px" }} 
                    />
                  </div>
                </div>
                {/* Avatar 4 */}
                <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] p-0.5 ring-2 ring-[#1a1a1a] hover:scale-110 transition-transform cursor-pointer">
                  <div className="w-full h-full rounded-full bg-[#0f0f0f] flex items-center justify-center">
                    <LottieAnimation 
                      src="https://assets2.lottiefiles.com/packages/lf20_5njp3vgg.json"
                      style={{ width: "40px", height: "40px" }} 
                    />
                  </div>
                </div>
              </div>

              {/* Stats Text */}
              <div className="hidden sm:block pl-4 border-l border-[#2a2a2a]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">Level 5</span>
                  <span className="text-[#a3a3a3]">•</span>
                  <span className="text-xs font-medium text-[#737373]">Eco Champion</span>
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-xs text-[#a3a3a3]">🔥 7 day streak</span>
                  <span className="text-xs text-[#a3a3a3]">🏆 12 badges</span>
                </div>
              </div>
            </div>

            {/* Right Side - Action */}
            <div className="flex items-center gap-4">
              {/* Quick Stats */}
              <div className="hidden lg:flex items-center gap-6 pr-6 border-r border-[#2a2a2a]">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#e5e5e5]">{dailyCarbon.toFixed(1)}</p>
                  <p className="text-xs text-[#737373]">Today (kg)</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-400">{activities.length}</p>
                  <p className="text-xs text-[#737373]">Activities</p>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => navigate("/logactivity")}
                className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-[#f97316] hover:from-orange-400 hover:to-[#f97316] px-6 py-3 rounded-xl text-white font-bold transition-all shadow-lg hover:shadow-orange-500/25 hover:scale-105 flex items-center gap-2"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                <svg className="w-5 h-5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                <span className="relative z-10">Log Activity</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── METRIC CARDS ───────────────────────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {/* Today */}
        <MetricCard
          lottie={LOTTIE.today}
          label="Today's Impact"
          value={dailyCarbon.toFixed(1)}
          unit="kg CO₂e"
          accent="text-amber-400"
          border="border-amber-500/20"
          glow="bg-amber-500/10"
        />

        {/* Week */}
        <MetricCard
          lottie={LOTTIE.week}
          label="This Week"
          value={weeklyCarbon.toFixed(1)}
          unit="kg CO₂e"
          accent="text-indigo-400"
          border="border-indigo-500/20"
          glow="bg-indigo-500/10"
        />

        {/* Month */}
        <MetricCard
          lottie={LOTTIE.month}
          label="This Month"
          value={monthlyCarbon.toFixed(1)}
          unit="kg CO₂e"
          accent="text-brand-400"
          border="border-brand-500/20"
          glow="bg-brand-500/10"
          badge={
            <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${isTrendDown ? "bg-brand-500/20 text-brand-400" : "bg-red-500/20 text-red-400"}`}>
              {isTrendDown ? <TrendingDown size={12} /> : <ArrowUpRight size={12} />}
              {trendPercent}%
            </span>
          }
        />

        {/* Goal Progress */}
        <div className="glass-panel p-5 flex flex-col gap-3 relative overflow-hidden group border border-brand-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <div className="w-16 h-16">
                <LottieAnimation src={LOTTIE.goal} style={{ width: "100%", height: "100%" }} />
              </div>
              {goalProgress && (
                <span className="text-brand-400 font-extrabold text-2xl">
                  {goalProgress.progressPercentage.toFixed(0)}%
                </span>
              )}
            </div>
            <p className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-2">Goal Progress</p>
            {goalProgress ? (
              <>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden mb-2">
                  <motion.div
                    className="bg-gradient-to-r from-brand-500 to-emerald-400 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${goalProgress.progressPercentage}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                </div>
                <p className={`text-xs font-semibold mt-auto ${goalProgress.onTrack ? "text-brand-400" : "text-red-400"}`}>
                  {goalProgress.onTrack ? "🟢 On Track" : "🔴 Behind"} · {goalProgress.daysRemaining}d left
                </p>
              </>
            ) : (
              <p className="text-slate-500 text-sm mt-auto">No active goal</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── CHART + RECENT LOGS ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Three.js 3D Chart */}
        <motion.div variants={itemVariants} className="xl:col-span-2">
          <div className="glass-panel p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BarChart2 size={20} className="text-brand-400" /> Emission Trends
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">3D carbon footprint visualisation • drag to rotate</p>
              </div>
              <span className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-500 shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
                CO₂e (kg)
              </span>
            </div>

            {/* Three.js canvas */}
            <div className="flex-1 rounded-2xl overflow-hidden bg-slate-950/50 border border-white/5">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-[380px] text-slate-500 text-sm">
                    Loading 3D chart…
                  </div>
                }
              >
                <ThreeCarbonChart activities={activities} />
              </Suspense>
            </div>
          </div>
        </motion.div>

        {/* Recent Logs */}
        <motion.div variants={itemVariants} className="xl:col-span-1">
          <div className="glass-panel p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-white">Recent Logs</h3>
              <button
                onClick={() => navigate("/activities")}
                className="text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors"
              >
                View All →
              </button>
            </div>

            <div className="flex-1 flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-1">
              {activities.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 border border-dashed border-slate-700 rounded-xl">
                  <div className="w-20 h-20 mx-auto mb-2">
                    <LottieAnimation src={LOTTIE.today} style={{ width: "100%", height: "100%" }} />
                  </div>
                  <p className="text-sm font-medium text-slate-400 mb-1">No activities yet</p>
                  <button
                    onClick={() => navigate("/logactivity")}
                    className="text-xs font-bold text-brand-400 hover:text-brand-300 mt-2"
                  >
                    Log your first activity →
                  </button>
                </div>
              ) : (
                activities.slice().reverse().slice(0, 6).map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-slate-800/50 border border-white/5 hover:bg-slate-800 transition-colors cursor-default group"
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <p className="font-semibold text-slate-200 text-sm truncate pr-3">{item.activity}</p>
                      <p className="text-xs text-slate-500 whitespace-nowrap flex items-center gap-1">
                        <Calendar size={11} />{item.date}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400 bg-slate-900/50 px-2 py-0.5 rounded-md border border-white/5">
                        {item.category}
                      </span>
                      <span className="text-sm font-bold text-brand-400">
                        {(item.carbonEmission || 0).toFixed(2)}
                        <span className="text-xs text-brand-500/70 font-medium ml-1">kg</span>
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── AI SUSTAINABILITY COACH ────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <div className="glass-panel p-8 relative overflow-hidden border-brand-500/20">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-indigo-500/10" />
          <div className="relative z-10 flex flex-col lg:flex-row gap-6">

            {/* Lottie icon */}
            <div className="w-20 h-20 flex-shrink-0 hidden lg:block">
              <LottieAnimation src={LOTTIE.month} style={{ width: "100%", height: "100%" }} />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-indigo-500 flex items-center justify-center">
                  <Sparkles size={18} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">AI Sustainability Coach</h3>
              </div>

              {loadingRecs ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-slate-700 rounded w-3/4" />
                  <div className="h-4 bg-slate-700 rounded" />
                  <div className="h-4 bg-slate-700 rounded w-5/6" />
                </div>
              ) : (
                <p className="text-slate-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                  {recommendations || "No recommendations yet. Keep logging your activities to get personalised insights!"}
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
}

// ── Reusable metric card ──────────────────────────────────────────────────
function MetricCard({ lottie, label, value, unit, accent, border, glow, badge }) {
  return (
    <div className={`glass-panel p-5 flex flex-col gap-2 relative overflow-hidden group border ${border}`}>
      <div className={`absolute inset-0 ${glow} opacity-0 group-hover:opacity-100 transition-opacity`} />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-1">
          <div className="w-14 h-14">
            <LottieAnimation src={lottie} style={{ width: "100%", height: "100%" }} />
          </div>
          {badge}
        </div>
        <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${accent}`}>{label}</p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-extrabold text-white">{value}</span>
          <span className="text-sm text-slate-500 font-medium">{unit}</span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;