import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, Search, AlertCircle, Database,
  Edit2, Car, Zap, Utensils, ShoppingBag, Trash, ChevronDown, ChevronUp, X
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
        return { icon: <Car size={14} />, color: "text-sky-600 bg-sky-50 border-sky-200" };
      case "ELECTRICITY":
        return { icon: <Zap size={14} />, color: "text-amber-600 bg-amber-50 border-amber-200" };
      case "FOOD":
        return { icon: <Utensils size={14} />, color: "text-brand-700 bg-brand-50 border-brand-200" };
      case "SHOPPING":
        return { icon: <ShoppingBag size={14} />, color: "text-violet-600 bg-violet-50 border-violet-200" };
      case "WASTE":
        return { icon: <Trash size={14} />, color: "text-orange-600 bg-orange-50 border-orange-200" };
      default:
        return { icon: <AlertCircle size={14} />, color: "text-ink-500 bg-surface-panel border-surface-border" };
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
          <motion.div variants={itemVariants} className="flex items-center gap-2 text-brand-600 mb-2">
            <Database size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Data Repository</span>
          </motion.div>
          <BlurText text="Activity Ledger" delay={40} className="text-4xl font-extrabold text-ink-900 tracking-tight mb-2" />
          <motion.p variants={itemVariants} className="text-ink-500 font-medium">
            Manage, audit, and analyze your organizational carbon records.
          </motion.p>
        </div>
        <motion.div variants={itemVariants} className="flex gap-4">
          <button onClick={() => navigate("/logactivity")} className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-5 py-3 rounded-xl font-semibold transition-all shadow-[0_4px_16px_rgba(34,194,116,0.25)]">
            <Plus size={18} /><span>New Entry</span>
          </button>
        </motion.div>
      </div>

      {/* Main Panel */}
      <motion.div variants={itemVariants} className="bg-surface-card border border-surface-border rounded-2xl shadow-card overflow-hidden flex flex-col">

        {/* Toolbar */}
        <div className="p-5 border-b border-surface-border bg-surface-card flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
          <div className="relative w-full lg:w-96 group">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300 group-focus-within:text-brand-500 transition-colors" />
            <input
              type="text"
              placeholder="Search descriptions or categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface-panel border border-surface-border rounded-xl pl-10 pr-4 py-3 text-sm text-ink-900 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400/50 transition-all placeholder-ink-300"
            />
          </div>
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${activeCategory === cat ? 'bg-brand-50 text-brand-700 border-brand-200 shadow-sm' : 'bg-surface-panel text-ink-500 border-surface-border hover:bg-surface-muted'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto min-h-[400px] relative">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="sticky top-0 bg-surface-panel/95 backdrop-blur-md z-10 shadow-sm">
              <tr>
                <th
                  onClick={() => requestSort('date')}
                  className="py-5 px-6 font-semibold text-ink-500 text-xs uppercase tracking-wider cursor-pointer hover:text-ink-900 transition-colors group select-none"
                >
                  <div className="flex items-center gap-2">Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} className="text-brand-600"/> : <ChevronDown size={14} className="text-brand-600"/>)}</div>
                </th>
                <th className="py-5 px-6 font-semibold text-ink-500 text-xs uppercase tracking-wider">Category</th>
                <th className="py-5 px-6 font-semibold text-ink-500 text-xs uppercase tracking-wider">Description</th>
                <th className="py-5 px-6 font-semibold text-ink-500 text-xs uppercase tracking-wider">Quantity</th>
                <th
                  onClick={() => requestSort('emissions')}
                  className="py-5 px-6 font-semibold text-ink-500 text-xs uppercase tracking-wider cursor-pointer hover:text-ink-900 transition-colors group select-none"
                >
                  <div className="flex items-center gap-2">Emissions (kg CO₂e) {sortConfig.key === 'emissions' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} className="text-brand-600"/> : <ChevronDown size={14} className="text-brand-600"/>)}</div>
                </th>
                <th className="py-5 px-6 font-semibold text-ink-500 text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              <AnimatePresence initial={false}>
                {filteredAndSortedActivities.length === 0 ? (
                  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="empty">
                    <td colSpan="6" className="py-24 text-center">
                      <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                        <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mb-4 border border-brand-200">
                          <AlertCircle className="text-brand-500" size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-ink-900 mb-2">No records found</h3>
                        <p className="text-sm text-ink-500 mb-6 leading-relaxed">
                          We couldn't find any activities matching your current filters. Try adjusting your search or add a new entry.
                        </p>
                        <button onClick={() => navigate("/logactivity")} className="px-6 py-2.5 bg-brand-50 text-brand-700 border border-brand-200 rounded-xl text-sm font-bold hover:bg-brand-100 transition-colors">
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
                        exit={{ opacity: 0, x: -20, backgroundColor: "rgba(220, 38, 38, 0.06)" }}
                        key={item.id}
                        className="hover:bg-surface-panel transition-colors group"
                      >
                        <td className="py-4 px-6 text-sm text-ink-700 font-medium">{item.date}</td>
                        <td className="py-4 px-6">
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border ${catConfig.color}`}>
                            {catConfig.icon}
                            {item.category?.toUpperCase()}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-ink-900">{item.activity}</td>
                        <td className="py-4 px-6 text-sm text-ink-700">{item.quantity} <span className="text-ink-300 text-xs ml-1">{item.unit}</span></td>
                        <td className="py-4 px-6">
                          <div className="text-brand-700 font-bold text-base">{Number(item.carbonEmission).toFixed(2)}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => navigate(`/logactivity/${item.id}`)}
                              className="p-2 text-ink-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors border border-transparent hover:border-brand-200"
                              title="Edit Record"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => setItemToDelete(item)}
                              className="p-2 text-ink-500 hover:text-status-danger hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
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
          <div className="p-5 border-t border-surface-border bg-surface-card flex justify-between items-center relative z-20">
            <div className="text-sm font-medium text-ink-500">
              Showing <strong className="text-ink-900">{filteredAndSortedActivities.length}</strong> records
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-ink-500">Total Filtered Emissions:</span>
              <div className="px-4 py-2 bg-brand-50 border border-brand-200 rounded-xl text-brand-700 font-extrabold text-lg flex items-center gap-2">
                {totalEmissions.toFixed(2)} <span className="text-xs text-brand-500/70 uppercase">kg CO₂e</span>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Custom Delete Modal */}
      <AnimatePresence>
        {itemToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface-card border border-surface-border p-6 rounded-2xl shadow-card-hover max-w-md w-full relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500" />
              <button
                onClick={() => setItemToDelete(null)}
                className="absolute top-4 right-4 text-ink-300 hover:text-ink-900 transition-colors"
                disabled={isDeleting}
              >
                <X size={20} />
              </button>

              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 border border-red-200">
                  <AlertCircle className="text-status-danger" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-ink-900 mb-2">Delete Record?</h3>
                  <p className="text-sm text-ink-500 leading-relaxed">
                    You are about to permanently delete the <strong className="text-ink-700">{itemToDelete.activity}</strong> record. This action cannot be undone and will affect your overall carbon score.
                  </p>
                </div>
              </div>

              <div className="bg-surface-panel p-4 rounded-xl border border-surface-border mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-ink-300">Emission Value:</span>
                  <span className="text-brand-700 font-bold">{Number(itemToDelete.carbonEmission).toFixed(2)} kg</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-2">
                  <span className="text-ink-300">Date:</span>
                  <span className="text-ink-700 font-medium">{itemToDelete.date}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setItemToDelete(null)}
                  disabled={isDeleting}
                  className="flex-1 py-3 px-4 bg-surface-panel text-ink-900 rounded-xl font-semibold hover:bg-surface-muted transition-colors border border-surface-border"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 py-3 px-4 bg-status-danger text-white rounded-xl font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
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
