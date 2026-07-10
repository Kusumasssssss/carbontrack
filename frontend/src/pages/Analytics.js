import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { fetchAuth } from "../api";
import { motion } from "framer-motion";
import BlurText from "../components/BlurText";
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

  useEffect(() => {
    fetchAuth("/activity")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setActivities(data);
        }
      })
      .catch(console.error);
  }, []);

  const totalCarbon = activities.reduce(
    (sum, item) => sum + Number(item.carbonEmission || 0),
    0
  );

  const categories = {};

  activities.forEach((item) => {
    if (!categories[item.category]) {
      categories[item.category] = 0;
    }

    categories[item.category] += Number(item.carbonEmission || 0);
  });

  const chartData = Object.keys(categories).map((key) => ({
    name: key,
    value: categories[key],
  }));

  const highest =
    chartData.length > 0
      ? chartData.reduce((a, b) => (a.value > b.value ? a : b))
      : { name: "-", value: 0 };

  const COLORS = [
    "#10b981", // emerald-500
    "#3b82f6", // blue-500
    "#f59e0b", // amber-500
    "#ef4444", // red-500
    "#8b5cf6", // violet-500
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex bg-slate-900 min-h-screen text-slate-50 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[600px] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>
      
      <Sidebar />

      <div className="flex-1 ml-[270px] p-8 lg:p-10 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="mb-10">
            <BlurText 
              text="📊 Carbon Analytics"
              delay={50}
              className="text-4xl font-extrabold text-white tracking-tight mb-2"
            />
            <motion.p variants={itemVariants} className="text-lg text-slate-400 font-medium">
              Analyze your carbon footprint and discover trends.
            </motion.p>
          </div>

          {/* KPI Cards */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
          >
            <motion.div whileHover={{ y: -4, scale: 1.02 }} className="bg-slate-800/40 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-slate-700/50 hover:border-emerald-500/30 transition-all">
              <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2">🌍 Total Carbon</h3>
              <h1 className="text-4xl font-bold text-white">{totalCarbon.toFixed(2)} <span className="text-xl text-slate-500">kg</span></h1>
            </motion.div>

            <motion.div whileHover={{ y: -4, scale: 1.02 }} className="bg-slate-800/40 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-slate-700/50 hover:border-blue-500/30 transition-all">
              <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">📋 Total Activities</h3>
              <h1 className="text-4xl font-bold text-white">{activities.length}</h1>
            </motion.div>

            <motion.div whileHover={{ y: -4, scale: 1.02 }} className="bg-slate-800/40 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-slate-700/50 hover:border-orange-500/30 transition-all">
              <h3 className="text-sm font-semibold text-orange-400 uppercase tracking-wider mb-2">🏆 Highest Category</h3>
              <h2 className="text-2xl font-bold text-white truncate">{highest.name}</h2>
            </motion.div>

            <motion.div whileHover={{ y: -4, scale: 1.02 }} className="bg-slate-800/40 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-slate-700/50 hover:border-purple-500/30 transition-all">
              <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-2">📊 Average Emission</h3>
              <h2 className="text-3xl font-bold text-white">
                {activities.length ? (totalCarbon / activities.length).toFixed(2) : "0.00"} <span className="text-lg text-slate-500">kg</span>
              </h2>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* Pie Chart */}
            <motion.div 
              variants={itemVariants}
              className="bg-slate-800/40 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-slate-700/50"
            >
              <h2 className="text-xl font-bold text-white mb-6">🥧 Emission by Category</h2>
              <div className="w-full h-[330px] bg-slate-900/50 rounded-xl border border-slate-700/30 p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={110}
                      label={{ fill: '#e2e8f0', fontSize: 12 }}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                      itemStyle={{ color: '#e2e8f0' }}
                    />
                    <Legend wrapperStyle={{ color: '#94a3b8' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Bar Chart */}
            <motion.div 
              variants={itemVariants}
              className="bg-slate-800/40 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-slate-700/50"
            >
              <h2 className="text-xl font-bold text-white mb-6">📊 Emission Comparison</h2>
              <div className="w-full h-[330px] bg-slate-900/50 rounded-xl border border-slate-700/30 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                    <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                      itemStyle={{ color: '#e2e8f0' }}
                      cursor={{ fill: '#334155', opacity: 0.4 }}
                    />
                    <Legend wrapperStyle={{ color: '#94a3b8' }} />
                    <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Tips Section */}
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-br from-emerald-900/40 to-slate-800/40 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-emerald-500/20"
          >
            <h2 className="text-2xl font-bold text-emerald-400 mb-6">🌱 Carbon Reduction Tips</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300 font-medium">
              <li className="flex items-center gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 hover:border-emerald-500/30 transition-colors">
                <span className="text-2xl">🚲</span> Use bicycles for short distances
              </li>
              <li className="flex items-center gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 hover:border-emerald-500/30 transition-colors">
                <span className="text-2xl">🚆</span> Prefer public transportation
              </li>
              <li className="flex items-center gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 hover:border-emerald-500/30 transition-colors">
                <span className="text-2xl">💡</span> Switch off unused electrical appliances
              </li>
              <li className="flex items-center gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 hover:border-emerald-500/30 transition-colors">
                <span className="text-2xl">🌳</span> Plant more trees
              </li>
              <li className="flex items-center gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 hover:border-emerald-500/30 transition-colors md:col-span-2 lg:col-span-1">
                <span className="text-2xl">🥗</span> Reduce food waste
              </li>
            </ul>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}

export default Analytics;