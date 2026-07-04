import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

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
          {id ? "✏️ Edit Activity" : "➕ Log Activity"}
        </h1>

        <p
          style={{
            color: "#64748B",
            marginBottom: "30px",
            fontSize: "18px",
          }}
        >
          Record your daily activities to calculate your carbon footprint.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            background: "#FFFFFF",
            padding: "35px",
            borderRadius: "18px",
            boxShadow: "0 5px 15px rgba(0,0,0,.08)",
            maxWidth: "700px",
          }}
        >
          <label style={labelStyle}>Category</label>

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

          <label style={labelStyle}>Activity</label>

          <input
            type="text"
            name="activity"
            value={formData.activity}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <label style={labelStyle}>Quantity</label>

          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <label style={labelStyle}>Unit</label>

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

          <label style={labelStyle}>Date</label>

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
              color: "#FFFFFF",
              border: "none",
              padding: "16px",
              borderRadius: "12px",
              fontSize: "18px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {id ? "✏️ Update Activity" : "💾 Save Activity"}
          </button>
        </form>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  color: "#0F172A",
  fontWeight: "600",
  fontSize: "16px",
};

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "8px",
  marginBottom: "20px",
  borderRadius: "10px",
  border: "1px solid #CBD5E1",
  fontSize: "16px",
  color: "#0F172A",
  background: "#FFFFFF",
  boxSizing: "border-box",
};

export default LogActivity;