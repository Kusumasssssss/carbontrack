import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Save, FileEdit, Database, ArrowLeft, Car, Zap, Utensils, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import BlurText from "../components/BlurText";
import { fetchAuth } from "../api";
import LottieAnimation from "../components/LottieAnimation";

const CATEGORY_LOTTIE = {
  Transportation: "https://assets9.lottiefiles.com/packages/lf20_hg7zdf8w.json",
  Electricity: "https://assets7.lottiefiles.com/packages/lf20_m6cu980y.json",
  Food: "https://assets8.lottiefiles.com/packages/lf20_ygiq7r3q.json",
  Waste: "https://assets10.lottiefiles.com/packages/lf20_49rdyysj.json",
};

const CATEGORIES = [
  { key: "Transportation", icon: Car },
  { key: "Electricity", icon: Zap },
  { key: "Food", icon: Utensils },
  { key: "Waste", icon: Trash2 },
];

// ---- Fallback emission factors, used if GET /emission-factors fails or
// isn't built yet. "label" doubles as the free-text `activity` value your
// backend already expects, so no schema change is needed. ----
const FALLBACK_EMISSION_FACTORS = [
  { category: "Transportation", label: "Car Travel", unit: "km", kgCo2ePerUnit: 0.192 },
  { category: "Transportation", label: "Flight Travel", unit: "km", kgCo2ePerUnit: 0.255 },
  { category: "Transportation", label: "Public Transit", unit: "km", kgCo2ePerUnit: 0.089 },
  { category: "Electricity", label: "Grid Electricity", unit: "kWh", kgCo2ePerUnit: 0.475 },
  { category: "Electricity", label: "Renewable Electricity", unit: "kWh", kgCo2ePerUnit: 0.02 },
  { category: "Food", label: "Beef Meal", unit: "kg", kgCo2ePerUnit: 6.61 },
  { category: "Food", label: "Chicken Meal", unit: "kg", kgCo2ePerUnit: 1.57 },
  { category: "Food", label: "Vegetarian Meal", unit: "kg", kgCo2ePerUnit: 0.79 },
  { category: "Waste", label: "Landfill Waste", unit: "kg", kgCo2ePerUnit: 0.58 },
  { category: "Waste", label: "Recycled Waste", unit: "kg", kgCo2ePerUnit: 0.02 },
];

const FALLBACK_QUICK_LOGS = [
  { category: "Transportation", label: "Car Travel", quantity: 10, sub: "10 km" },
  { category: "Electricity", label: "Grid Electricity", quantity: 5, sub: "5 kWh" },
  { category: "Food", label: "Vegetarian Meal", quantity: 1, sub: "1 kg" },
  { category: "Waste", label: "Landfill Waste", quantity: 2, sub: "2 kg" },
];

// fetchAuth() returns the raw Response and doesn't throw on non-2xx.
// This parses JSON and throws so callers can use try/catch normally.
const fetchJson = async (url, options) => {
  const response = await fetchAuth(url, options);
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error((data && data.message) || "Request failed");
  }
  return data;
};

