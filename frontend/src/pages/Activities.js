import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { fetchAuth } from "../api";
import { motion } from "framer-motion";
import BlurText from "../components/BlurText";

function Activities() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchActivities();
  }, []);

  const deleteActivity = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this activity?"
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

      alert("Activity deleted successfully!");
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
      <div className="absolute top-0 right-1/4 w-[120%] h-[400px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      
      <Sidebar />

      <div className="flex-1 ml-[270px] p-8 lg:p-10 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="mb-10 flex justify-between items-end">
            <div>
              <BlurText 
                text="📋 All Activities"
                delay={50}
                className="text-4xl font-extrabold text-white tracking-tight mb-2"
              />
              <motion.p variants={itemVariants} className="text-lg text-slate-400 font-medium">
                Review and manage your logged carbon activities.
              </motion.p>
            </div>
            <motion.button
              variants={itemVariants}
              whileHover={{ y: -2, scale: 1.02 }}
              onClick={() => navigate("/logactivity")}
              className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg flex items-center gap-2"
            >
              <span>➕</span> Log New Activity
            </motion.button>
          </div>

          {/* Activities List */}
          <motion.div 
            variants={itemVariants}
            className="bg-slate-800/40 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/50 border-b border-slate-700">
                    <th className="py-5 px-6 font-semibold text-slate-400 text-sm uppercase tracking-wider rounded-tl-xl">Date</th>
                    <th className="py-5 px-6 font-semibold text-slate-400 text-sm uppercase tracking-wider">Category</th>
                    <th className="py-5 px-6 font-semibold text-slate-400 text-sm uppercase tracking-wider">Activity</th>
                    <th className="py-5 px-6 font-semibold text-slate-400 text-sm uppercase tracking-wider">Quantity</th>
                    <th className="py-5 px-6 font-semibold text-slate-400 text-sm uppercase tracking-wider">Carbon Emission</th>
                    <th className="py-5 px-6 font-semibold text-slate-400 text-sm uppercase tracking-wider text-center rounded-tr-xl">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {activities.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-16 text-center text-slate-500 font-medium text-lg">
                        No activities found. <span className="text-emerald-400 cursor-pointer hover:underline" onClick={() => navigate("/logactivity")}>Log one now!</span>
                      </td>
                    </tr>
                  ) : (
                    activities.slice().reverse().map((item, index) => (
                      <motion.tr 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={item.id} 
                        className="hover:bg-slate-700/30 transition-colors group"
                      >
                        <td className="py-5 px-6 text-slate-300 font-medium">{item.date}</td>
                        <td className="py-5 px-6 text-slate-400">
                          <span className="bg-slate-700/50 text-slate-300 px-3 py-1 rounded-full text-xs font-semibold border border-slate-600/50">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-5 px-6 text-slate-300">{item.activity}</td>
                        <td className="py-5 px-6 text-slate-300 font-medium">{item.quantity} <span className="text-slate-500 text-sm">{item.unit}</span></td>
                        <td className="py-5 px-6 text-emerald-400 font-bold text-lg">
                          {Number(item.carbonEmission).toFixed(2)} <span className="text-sm font-normal text-slate-500">kg</span>
                        </td>
                        <td className="py-5 px-6 text-center">
                          <button
                            onClick={() => deleteActivity(item.id)}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-transparent hover:border-red-500/30 px-4 py-2 rounded-lg font-medium transition-all opacity-0 group-hover:opacity-100"
                          >
                            Delete
                          </button>
                        </td>
                      </motion.tr>
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

export default Activities;