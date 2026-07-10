import CarbonChart from "../components/CarbonChart";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { isAuthenticated, fetchAuth } from "../api";
import { motion } from "framer-motion";
import BlurText from "../components/BlurText";

function Dashboard() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);

  // Login check
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch activities
  useEffect(() => {
    fetchAuth("/activity")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setActivities(data);
        } else {
          setActivities([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setActivities([]);
      });
  }, []);

  // Today's Date
  const today = new Date().toISOString().split("T")[0];

  const todaysActivities = activities.filter(
    (item) => item.date === today
  );

  const totalCarbonEmission = activities.reduce(
    (sum, item) => sum + Number(item.carbonEmission || 0),
    0
  );

  const todaysCarbonEmission = todaysActivities.reduce(
    (sum, item) => sum + Number(item.carbonEmission || 0),
    0
  );

  // Animation variants
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
      {/* Background glow effects */}
      <div className="absolute top-0 -left-1/4 w-[150%] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      
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
              text="🌍 CarbonTrack Dashboard"
              delay={50}
              className="text-4xl font-extrabold text-white tracking-tight mb-2"
            />
            <motion.p variants={itemVariants} className="text-lg text-slate-400 font-medium">
              👋 Welcome back! 🌱 Let's build a greener future.
            </motion.p>
          </div>

          {/* Cards */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
          >
            <motion.div 
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-slate-800/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-slate-700/50 transition-all hover:border-emerald-500/30"
            >
              <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="p-1.5 rounded-md bg-emerald-500/20">🌍</span> Total Carbon
              </h3>
              <h1 className="text-4xl font-bold text-white mb-1">{totalCarbonEmission.toFixed(2)} <span className="text-xl text-slate-500">kg</span></h1>
              <p className="text-sm text-slate-400 font-medium">Total CO₂ Emission</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-slate-800/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-slate-700/50 transition-all hover:border-blue-500/30"
            >
              <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="p-1.5 rounded-md bg-blue-500/20">📅</span> Today's Carbon
              </h3>
              <h1 className="text-4xl font-bold text-white mb-1">{todaysCarbonEmission.toFixed(2)} <span className="text-xl text-slate-500">kg</span></h1>
              <p className="text-sm text-slate-400 font-medium">Today's CO₂</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-slate-800/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-slate-700/50 transition-all hover:border-orange-500/30"
            >
              <h3 className="text-sm font-semibold text-orange-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="p-1.5 rounded-md bg-orange-500/20">🌿</span> Total Activities
              </h3>
              <h1 className="text-4xl font-bold text-white mb-1">{activities.length}</h1>
              <p className="text-sm text-slate-400 font-medium">Activities Recorded</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-slate-800/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-slate-700/50 transition-all hover:border-purple-500/30"
            >
              <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="p-1.5 rounded-md bg-purple-500/20">🏆</span> Eco Score
              </h3>
              <h1 className="text-4xl font-bold text-white mb-1">
                {Math.max(100 - totalCarbonEmission.toFixed(0), 0)}
              </h1>
              <p className="text-sm text-slate-400 font-medium">Green Score Rating</p>
            </motion.div>
          </motion.div>

          {/* Chart */}
          <motion.div 
            variants={itemVariants}
            className="bg-slate-800/40 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-slate-700/50 mb-10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -z-10"></div>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-emerald-400">📈</span> Carbon Emission Overview
            </h2>
            <div className="w-full h-[360px] bg-slate-900/50 rounded-xl p-4 border border-slate-700/30">
              <CarbonChart activities={activities} />
            </div>
          </motion.div>

          {/* Recent Activities */}
          <motion.div 
            variants={itemVariants}
            className="bg-slate-800/40 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-slate-700/50 mb-10 overflow-hidden"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-blue-400">📋</span> Recent Activities
              </h2>
              <button
                onClick={() => navigate("/logactivity")}
                className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-5 py-2.5 rounded-xl font-semibold transition-all transform hover:-translate-y-0.5 shadow-lg text-sm flex items-center gap-2"
              >
                <span>➕</span> Log New Activity
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/50 border-b border-slate-700">
                    <th className="py-4 px-6 font-semibold text-slate-400 text-sm uppercase tracking-wider rounded-tl-xl">Date</th>
                    <th className="py-4 px-6 font-semibold text-slate-400 text-sm uppercase tracking-wider">Category</th>
                    <th className="py-4 px-6 font-semibold text-slate-400 text-sm uppercase tracking-wider">Activity</th>
                    <th className="py-4 px-6 font-semibold text-slate-400 text-sm uppercase tracking-wider">Quantity</th>
                    <th className="py-4 px-6 font-semibold text-slate-400 text-sm uppercase tracking-wider">Unit</th>
                    <th className="py-4 px-6 font-semibold text-slate-400 text-sm uppercase tracking-wider rounded-tr-xl">Carbon (kg CO₂)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {activities.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-slate-500 font-medium">
                        No activities found. Start logging!
                      </td>
                    </tr>
                  ) : (
                    activities
                      .slice()
                      .reverse()
                      .slice(0, 5)
                      .map((item) => (
                        <tr key={item.id} className="hover:bg-slate-700/30 transition-colors">
                          <td className="py-4 px-6 text-sm text-slate-300 font-medium">{item.date}</td>
                          <td className="py-4 px-6 text-sm text-slate-400">{item.category}</td>
                          <td className="py-4 px-6 text-sm text-slate-400">{item.activity}</td>
                          <td className="py-4 px-6 text-sm text-slate-300 font-medium">{item.quantity}</td>
                          <td className="py-4 px-6 text-sm text-slate-500">{item.unit}</td>
                          <td className="py-4 px-6 text-sm text-emerald-400 font-bold">
                            {(item.carbonEmission || 0).toFixed(2)}
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;