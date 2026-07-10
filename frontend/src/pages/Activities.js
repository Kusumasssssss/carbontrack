import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Search, Filter, AlertCircle, Database } from "lucide-react";
import { fetchAuth } from "../api";
import BlurText from "../components/BlurText";

function Activities() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchActivities();
  }, []);

  const deleteActivity = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this activity record?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetchAuth(`/activity/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      fetchActivities();
    } catch (error) {
      console.error(error);
      alert("Unable to delete activity.");
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await fetchAuth("/activity");
      const data = await response.json();

      if (Array.isArray(data)) {
        setActivities(data);
      } else {
        setActivities([]);
      }
    } catch (error) {
      console.error(error);
      alert("Unable to fetch activities.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const filteredActivities = activities.filter(item => 
    item.activity?.toLowerCase().includes(search.toLowerCase()) ||
    item.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto"
    >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <motion.div variants={itemVariants} className="flex items-center gap-2 text-brand-400 mb-2">
                <Database size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Data Repository</span>
              </motion.div>
              <BlurText 
                text="Activity Ledger"
                delay={40}
                className="text-4xl font-extrabold text-white tracking-tight mb-2"
              />
              <motion.p variants={itemVariants} className="text-slate-400 font-medium">
                Manage and audit all organizational carbon emission records.
              </motion.p>
            </div>
            
            <motion.div variants={itemVariants} className="flex gap-4">
              <button
                onClick={() => navigate("/logactivity")}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={18} />
                <span>New Entry</span>
              </button>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="glass-panel overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-white/5 bg-slate-900/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="relative w-full sm:w-96">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search activities or categories..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all placeholder-slate-500"
                />
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-white/10 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors">
                  <Filter size={16} />
                  Filter
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto min-h-[400px]">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-900/80 border-b border-white/5">
                    <th className="py-4 px-6 font-semibold text-slate-400 text-xs uppercase tracking-wider">Date</th>
                    <th className="py-4 px-6 font-semibold text-slate-400 text-xs uppercase tracking-wider">Category</th>
                    <th className="py-4 px-6 font-semibold text-slate-400 text-xs uppercase tracking-wider">Description</th>
                    <th className="py-4 px-6 font-semibold text-slate-400 text-xs uppercase tracking-wider">Quantity</th>
                    <th className="py-4 px-6 font-semibold text-slate-400 text-xs uppercase tracking-wider">Emissions (kg CO₂e)</th>
                    <th className="py-4 px-6 font-semibold text-slate-400 text-xs uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredActivities.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-24 text-center">
                        <div className="flex flex-col items-center justify-center">
                           <AlertCircle className="text-slate-600 mb-4" size={32} />
                           <h3 className="text-lg font-medium text-slate-300 mb-1">No records found</h3>
                           <p className="text-sm text-slate-500 mb-4">Get started by creating a new activity entry.</p>
                           <button onClick={() => navigate("/logactivity")} className="text-sm font-semibold text-brand-400 hover:text-brand-300">
                             + Create Entry
                           </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredActivities.slice().reverse().map((item, index) => (
                      <motion.tr 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.02 }}
                        key={item.id} 
                        className="hover:bg-slate-800/50 transition-colors group"
                      >
                        <td className="py-4 px-6 text-sm text-slate-300 font-medium">{item.date}</td>
                        <td className="py-4 px-6">
                          <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md text-xs font-semibold border border-white/5">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-200">{item.activity}</td>
                        <td className="py-4 px-6 text-sm text-slate-300">{item.quantity} <span className="text-slate-500 text-xs">{item.unit}</span></td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1">
                            <span className="text-brand-400 font-bold">{Number(item.carbonEmission).toFixed(2)}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => deleteActivity(item.id)}
                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            title="Delete Record"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Mockup */}
            {filteredActivities.length > 0 && (
              <div className="p-4 border-t border-white/5 bg-slate-900/50 flex justify-between items-center text-sm text-slate-400">
                <div>Showing {filteredActivities.length} records</div>
                <div className="flex gap-1">
                  <button className="px-3 py-1 border border-white/10 rounded hover:bg-slate-800 disabled:opacity-50" disabled>Prev</button>
                  <button className="px-3 py-1 border border-white/10 rounded bg-slate-800 text-white">1</button>
                  <button className="px-3 py-1 border border-white/10 rounded hover:bg-slate-800 disabled:opacity-50" disabled>Next</button>
                </div>
              </div>
            )}
          </motion.div>
    </motion.div>
  );
}

export default Activities;