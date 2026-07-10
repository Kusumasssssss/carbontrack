import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Save, FileEdit, Database, ArrowLeft } from "lucide-react";
import BlurText from "../components/BlurText";
import { fetchAuth } from "../api";

function LogActivity() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category: "",
    activity: "",
    quantity: "",
    unit: "",
    date: "",
  });

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
        })
        .catch((err) => console.log(err));
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
        throw new Error("Failed");
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
    <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <button 
              onClick={() => navigate("/activities")}
              className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft size={16} /> Back to Activities
            </button>
            <div className="flex items-center gap-2 text-brand-400 mb-2">
              <Database size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Data Repository</span>
            </div>
            <BlurText 
              text={id ? "Edit Record" : "New Entry"}
              delay={40}
              className="text-4xl font-extrabold text-white tracking-tight mb-2"
            />
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-slate-400 font-medium"
            >
              {id ? "Update the details of this logged activity." : "Record a new activity to calculate organizational carbon footprint."}
            </motion.p>
          </div>

          <motion.form
            variants={formVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleSubmit}
            className="glass-panel p-8"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wide">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all appearance-none"
                  required
                >
                  <option value="" className="bg-slate-900 text-slate-500">Select Category</option>
                  <option value="Transportation" className="bg-slate-900">Transportation</option>
                  <option value="Electricity" className="bg-slate-900">Electricity</option>
                  <option value="Food" className="bg-slate-900">Food</option>
                  <option value="Waste" className="bg-slate-900">Waste</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wide">Activity Description</label>
                <input
                  type="text"
                  name="activity"
                  value={formData.activity}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all placeholder-slate-600"
                  placeholder="e.g., Q3 Employee Flight Travel (NY to LDN)"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wide">Quantity</label>
                  <input
                    type="number"
                    step="0.01"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all placeholder-slate-600"
                    placeholder="e.g., 1500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wide">Unit of Measurement</label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all appearance-none"
                    required
                  >
                    <option value="" className="bg-slate-900 text-slate-500">Select Unit</option>
                    <option value="km" className="bg-slate-900">Kilometers (km)</option>
                    <option value="kWh" className="bg-slate-900">Kilowatt-hours (kWh)</option>
                    <option value="kg" className="bg-slate-900">Kilograms (kg)</option>
                    <option value="litres" className="bg-slate-900">Litres</option>
                  </select>
                </div>
              </div>

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
    </div>
  );
}

export default LogActivity;