function LogActivity() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category: "Transportation",
    activity: "",
    quantity: "",
    unit: "",
    date: "",
  });

  const [emissionFactors, setEmissionFactors] = useState(FALLBACK_EMISSION_FACTORS);
  const [quickLogs, setQuickLogs] = useState(FALLBACK_QUICK_LOGS);
  const [isEditingLoad, setIsEditingLoad] = useState(!!id);

  // Fetch real emission factors + frequent activities. Falls back silently
  // to the static tables above if either endpoint isn't ready yet.
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchJson("/emission-factors");
        if (Array.isArray(data) && data.length > 0) setEmissionFactors(data);
      } catch (_) {
        // keep fallback
      }
      try {
        const data = await fetchJson("/activities/frequent");
        if (Array.isArray(data) && data.length > 0) setQuickLogs(data);
      } catch (_) {
        // keep fallback
      }
    })();
  }, []);

  // Load activity when editing
  useEffect(() => {
    if (id) {
      fetchAuth(`/activity/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            category: data.category,
            activity: data.activity,
            quantity: data.quantity,
            unit: data.unit,
            date: data.date,
          });
          setIsEditingLoad(false);
        })
        .catch((err) => console.log(err));
    }
  }, [id]);

  const activityOptions = useMemo(
    () => emissionFactors.filter((f) => f.category === formData.category),
    [emissionFactors, formData.category]
  );

  // If the currently-set activity (e.g. loaded from an edit, or legacy
  // free text) isn't in the known list, keep it selectable anyway so the
  // dropdown doesn't silently blank it out.
  const dropdownOptions = useMemo(() => {
    if (!formData.activity || activityOptions.some((f) => f.label === formData.activity)) {
      return activityOptions;
    }
    return [{ category: formData.category, label: formData.activity, unit: formData.unit, kgCo2ePerUnit: null }, ...activityOptions];
  }, [activityOptions, formData.activity, formData.category, formData.unit]);

  const selectedFactor = useMemo(
    () => activityOptions.find((f) => f.label === formData.activity),
    [activityOptions, formData.activity]
  );

  // Real-time CO2e preview: emission factor x quantity, computed client-side.
  const previewKgCo2e = useMemo(() => {
    const qty = parseFloat(formData.quantity);
    if (!selectedFactor || !selectedFactor.kgCo2ePerUnit || isNaN(qty) || qty < 0) return null;
    return qty * selectedFactor.kgCo2ePerUnit;
  }, [formData.quantity, selectedFactor]);

  const selectCategory = (categoryKey) => {
    if (isEditingLoad) return; // don't clobber data still loading for edit mode
    if (categoryKey === formData.category) return;
    const firstOption = emissionFactors.find((f) => f.category === categoryKey);
    setFormData({
      ...formData,
      category: categoryKey,
      activity: firstOption ? firstOption.label : "",
      unit: firstOption ? firstOption.unit : "",
      quantity: "",
    });
  };

  const handleActivityChange = (e) => {
    const label = e.target.value;
    const factor = activityOptions.find((f) => f.label === label);
    setFormData({
      ...formData,
      activity: label,
      unit: factor ? factor.unit : formData.unit,
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const applyQuickLog = (preset) => {
    const factor = emissionFactors.find(
      (f) => f.category === preset.category && f.label === preset.label
    );
    setFormData({
      ...formData,
      category: preset.category,
      activity: preset.label,
      quantity: String(preset.quantity),
      unit: factor ? factor.unit : formData.unit,
    });
  };

  const scrollCarousel = (dir) => {
    const el = document.getElementById("quick-log-track");
    if (el) el.scrollBy({ left: dir * 220, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = id ? `/activity/${id}` : "/activity";
      const method = id ? "PUT" : "POST";

      const response = await fetchAuth(url, {
        method: method,
        body: JSON.stringify({
          category: formData.category,
          activity: formData.activity,
          quantity: Number(formData.quantity),
          unit: formData.unit,
          date: formData.date,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Status:", response.status);
        console.log("Error:", errorText);
        alert(errorText);
        return;
      }

      navigate("/activities");
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/activities")}
              className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft size={16} /> Back to Activities
            </button>
            <div className="flex items-center gap-2 text-brand-400 mb-2">
              <Database size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Data Repository</span>
            </div>
            <BlurText
              text={id ? "Edit Activity Record" : "Log Carbon Activity"}
              delay={40}
              className="text-4xl font-extrabold text-white tracking-tight mb-2"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-slate-400 font-medium"
            >
              {id ? "Update the details of this logged activity." : "Record a new activity to calculate your carbon footprint."}
            </motion.p>
          </div>

          {/* Quick-log carousel */}
          {!id && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Quick Log</h2>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => scrollCarousel(-1)}
                    className="p-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-400 hover:text-white transition-colors"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollCarousel(1)}
                    className="p-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-400 hover:text-white transition-colors"
                    aria-label="Scroll right"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
              <div
                id="quick-log-track"
                className="flex gap-3 overflow-x-auto pb-1 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: "none" }}
              >
                {quickLogs.map((preset, i) => {
                  const Icon = CATEGORIES.find((c) => c.key === preset.category)?.icon || Car;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => applyQuickLog(preset)}
                      className="snap-start shrink-0 w-40 text-left bg-slate-900/60 hover:bg-slate-800 border border-white/10 hover:border-brand-500/50 rounded-xl p-4 transition-all"
                    >
                      <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center mb-3">
                        <Icon size={16} className="text-brand-400" />
                      </div>
                      <p className="text-sm font-semibold text-white leading-snug">{preset.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{preset.sub}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <motion.form
              variants={formVariants}
              initial="hidden"
              animate="visible"
              onSubmit={handleSubmit}
              className="glass-panel p-8 md:col-span-2"
            >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wide">Category</label>
                <div className="flex bg-slate-900 border border-white/10 rounded-xl p-1 relative">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => selectCategory(c.key)}
                      className={`relative flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors z-10 ${
                        formData.category === c.key ? "text-slate-950" : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <c.icon size={15} />
                      <span className="hidden sm:inline">{c.key}</span>
                    </button>
                  ))}
                  <motion.div
                    className="absolute top-1 bottom-1 rounded-lg bg-brand-500"
                    style={{ width: `calc(${100 / CATEGORIES.length}% - 4px)` }}
                    animate={{
                      left: `calc(${(CATEGORIES.findIndex((c) => c.key === formData.category) * 100) / CATEGORIES.length}% + 2px)`,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wide">Activity Type</label>
                <select
                  name="activity"
                  value={formData.activity}
                  onChange={handleActivityChange}
                  className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all appearance-none"
                  required
                >
                  <option value="" className="bg-slate-900 text-slate-500">Select Activity</option>
                  {dropdownOptions.map((f) => (
                    <option key={f.label} value={f.label} className="bg-slate-900">
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wide">Quantity</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all placeholder-slate-600"
                    placeholder="e.g., 10"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wide">Unit</label>
                  <div className="w-full px-4 py-3 bg-slate-900/60 border border-white/10 rounded-xl text-slate-300">
                    {formData.unit || "—"}
                  </div>
                </div>
              </div>

              {/* Live CO2e preview */}
              <AnimatePresence>
                {previewKgCo2e !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-between"
                  >
                    <span className="text-sm text-slate-300">Estimated emission</span>
                    <span className="text-xl font-bold text-brand-400">
                      {previewKgCo2e.toFixed(2)} <span className="text-sm font-medium">kg CO₂e</span>
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wide">Date of Activity</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all"
                  required
                />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex gap-4">
              <button
                type="button"
                onClick={() => navigate("/activities")}
                className="flex-1 px-4 py-3 bg-slate-900 border border-white/10 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-2 w-full btn-primary flex justify-center items-center gap-2"
              >
                {id ? <FileEdit size={18} /> : <Save size={18} />}
                {id ? "Save Changes" : "Commit Record"}
              </button>
            </div>
          </motion.form>

          {/* Lottie Animation Side Panel */}
          <div className="hidden md:flex flex-col items-center justify-center bg-slate-900/60 border border-white/10 p-6 rounded-3xl backdrop-blur-xl">
            <div className="w-full aspect-square flex items-center justify-center">
              <LottieAnimation
                src={CATEGORY_LOTTIE[formData.category] || "https://assets2.lottiefiles.com/packages/lf20_5njp3vgg.json"}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <p className="text-xs text-center text-slate-400 font-medium mt-2">
              {formData.category ? `Category: ${formData.category}` : "Select a category to view animated impact"}
            </p>
          </div>
        </div>
    </div>
  );
}

export default LogActivity;
