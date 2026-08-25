import React, { useEffect, useState } from "react";
import { fetchAuth } from "../api";
import { motion } from "framer-motion";
import BlurText from "../components/BlurText";
import { BarChart3, PieChart as PieChartIcon, TrendingUp, Activity, ArrowUpRight, Zap, Target } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

function Analytics() {
  const [activities, setActivities] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [totalCarbon, setTotalCarbon] = useState(0);
  const [recommendations, setRecommendations] = useState(null);
  const [loadingRecs, setLoadingRecs] = useState(true);

  useEffect(() => {
    // Fetch raw activities for total count
    fetchAuth("/activity")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setActivities(data);
        }
      })
      .catch(console.error);

    // Fetch pre-aggregated footprint data from Redis cache
    fetchAuth("/footprint/monthly")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const formattedData = data.map(item => ({
            name: item.category,
            value: Number(item.totalCo2e || 0)
          }));
          setChartData(formattedData);

          const sum = data.reduce((acc, curr) => acc + Number(curr.totalCo2e || 0), 0);
          setTotalCarbon(sum);
        }
      })
      .catch(console.error);

    // Fetch live AI Recommendations from Gemini
    fetchAuth("/recommendations")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.recommendations) {
          setRecommendations(data.recommendations);
        }
        setLoadingRecs(false);
      })
      .catch(() => setLoadingRecs(false));
  }, []);

  const highest =
    chartData.length > 0
      ? chartData.reduce((a, b) => (a.value > b.value ? a : b))
      : { name: "-", value: 0 };

  const COLORS = [
    "#22c274", // brand-500
    "#0284c7", // sky-600
    "#f59e0b", // amber-500
    "#dc2626", // red-600
    "#8b5cf6", // violet-500
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface-card border border-surface-border p-3 rounded-lg shadow-card-hover">
          <p className="text-ink-700 text-sm font-semibold mb-1">{label || payload[0].name}</p>
          <p className="text-brand-700 font-bold text-lg">
            {payload[0].value.toFixed(2)} <span className="text-xs text-ink-300 font-medium">kg CO₂e</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto"
    >
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 bg-surface-card border border-surface-border p-8 rounded-3xl shadow-card">
            <div>
              <motion.div variants={itemVariants} className="flex items-center gap-2 text-brand-600 mb-2">
                <BarChart3 size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Intelligence & Insights</span>
              </motion.div>
              <BlurText
                text="Carbon Analytics"
                delay={40}
                className="text-4xl font-extrabold text-ink-900 tracking-tight mb-2"
              />
              <motion.p variants={itemVariants} className="text-ink-500 font-medium max-w-xl">
                Deep dive into your emission data to discover trends and optimization opportunities powered by Redis caching.
              </motion.p>
            </div>

            <div className="w-24 h-24 flex-shrink-0 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-lg shadow-brand-500/20">
              <BarChart3 size={40} className="text-white" />
            </div>
          </div>

          {/* KPI Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
          >
            <div className="bg-surface-card border border-surface-border rounded-2xl shadow-card p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center border border-brand-200">
                  <Activity size={20} className="text-brand-600" />
                </div>
                <div className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-brand-50 text-brand-700">
                  <ArrowUpRight size={14} />
                  Net Total
                </div>
              </div>
              <p className="text-sm font-semibold text-ink-500 uppercase tracking-wider mb-1">Total Carbon</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-3xl font-bold text-ink-900">{totalCarbon.toFixed(1)}</h2>
                <span className="text-sm text-ink-300 font-medium">kg CO₂e</span>
              </div>
            </div>

            <div className="bg-surface-card border border-surface-border rounded-2xl shadow-card p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center border border-sky-200">
                  <Target size={20} className="text-sky-600" />
                </div>
              </div>
              <p className="text-sm font-semibold text-ink-500 uppercase tracking-wider mb-1">Total Activities</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-3xl font-bold text-ink-900">{activities.length}</h2>
                <span className="text-sm text-ink-300 font-medium">records</span>
              </div>
            </div>

            <div className="bg-surface-card border border-surface-border rounded-2xl shadow-card p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-200">
                  <TrendingUp size={20} className="text-orange-500" />
                </div>
              </div>
              <p className="text-sm font-semibold text-ink-500 uppercase tracking-wider mb-1">Highest Source</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-2xl font-bold text-ink-900 truncate">{highest.name}</h2>
              </div>
            </div>

            <div className="bg-surface-card border border-brand-200 rounded-2xl shadow-card p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-lg shadow-brand-500/20">
                  <PieChartIcon size={20} className="text-white" />
                </div>
              </div>
              <p className="text-sm font-semibold text-brand-700 uppercase tracking-wider mb-1">Avg Emission / Record</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-3xl font-bold text-ink-900">
                  {activities.length ? (totalCarbon / activities.length).toFixed(1) : "0.0"}
                </h2>
                <span className="text-sm text-ink-300 font-medium">kg CO₂e</span>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* Pie Chart */}
            <motion.div variants={itemVariants} className="bg-surface-card border border-surface-border rounded-2xl shadow-card p-8 h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-ink-900">Emission by Category</h3>
                  <p className="text-sm text-ink-500">Distribution of carbon sources</p>
                </div>
              </div>

              <div className="flex-1 w-full min-h-[350px] relative">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={5}
                        stroke="#ffffff"
                        strokeWidth={2}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value) => <span className="text-ink-700 font-medium">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-ink-300 font-medium">No data available for charting.</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Bar Chart */}
            <motion.div variants={itemVariants} className="bg-surface-card border border-surface-border rounded-2xl shadow-card p-8 h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-ink-900">Category Comparison</h3>
                  <p className="text-sm text-ink-500">Total emissions per category</p>
                </div>
              </div>

              <div className="flex-1 w-full min-h-[350px] relative">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e3e9e5" vertical={false} />
                      <XAxis dataKey="name" stroke="#94a49c" tick={{ fill: '#5c6f66', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis stroke="#94a49c" tick={{ fill: '#5c6f66', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f3', opacity: 0.6 }} />
                      <Bar dataKey="value" fill="#22c274" radius={[6, 6, 0, 0]} maxBarSize={60}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-ink-300 font-medium">No data available for charting.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* AI Insights Section — Live Gemini */}
          <motion.div
            variants={itemVariants}
            className="bg-surface-card border border-brand-200 rounded-2xl shadow-card p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full blur-[80px] -z-10" />
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-brand-50 p-2 rounded-lg border border-brand-200">
                <Zap size={20} className="text-brand-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-ink-900">AI Sustainability Coach</h2>
                <p className="text-xs text-ink-300 mt-0.5">Personalised tips based on your top emission sources</p>
              </div>
            </div>

            {loadingRecs ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-surface-muted rounded w-3/4" />
                <div className="h-4 bg-surface-muted rounded w-5/6" />
                <div className="h-4 bg-surface-muted rounded w-2/3" />
                <div className="h-4 bg-surface-muted rounded w-4/5" />
              </div>
            ) : recommendations ? (
              <div className="bg-surface-panel rounded-xl border border-surface-border p-5">
                <p className="text-ink-700 text-sm whitespace-pre-wrap leading-relaxed">{recommendations}</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-3xl mb-3">🌱</div>
                <p className="text-ink-300 text-sm">
                  No recommendations yet. Keep logging activities to get personalised AI insights!
                </p>
              </div>
            )}
          </motion.div>

    </motion.div>
  );
}

export default Analytics;
