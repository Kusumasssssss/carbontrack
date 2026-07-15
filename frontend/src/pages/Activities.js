import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Trash2, Search, Filter, AlertCircle, Database, 
  Edit2, Car, Zap, Utensils, ShoppingBag, Trash, ChevronDown, ChevronUp, X, Check, ArrowRight
} from "lucide-react";
import { fetchAuth } from "../api";
import BlurText from "../components/BlurText";

function Activities() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [activeCategory, setActiveCategory] = useState("All");
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

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
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      const response = await fetchAuth(`/activity/${itemToDelete.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      setActivities(activities.filter(a => a.id !== itemToDelete.id));
      setItemToDelete(null);
    } catch (error) {
      console.error(error);
      alert("Unable to delete activity.");
    } finally {
      setIsDeleting(false);
    }
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const categories = ["All", ...new Set(activities.map(a => a.category?.toUpperCase() || "UNKNOWN"))];

  const filteredAndSortedActivities = useMemo(() => {
    let filtered = activities.filter(item => {
      const matchSearch = item.activity?.toLowerCase().includes(search.toLowerCase()) || 
                          item.category?.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCategory === "All" || item.category?.toUpperCase() === activeCategory;
      return matchSearch && matchCat;
    });

    return filtered.sort((a, b) => {
      if (sortConfig.key === 'date') {
        return sortConfig.direction === 'asc' 
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      }
      if (sortConfig.key === 'emissions') {
        return sortConfig.direction === 'asc'
          ? (a.carbonEmission || 0) - (b.carbonEmission || 0)
          : (b.carbonEmission || 0) - (a.carbonEmission || 0);
      }
      return 0;
    });
  }, [activities, search, activeCategory, sortConfig]);

  const totalEmissions = useMemo(() => {
    return filteredAndSortedActivities.reduce((sum, item) => sum + Number(item.carbonEmission || 0), 0);
  }, [filteredAndSortedActivities]);

  const getCategoryConfig = (cat) => {
    const category = cat?.toUpperCase() || "";
    switch (category) {
      case "TRANSPORT":
      case "TRANSPORTATION":
        return { icon: <Car size={14} />, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" };
      case "ELECTRICITY":
        return { icon: <Zap size={14} />, color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" };
      case "FOOD":
        return { icon: <Utensils size={14} />, color: "text-green-400 bg-green-500/10 border-green-500/20" };
      case "SHOPPING":
        return { icon: <ShoppingBag size={14} />, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" };
      case "WASTE":
        return { icon: <Trash size={14} />, color: "text-orange-400 bg-orange-500/10 border-orange-500/20" };
      default:
        return { icon: <AlertCircle size={14} />, color: "text-slate-400 bg-slate-500/10 border-slate-500/20" };
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

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-6xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <motion.div variants={itemVariants} className="flex items-center gap-2 text-brand-400 mb-2">
            <Database size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Data Repository</span>
          </motion.div>
          <BlurText text="Activity Ledger" delay={40} className="text-4xl font-extrabold text-white tracking-tight mb-2" />
          <motion.p variants={itemVariants} className="text-slate-400 font-medium">
            Manage, audit, and analyze your organizational carbon records.
          </motion.p>
        </div>
        <motion.div variants={itemVariants} className="flex gap-4">
          <button onClick={() => navigate("/logactivity")} className="btn-primary flex items-center gap-2 shadow-lg shadow-brand-500/20">
            <Plus size={18} /><span>New Entry</span>
          </button>
        </motion.div>
      </div>

      {/* Main Glass Panel */}
      <motion.div variants={itemVariants} className="glass-panel overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="p-5 border-b border-white/5 bg-slate-900/80 backdrop-blur-xl flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
          <div className="relative w-full lg:w-96 group">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search descriptions or categories..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all placeholder-slate-500"
            />
          </div>
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${activeCategory === cat ? 'bg-brand-500/20 text-brand-400 border-brand-500/30 shadow-lg shadow-brand-500/10' : 'bg-slate-900/50 text-slate-400 border-white/5 hover:bg-slate-800'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto min-h-[400px] relative">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="sticky top-0 bg-slate-950/90 backdrop-blur-md z-10 shadow-sm">
              <tr>
                <th 
                  onClick={() => requestSort('date')}
                  className="py-5 px-6 font-semibold text-slate-400 text-xs uppercase tracking-wider cursor-pointer hover:text-white transition-colors group select-none"
                >
                  <div className="flex items-center gap-2">Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} className="text-brand-400"/> : <ChevronDown size={14} className="text-brand-400"/>)}</div>
                </th>
                <th className="py-5 px-6 font-semibold text-slate-400 text-xs uppercase tracking-wider">Category</th>
                <th className="py-5 px-6 font-semibold text-slate-400 text-xs uppercase tracking-wider">Description</th>
                <th className="py-5 px-6 font-semibold text-slate-400 text-xs uppercase tracking-wider">Quantity</th>
                <th 
                  onClick={() => requestSort('emissions')}
                  className="py-5 px-6 font-semibold text-slate-400 text-xs uppercase tracking-wider cursor-pointer hover:text-white transition-colors group select-none"
                >
                  <div className="flex items-center gap-2">Emissions (kg CO₂e) {sortConfig.key === 'emissions' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} className="text-brand-400"/> : <ChevronDown size={14} className="text-brand-400"/>)}</div>
                </th>
                <th className="py-5 px-6 font-semibold text-slate-400 text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence initial={false}>
                {filteredAndSortedActivities.length === 0 ? (
                  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="empty">
                    <td colSpan="6" className="py-24 text-center">
                      <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                        <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-4 border border-white/5">
                          <AlertCircle className="text-brand-500" size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">No records found</h3>
                        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                          We couldn't find any activities matching your current filters. Try adjusting your search or add a new entry.
                        </p>
                        <button onClick={() => navigate("/logactivity")} className="px-6 py-2.5 bg-brand-500/10 text-brand-400 border border-brand-500/20 rounded-xl text-sm font-bold hover:bg-brand-500/20 transition-colors">
                          Log New Activity
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  filteredAndSortedActivities.map((item) => {
                    const catConfig = getCategoryConfig(item.category);
                    return (
                      <motion.tr 
                        layout
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, x: -20, backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                        key={item.id} 
                        className="hover:bg-slate-800/40 transition-colors group"
                      >
                        <td className="py-4 px-6 text-sm text-slate-300 font-medium">{item.date}</td>
                        <td className="py-4 px-6">
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border ${catConfig.color}`}>
                            {catConfig.icon}
                            {item.category?.toUpperCase()}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-200">{item.activity}</td>
                        <td className="py-4 px-6 text-sm text-slate-300">{item.quantity} <span className="text-slate-500 text-xs ml-1">{item.unit}</span></td>
                        <td className="py-4 px-6">
                          <div className="text-brand-400 font-bold text-base">{Number(item.carbonEmission).toFixed(2)}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => navigate(`/logactivity/${item.id}`)}
                              className="p-2 text-slate-400 hover:text-brand-400 hover:bg-brand-500/10 rounded-lg transition-colors border border-transparent hover:border-brand-500/20"
                              title="Edit Record"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => setItemToDelete(item)}
                              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                              title="Delete Record"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {/* Sticky Summary Footer */}
        {filteredAndSortedActivities.length > 0 && (
          <div className="p-5 border-t border-white/5 bg-slate-900/95 backdrop-blur-xl flex justify-between items-center relative z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.2)]">
            <div className="text-sm font-medium text-slate-400">
              Showing <strong className="text-white">{filteredAndSortedActivities.length}</strong> records
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-400">Total Filtered Emissions:</span>
              <div className="px-4 py-2 bg-brand-500/10 border border-brand-500/20 rounded-xl text-brand-400 font-extrabold text-lg flex items-center gap-2 shadow-inner">
                {totalEmissions.toFixed(2)} <span className="text-xs text-brand-500/60 uppercase">kg CO₂e</span>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Custom Delete Modal */}
      <AnimatePresence>
        {itemToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-white/10 p-6 rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500" />
              <button 
                onClick={() => setItemToDelete(null)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                disabled={isDeleting}
              >
                <X size={20} />
              </button>
              
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 border border-red-500/20">
                  <AlertCircle className="text-red-500" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Delete Record?</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    You are about to permanently delete the <strong className="text-slate-200">{itemToDelete.activity}</strong> record. This action cannot be undone and will affect your overall carbon score.
                  </p>
                </div>
              </div>

              <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Emission Value:</span>
                  <span className="text-brand-400 font-bold">{Number(itemToDelete.carbonEmission).toFixed(2)} kg</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-2">
                  <span className="text-slate-500">Date:</span>
                  <span className="text-slate-300 font-medium">{itemToDelete.date}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setItemToDelete(null)}
                  disabled={isDeleting}
                  className="flex-1 py-3 px-4 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-colors border border-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 py-3 px-4 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}

export default Activities;