import React from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "../api";

function Dashboard() {

  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f7fa",
        padding: "30px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ color: "#2E8B57" }}>
            🌍 CarbonTrack Dashboard
          </h1>

          <p>Welcome back! 🌱</p>
        </div>

        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          style={{
            background: "#dc3545",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      <br />

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div style={card}>
          <h3>🌿 Total CO₂</h3>
          <h2>0 kg</h2>
        </div>

        <div style={card}>
          <h3>📅 Today's CO₂</h3>
          <h2>0 kg</h2>
        </div>

        <div style={card}>
          <h3>🎯 Goal</h3>
          <h2>Not Set</h2>
        </div>

        <div style={card}>
          <h3>🏆 Badges</h3>
          <h2>0</h2>
        </div>
      </div>

      <br />

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2>📋 Recent Activities</h2>

        <p>No activities found.</p>
      </div>

      <br />

      <button
        style={{
          background: "#2E8B57",
          color: "white",
          border: "none",
          padding: "15px 30px",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        ➕ Log New Activity
      </button>

    </div>
  );
}

const card = {
  background: "white",
  width: "220px",
  padding: "20px",
  borderRadius: "12px",
  textAlign: "center",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
};

export default Dashboard;