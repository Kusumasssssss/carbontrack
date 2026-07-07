import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { fetchAuth } from "../api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
function Analytics() {

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchAuth("/activity")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setActivities(data);
        }
      })
      .catch(console.error);
  }, []);

  const totalCarbon = activities.reduce(
    (sum, item) => sum + Number(item.carbonEmission || 0),
    0
  );

  const categories = {};

  activities.forEach((item) => {
    if (!categories[item.category]) {
      categories[item.category] = 0;
    }

    categories[item.category] += Number(item.carbonEmission || 0);
  });

  const chartData = Object.keys(categories).map((key) => ({
    name: key,
    value: categories[key],
  }));

  const highest =
    chartData.length > 0
      ? chartData.reduce((a, b) => (a.value > b.value ? a : b))
      : { name: "-", value: 0 };

  const COLORS = [
    "#22C55E",
    "#3B82F6",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
  ];

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
        <h1 style={{ color: "#0F172A" }}>
          📊 Carbon Analytics
        </h1>

        <p style={{ color: "#64748B" }}>
          Analyze your carbon footprint.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          <div style={card}>
            <h3 style={cardTitle}>🌍 Total Carbon</h3>
            <h1 style={cardValue}>{totalCarbon.toFixed(2)} kg</h1>
          </div>

          <div style={card}>
            <h3 style={cardTitle}>📋 Total Activities</h3>
            <h1 style={cardValue}>{activities.length}</h1>
          </div>

          <div style={card}>
            <h3 style={cardTitle}>🏆 Highest Category</h3>
            <h2 style={cardValue}>{highest.name}</h2>
          </div>

          <div style={card}>
            <h3 style={cardTitle}>📊 Average Emission</h3>
            <h2 style={cardValue}>
              {activities.length
                ? (totalCarbon / activities.length).toFixed(2)
                : "0.00"}{" "}
              kg
            </h2>
          </div>
        </div>

        <div
          style={{
            marginTop: "35px",
            background: "white",
            borderRadius: "15px",
            padding: "25px",
            height: "420px",
          }}
        >
          <h2>🥧 Carbon Emission by Category</h2>

          <ResponsiveContainer width="100%" height={330}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div
          style={{
            marginTop: "30px",
            background: "#FFFFFF",
            borderRadius: "15px",
            padding: "25px",
            boxShadow: "0 5px 15px rgba(0,0,0,.08)",
          }}
        >
          <h2 style={{ color: "#0F172A" }}>
            📊 Carbon Emission Comparison
          </h2>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="value"
                fill="#22C55E"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div
          style={{
            marginTop: "30px",
            background: "white",
            padding: "25px",
            borderRadius: "15px",
          }}
        >
          <h2>🌱 Carbon Reduction Tips</h2>

          <ul
            style={{
              lineHeight: "35px",
              fontSize: "18px",
            }}
          >
            <li>🚲 Use bicycles for short distances.</li>
            <li>🚆 Prefer public transportation.</li>
            <li>💡 Switch off unused electrical appliances.</li>
            <li>🌳 Plant more trees.</li>
            <li>🥗 Reduce food waste.</li>
          </ul>
        </div>

      </div>
    </div>
  );
}

const card = {
  background: "#FFFFFF",
  padding: "25px",
  borderRadius: "15px",
  boxShadow: "0 5px 15px rgba(0,0,0,.08)",
  color: "#0F172A",
};
const cardTitle = {
  color: "#64748B",
  fontSize: "18px",
  fontWeight: "600",
  marginBottom: "15px",
};

const cardValue = {
  color: "#0F172A",
  fontSize: "36px",
  fontWeight: "bold",
  margin: 0,
};

export default Analytics;