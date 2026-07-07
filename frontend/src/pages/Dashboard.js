import CarbonChart from "../components/CarbonChart";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { isAuthenticated, fetchAuth } from "../api";

function Dashboard() {
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);

  // Login check
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch activities
  useEffect(() => {
    fetchAuth("/activity")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        if (Array.isArray(data)) {
          setActivities(data);
        } else {
          setActivities([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setActivities([]);
      });
  }, []);

  // Today's Date
  const today = new Date().toISOString().split("T")[0];

  const todaysActivities = activities.filter(
    (item) => item.date === today
  );

  const totalCarbonEmission = activities.reduce(
    (sum, item) => sum + Number(item.carbonEmission || 0),
    0
  );

  const todaysCarbonEmission = todaysActivities.reduce(
    (sum, item) => sum + Number(item.carbonEmission || 0),
    0
  );

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
          padding: "35px",
        }}
      >
        {/* Header */}

        <h1
          style={{
            fontSize: "40px",
            color: "#0F172A",
            marginBottom: "10px",
          }}
        >
          🌍 CarbonTrack Dashboard
        </h1>

        <p
          style={{
            color: "#64748B",
            fontSize: "18px",
            marginBottom: "35px",
          }}
        >
          👋 Welcome, User! 🌱 Let's build a greener future.
        </p>

        {/* Cards */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))",
            gap: "20px",
          }}
        >
          <div style={greenCard}>
            <h3 style={title}>🌍 Total Carbon Emission</h3>
            <h1 style={value}>{totalCarbonEmission.toFixed(2)} kg</h1>
            <p style={desc}>Total CO₂ Emission</p>
          </div>

          <div style={blueCard}>
            <h3 style={title}>📅 Today's Carbon</h3>
            <h1 style={value}>{todaysCarbonEmission.toFixed(2)} kg</h1>
            <p style={desc}>Today's CO₂</p>
          </div>

          <div style={orangeCard}>
            <h3 style={title}>🌿 Total Activities</h3>
            <h1 style={value}>{activities.length}</h1>
            <p style={desc}>Activities Recorded</p>
          </div>

          <div style={purpleCard}>
            <h3 style={title}>🏆 Eco Score</h3>
            <h1 style={value}>
              {Math.max(100 - totalCarbonEmission.toFixed(0), 0)}
            </h1>
            <p style={desc}>Green Score</p>
          </div>
        </div>

        {/* Chart */}

        <div
          style={{
            marginTop: "35px",
            background: "white",
            padding: "25px",
            borderRadius: "18px",
            boxShadow: "0 5px 20px rgba(0,0,0,.08)",
          }}
        >
          <h2>📈 Carbon Emission Overview</h2>

          <div
            style={{
              width: "100%",
              height: "320px",
            }}
          >
            <CarbonChart activities={activities} />
          </div>
          </div>

        {/* Recent Activities */}

        <div
          style={{
            marginTop: "35px",
            background: "#FFFFFF",
            color: "#000000",
            padding: "25px",
            borderRadius: "18px",
            boxShadow: "0 5px 20px rgba(0,0,0,.08)",
          }}
        >
          <h2
            style={{
              color: "#000000",
              marginBottom: "20px",
            }}
          >
            📋 Recent Activities
          </h2>

          <table
            style={{
              width: "100%",
              marginTop: "20px",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr style={{ background: "#E2E8F0" }}>
                <th style={tableHead}>Date</th>
                <th style={tableHead}>Category</th>
                <th style={tableHead}>Activity</th>
                <th style={tableHead}>Quantity</th>
                <th style={tableHead}>Unit</th>
                <th style={tableHead}>Carbon (kg CO₂)</th>
              </tr>
            </thead>

            <tbody>
              {activities.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "25px",
                    }}
                  >
                    No activities found.
                  </td>
                </tr>
              ) : (
                activities
                  .slice()
                  .reverse()
                  .slice(0, 5)
                  .map((item) => (
                    <tr key={item.id}>
                      <td style={tableCell}>{item.date}</td>
                      <td style={tableCell}>{item.category}</td>
                      <td style={tableCell}>{item.activity}</td>
                      <td style={tableCell}>{item.quantity}</td>
                      <td style={tableCell}>{item.unit}</td>

                      <td style={tableCell}>
                        {(item.carbonEmission || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>

        {/* Button */}

        <div style={{ marginTop: "30px" }}>
          <button
            onClick={() => navigate("/logactivity")}
            style={{
              background: "#22C55E",
              color: "white",
              border: "none",
              padding: "15px 30px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            ➕ Log New Activity
          </button>
        </div>
      </div>
    </div>
  );
}

/* Cards */

const greenCard = {
  background: "#DCFCE7",
  padding: "25px",
  borderRadius: "18px",
  boxShadow: "0 5px 15px rgba(0,0,0,.08)",
};

const blueCard = {
  background: "#DBEAFE",
  padding: "25px",
  borderRadius: "18px",
  boxShadow: "0 5px 15px rgba(0,0,0,.08)",
};

const orangeCard = {
  background: "#FFEDD5",
  padding: "25px",
  borderRadius: "18px",
  boxShadow: "0 5px 15px rgba(0,0,0,.08)",
};

const purpleCard = {
  background: "#F3E8FF",
  padding: "25px",
  borderRadius: "18px",
  boxShadow: "0 5px 15px rgba(0,0,0,.08)",
};

const title = {
  color: "#0F172A",
};

const value = {
  fontSize: "36px",
  color: "#111827",
};

const desc = {
  color: "#475569",
};

const tableHead = {
  padding: "15px",
  textAlign: "left",
  color: "#000000",
  fontWeight: "700",
  backgroundColor: "#E2E8F0",
};

const tableCell = {
  padding: "15px",
  borderBottom: "1px solid #E2E8F0",
  color: "#000000",
  backgroundColor: "#FFFFFF",
  fontWeight: "600",
  opacity: 1,
};

export default Dashboard;