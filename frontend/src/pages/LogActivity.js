import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";
import BlurText from "../components/BlurText";

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
      fetch(`http://localhost:8080/api/activity/${id}`)
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
      const token = localStorage.getItem("token");

      const url = id
        ? `http://localhost:8080/api/activity/${id}`
        : "http://localhost:8080/api/activity";

      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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

      alert(
        id
          ? "✅ Activity updated successfully!"
          : "✅ Activity saved successfully!"
      );

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
    <div className="flex bg-slate-900 min-h-screen text-slate-50 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/4 w-[120%] h-[400px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>
      
      <Sidebar />

      <div className="flex-1 ml-[270px] p-8 lg:p-10 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <BlurText 
              text={id ? "✏️ Edit Activity" : "➕ Log Activity"}
              delay={50}
              className="text-4xl font-extrabold text-white tracking-tight mb-2"
            />
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-slate-400 font-medium"
            >
              Record your daily activities to calculate your carbon footprint.
            </motion.p>
          </div>

          <motion.form
            variants={formVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleSubmit}
            className="bg-slate-800/40 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-slate-700/50"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  required
                >
                  <option value="" className="bg-slate-800 text-slate-400">Select Category</option>
                  <option value="Transportation" className="bg-slate-800">Transportation</option>
                  <option value="Electricity" className="bg-slate-800">Electricity</option>
                  <option value="Food" className="bg-slate-800">Food</option>
                  <option value="Waste" className="bg-slate-800">Waste</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Activity</label>
                <input
                  type="text"
                  name="activity"
                  value={formData.activity}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder-slate-500"
                  placeholder="e.g., Driving to work"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder-slate-500"
                    placeholder="e.g., 15"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Unit</label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                    required
                  >
                    <option value="" className="bg-slate-800 text-slate-400">Select Unit</option>
                    <option value="km" className="bg-slate-800">km</option>
                    <option value="kWh" className="bg-slate-800">kWh</option>
                    <option value="kg" className="bg-slate-800">kg</option>
                    <option value="litres" className="bg-slate-800">litres</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  required
                />
              </div>
            </div>

            <motion.button
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full mt-8 bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-emerald-500/20"
            >
              {id ? "✏️ Update Activity" : "💾 Save Activity"}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}

export default LogActivity;