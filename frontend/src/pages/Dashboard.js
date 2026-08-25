import React, { useEffect, useState, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Sparkles,
  Calendar,
  TrendingDown,
  BarChart2,
  Users,
  MessageSquare,
  User,
  Award,
  Trophy,
  Target,
  Leaf,
  Flame,
  Sun,
  CalendarDays,
  CalendarRange
} from "lucide-react";
import { isAuthenticated, fetchAuth } from "../api";
import PeerBenchmarking from "../components/PeerBenchmarking";
import CarbonPieChart from "../components/CarbonPieChart";
import Chatbot from "../components/Chatbot";
import EcoScoreCard from "../components/EcoScoreCard";
import EcoTipsCard from "../components/EcoTipsCard";

// Lazy-load the heavy Three.js chart
const ThreeCarbonChart = React.lazy(() =>
  import("../components/ThreeCarbonChart")
);

function Dashboard() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [dailyCarbon, setDailyCarbon] = useState(0);
  const [weeklyCarbon, setWeeklyCarbon] = useState(0);
  const [monthlyCarbon, setMonthlyCarbon] = useState(0);
  const [recommendations, setRecommendations] = useState(null);
  const [loadingRecs, setLoadingRecs] = useState(true);
  const [goalProgress, setGoalProgress] = useState(null);

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
  const isTrendDown = true;

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
      {/* ── HERO SECTION ───────────────────────────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl"
      >
        <div className="absolute inset-0 bg-gradient-brand"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/10"></div>

        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 p-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

            {/* Left Side - Identity */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/25">
                  <Leaf size={34} className="text-white" strokeWidth={2} />
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-brand-600">
                  <span className="text-xs font-black text-brand-700">5</span>
                </div>
              </div>

              <div className="hidden sm:block pl-6 border-l border-white/25">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Level 5</span>
                  <span className="text-white/50">•</span>
                  <span className="text-xs font-medium text-white/80">Eco Champion</span>
                </div>
                <div className="flex items-center gap-4 mt-1.5">
                  <span className="text-xs text-white/80 flex items-center gap-1"><Flame size={12} /> 7 day streak</span>
                  <span className="text-xs text-white/80 flex items-center gap-1"><Award size={12} /> 12 badges</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-6 pr-6 border-r border-white/25">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{dailyCarbon.toFixed(1)}</p>
                  <p className="text-xs text-white/70">Today (kg)</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{activities.length}</p>
                  <p className="text-xs text-white/70">Activities</p>
                </div>
              </div>

              <button
                onClick={() => navigate("/logactivity")}
                className="group relative overflow-hidden bg-white hover:bg-white/90 px-6 py-3 rounded-xl text-brand-700 font-bold transition-all shadow-lg hover:scale-105 flex items-center gap-2"
              >
                <svg className="w-5 h-5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                <span className="relative z-10">Log Activity</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── QUICK ACTIONS CARDS ────────────────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <h3 className="text-sm font-semibold text-ink-500 uppercase tracking-wider mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <QuickActionCard
            icon={Trophy}
            title="Leaderboard"
            description="See how you rank"
            onClick={() => navigate("/leaderboard")}
            gradient="from-amber-400 to-amber-500"
          />
          <QuickActionCard
            icon={Users}
            title="Benchmarking"
            description="Compare with community"
            onClick={() => navigate("/benchmarking")}
            gradient="from-brand-400 to-brand-600"
          />
          <QuickActionCard
            icon={User}
            title="Profile"
            description="View your stats"
            onClick={() => navigate("/profile")}
            gradient="from-sky-400 to-sky-600"
          />
          <QuickActionCard
            icon={MessageSquare}
            title="AI Coach"
            description="Get tips & advice"
            onClick={() => navigate("/chatbot")}
            gradient="from-accent to-teal-600"
          />
        </div>
      </motion.div>

      {/* ── METRIC CARDS ───────────────────────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        <MetricCard
          icon={Sun}
          label="Today's Impact"
          value={dailyCarbon.toFixed(1)}
          unit="kg CO₂e"
          accent="text-amber-600"
          iconBg="bg-amber-50"
          iconColor="text-amber-500"
        />

        <MetricCard
          icon={CalendarDays}
          label="This Week"
          value={weeklyCarbon.toFixed(1)}
          unit="kg CO₂e"
          accent="text-sky-600"
          iconBg="bg-sky-50"
          iconColor="text-sky-500"
        />

        <MetricCard
          icon={CalendarRange}
          label="This Month"
          value={monthlyCarbon.toFixed(1)}
          unit="kg CO₂e"
          accent="text-brand-700"
          iconBg="bg-brand-50"
          iconColor="text-brand-600"
          badge={
            <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${isTrendDown ? "bg-brand-100 text-brand-700" : "bg-red-100 text-red-600"}`}>
              {isTrendDown ? <TrendingDown size={12} /> : <ArrowUpRight size={12} />}
              {trendPercent}%
            </span>
          }
        />

        <div className="bg-surface-card rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden group border border-surface-border shadow-card">
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center">
                <Target size={22} className="text-brand-600" />
              </div>
              {goalProgress && (
                <span className="text-brand-700 font-extrabold text-2xl">
                  {goalProgress.progressPercentage.toFixed(0)}%
                </span>
              )}
            </div>
            <p className="text-xs font-bold text-brand-700 uppercase tracking-widest mb-2">Goal Progress</p>
            {goalProgress ? (
              <>
                <div className="w-full bg-surface-muted rounded-full h-2 overflow-hidden mb-2">
                  <motion.div
                    className="bg-gradient-brand h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${goalProgress.progressPercentage}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                </div>
                <p className={`text-xs font-semibold mt-auto ${goalProgress.onTrack ? "text-brand-700" : "text-status-danger"}`}>
                  {goalProgress.onTrack ? "🟢 On Track" : "🔴 Behind"} · {goalProgress.daysRemaining}d left
                </p>
              </>
            ) : (
              <p className="text-ink-300 text-sm mt-auto">No active goal</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── CHART + RECENT LOGS ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="xl:col-span-2 space-y-6">
          <div className="bg-surface-card rounded-2xl p-6 flex flex-col border border-surface-border shadow-card">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-bold text-ink-900 flex items-center gap-2">
                  <BarChart2 size={20} className="text-brand-600" /> Emission Trends
                </h3>
                <p className="text-xs text-ink-500 mt-0.5">3D carbon footprint visualisation • drag to rotate</p>
              </div>
              <span className="flex items-center gap-2 text-xs font-medium text-ink-500">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-500" />
                CO₂e (kg)
              </span>
            </div>

            <div className="rounded-2xl overflow-hidden bg-surface-panel border border-surface-border">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-[380px] text-ink-300 text-sm">
                    Loading 3D chart…
                  </div>
                }
              >
                <ThreeCarbonChart activities={activities} />
              </Suspense>
            </div>
          </div>

          <div className="bg-surface-card rounded-2xl p-6 border border-surface-border shadow-card">
            <h3 className="text-lg font-bold text-ink-900 mb-1">Carbon Breakdown</h3>
            <p className="text-xs text-ink-500 mb-2">Emissions by category</p>
            <CarbonPieChart />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="xl:col-span-1 space-y-6">
          <EcoScoreCard score={82} />
          <EcoTipsCard />

          <div className="bg-surface-card rounded-2xl p-6 h-full flex flex-col border border-surface-border shadow-card">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-ink-900">Recent Logs</h3>
              <button
                onClick={() => navigate("/activities")}
                className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
              >
                View All →
              </button>
            </div>

            <div className="flex-1 flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-1">
              {activities.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 border border-dashed border-surface-border rounded-xl">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-brand-50 flex items-center justify-center">
                    <Leaf size={26} className="text-brand-500" />
                  </div>
                  <p className="text-sm font-medium text-ink-500 mb-1">No activities yet</p>
                  <button
                    onClick={() => navigate("/logactivity")}
                    className="text-xs font-bold text-brand-600 hover:text-brand-700 mt-2"
                  >
                    Log your first activity →
                  </button>
                </div>
              ) : (
                activities.slice().reverse().slice(0, 6).map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-surface-panel border border-surface-border hover:bg-surface-muted transition-colors cursor-default group"
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <p className="font-semibold text-ink-900 text-sm truncate pr-3">{item.activity}</p>
                      <p className="text-xs text-ink-300 whitespace-nowrap flex items-center gap-1">
                        <Calendar size={11} />{item.date}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-ink-500 bg-surface-card px-2 py-0.5 rounded-md border border-surface-border">
                        {item.category}
                      </span>
                      <span className="text-sm font-bold text-brand-700">
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
        <div className="bg-surface-card rounded-2xl p-8 relative overflow-hidden border border-surface-border shadow-card">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-50 to-teal-50" />
          <div className="relative z-10 flex flex-col lg:flex-row gap-6">
            <div className="w-16 h-16 flex-shrink-0 hidden lg:flex rounded-2xl bg-gradient-brand items-center justify-center">
              <Sparkles size={30} className="text-white" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4 lg:hidden">
                <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center">
                  <Sparkles size={18} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-ink-900">AI Sustainability Coach</h3>
              </div>
              <h3 className="text-xl font-bold text-ink-900 mb-4 hidden lg:block">AI Sustainability Coach</h3>

              {loadingRecs ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-surface-muted rounded w-3/4" />
                  <div className="h-4 bg-surface-muted rounded" />
                  <div className="h-4 bg-surface-muted rounded w-5/6" />
                </div>
              ) : (
                <p className="text-ink-700 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                  {recommendations || "No recommendations yet. Keep logging your activities to get personalised insights!"}
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── PEER BENCHMARKING ──────────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <PeerBenchmarking />
      </motion.div>

      <Chatbot />

    </motion.div>
  );
}

// ── Reusable metric card ──────────────────────────────────────────────────
function MetricCard({ icon: Icon, label, value, unit, accent, iconBg, iconColor, badge }) {
  return (
    <div className="bg-surface-card rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden group border border-surface-border shadow-card hover:shadow-card-hover transition-shadow">
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-2">
          <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center`}>
            <Icon size={22} className={iconColor} />
          </div>
          {badge}
        </div>
        <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${accent}`}>{label}</p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-extrabold text-ink-900">{value}</span>
          <span className="text-sm text-ink-300 font-medium">{unit}</span>
        </div>
      </div>
    </div>
  );
}

// ── Quick Action Card Component ────────────────────────────────────────────
function QuickActionCard({ icon: Icon, title, description, onClick, gradient }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-surface-card p-5 rounded-2xl flex items-center gap-4 group border border-surface-border shadow-card hover:shadow-card-hover transition-all"
    >
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}>
        <Icon size={26} className="text-white" />
      </div>
      <div className="text-left">
        <h3 className="text-ink-900 font-bold mb-1">{title}</h3>
        <p className="text-xs text-ink-500">{description}</p>
      </div>
      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
        <svg className="w-5 h-5 text-ink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </motion.button>
  );
}

export default Dashboard;
