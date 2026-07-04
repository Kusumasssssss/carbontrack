import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

function LogActivity() {
  const [formData, setFormData] = useState({
    category: "",
    activity: "",
    quantity: "",
    unit: "",
    date: "",
  });

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

      const response = await fetch("http://localhost:8080/api/activity", {
        method: "POST",
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

      console.log("Status:", response.status);

      const responseText = await response.text();
      console.log("Response:", responseText);

      if (!response.ok) {
        alert(`Error ${response.status}\n\n${responseText}`);
        return;
      }

      alert("✅ Activity saved successfully!");

      setFormData({
        category: "",
        activity: "",
        quantity: "",
        unit: "",
        date: "",
      });

    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        background: "#F1F5F9",
        minHeight: "100vh",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          marginLeft: "270px",
          padding: "40px",
        }}
      >
        <h1
          style={{
            color: "#0F172A",
            fontSize: "36px",
            marginBottom: "10px",
          }}
        >
          ➕ Log Activity
        </h1>

        <p
          style={{
            color: "#64748B",
            marginBottom: "30px",
          }}
        >
          Record your daily activities to calculate your carbon footprint.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            background: "white",
            padding: "35px",
            borderRadius: "18px",
            boxShadow: "0 5px 15px rgba(0,0,0,.08)",
            maxWidth: "700px",
          }}
        >
          <label>Category</label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            style={inputStyle}
            required
          >
            <option value="">Select Category</option>
            <option value="Transportation">Transportation</option>
            <option value="Electricity">Electricity</option>
            <option value="Food">Food</option>
            <option value="Waste">Waste</option>
          </select>

          <label>Activity</label>

          <input
            type="text"
            name="activity"
            placeholder="Example: Car Travel"
            value={formData.activity}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <label>Quantity</label>

          <input
            type="number"
            name="quantity"
            placeholder="Enter Quantity"
            value={formData.quantity}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <label>Unit</label>

          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            style={inputStyle}
            required
          >
            <option value="">Select Unit</option>
            <option value="km">km</option>
            <option value="kWh">kWh</option>
            <option value="kg">kg</option>
            <option value="litres">litres</option>
          </select>

          <label>Date</label>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <button
            type="submit"
            style={{
              width: "100%",
              marginTop: "25px",
              background: "#22C55E",
              color: "white",
              border: "none",
              padding: "16px",
              borderRadius: "12px",
              fontSize: "18px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            💾 Save Activity
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "8px",
  marginBottom: "20px",
  borderRadius: "10px",
  border: "1px solid #CBD5E1",
  fontSize: "16px",
  boxSizing: "border-box",
};

export default LogActivity;