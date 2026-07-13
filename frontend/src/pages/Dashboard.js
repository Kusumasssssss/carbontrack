import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  Leaf, 
  Target, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  CloudLightning,
  AlertCircle,
  Plus
} from "lucide-react";
import CarbonChart from "../components/CarbonChart";
import { isAuthenticated, fetchAuth } from "../api";

function Dashboard() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

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

  const today = new Date().toISOString().split("T")[0];
  const todaysActivities = activities.filter((item) => item.date === today);

  const totalCarbonEmission = activities.reduce((sum, item) => sum + Number(item.carbonEmission || 0), 0);
  const todaysCarbonEmission = todaysActivities.reduce((sum, item) => sum + Number(item.carbonEmission || 0), 0);
  
  // Faux data for trends
  const trendPercent = 12.4; 
  const isTrendDown = true;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto"
    >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <motion.div variants={itemVariants} className="flex items-center gap-2 text-brand-400 mb-2">
                <CloudLightning size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Workspace Dashboard</span>
              </motion.div>
              <motion.h1 variants={itemVariants} className="text-4xl font-extrabold tracking-tight text-white mb-2">
                Executive Summary
              </motion.h1>
              <motion.p variants={itemVariants} className="text-slate-400 font-medium">
                Real-time overview of your organizational environmental impact.
              </motion.p>
            </div>
            
            <motion.div variants={itemVariants} className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2.5 shadow-inner">
                <Calendar size={16} className="text-slate-400" />
                <span className="text-sm font-medium text-slate-300">Last 30 Days</span>
                <svg className="w-4 h-4 text-slate-500 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
              <button 
                onClick={() => navigate("/logactivity")}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={18} />
                <span>Log Data</span>
              </button>
            </motion.div>
          </div>

          {/* Metric Cards */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
          >
            {/* Total Carbon */}
            <div className="glass-panel p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center border border-brand-500/20">
                  <Leaf size={20} className="text-brand-400" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${isTrendDown ? 'bg-brand-500/20 text-brand-400' : 'bg-red-500/20 text-red-400'}`}>
                  {isTrendDown ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                  {trendPercent}%
                </div>
              </div>
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Carbon</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-3xl font-bold text-white">{totalCarbonEmission.toFixed(1)}</h2>
                <span className="text-sm text-slate-500 font-medium">kg CO₂e</span>
              </div>
            </div>

            {/* Today's Carbon */}
            <div className="glass-panel p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center border border-accent/20">
                  <Activity size={20} className="text-accent" />
                </div>
              </div>
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Today's Impact</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-3xl font-bold text-white">{todaysCarbonEmission.toFixed(1)}</h2>
                <span className="text-sm text-slate-500 font-medium">kg CO₂e</span>
              </div>
            </div>

            {/* Total Activities */}
            <div className="glass-panel p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20">
                  <BarChart3 size={20} className="text-indigo-400" />
                </div>
              </div>
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Records Logged</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-3xl font-bold text-white">{activities.length}</h2>
                <span className="text-sm text-slate-500 font-medium">entries</span>
              </div>
            </div>

            {/* Eco Score */}
            <div className="glass-panel p-6 border-brand-500/30 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
                  <Target size={20} className="text-white" />
                </div>
              </div>
              <p className="text-sm font-semibold text-brand-400 uppercase tracking-wider mb-1 relative z-10">Eco Score</p>
              <div className="flex items-baseline gap-2 relative z-10">
                <h2 className="text-3xl font-bold text-white">
                  {Math.max(100 - totalCarbonEmission.toFixed(0), 0)}
                </h2>
                <span className="text-sm text-slate-500 font-medium">/ 100</span>
              </div>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Chart Section */}
            <motion.div variants={itemVariants} className="xl:col-span-2">
              <div className="glass-panel p-8 h-full flex flex-col">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-lg font-bold text-white">Emission Trends</h3>
                    <p className="text-sm text-slate-400">Carbon footprint over the selected period</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="flex items-center gap-2 text-xs font-medium text-slate-400">
                      <div className="w-2 h-2 rounded-full bg-brand-500" /> Emissions
                    </span>
                  </div>
                </div>
                <div className="flex-1 w-full min-h-[350px]">
                  {/* Chart component should ideally use the brand colors now */}
                  <CarbonChart activities={activities} />
                </div>
              </div>
            </motion.div>

            {/* Recent Activities Section */}
            <motion.div variants={itemVariants} className="xl:col-span-1">
              <div className="glass-panel p-6 h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white">Recent Logs</h3>
                  <button onClick={() => navigate("/activities")} className="text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors">
                    View All
                  </button>
                </div>
                
                <div className="flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
                  {activities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6 border border-dashed border-slate-700 rounded-xl">
                      <AlertCircle className="text-slate-500 mb-3" size={24} />
                      <p className="text-sm font-medium text-slate-400 mb-1">No activities found</p>
                      <p className="text-xs text-slate-500 mb-4">Start tracking your emissions.</p>
                      <button onClick={() => navigate("/logactivity")} className="text-xs font-bold text-brand-400 hover:text-brand-300">
                        Log Activity &rarr;
                      </button>
                    </div>
                  ) : (
                    activities.slice().reverse().slice(0, 5).map((item) => (
                      <div key={item.id} className="p-4 rounded-xl bg-slate-800/50 border border-white/5 hover:bg-slate-800 transition-colors group cursor-default">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-semibold text-slate-200 text-sm truncate pr-4">{item.activity}</div>
                          <div className="text-xs font-medium text-slate-500 whitespace-nowrap">{item.date}</div>
                        </div>
                        <div className="flex justify-between items-end mt-4">
                          <div className="text-xs text-slate-400 bg-slate-900/50 px-2 py-1 rounded-md border border-white/5">
                            {item.category}
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-brand-400">
                              {(item.carbonEmission || 0).toFixed(2)} <span className="text-xs text-brand-500/70 font-medium">kg</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
            
          </div>
    </motion.div>
  );
}

export default Dashboard;