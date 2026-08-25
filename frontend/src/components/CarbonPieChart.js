import React, { useEffect, useState } from "react";
import { fetchAuth } from "../api";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";

const COLORS = [
  "#22c274", // brand
  "#0d9488", // accent teal
  "#f59e0b", // amber
  "#0284c7", // sky
  "#8b5cf6", // violet
  "#dc2626", // red (kept last, rarely reached)
  "#16a35e"
];

export default function CarbonPieChart() {

  const [data, setData] = useState([]);

  useEffect(() => {
    fetchAuth("/activity/breakdown")
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(result => {
        console.log("Breakdown API:", result);

        if (Array.isArray(result)) {
          setData(result);
        } else {
          console.error("Expected array from breakdown API but got:", result);
          setData([]);
        }
      })
      .catch(err => {
        console.error("Error fetching carbon breakdown:", err);
        setData([]);
      });
  }, []);

  return (

    <ResponsiveContainer width="100%" height={260}>
      <PieChart>

        <Pie
          data={data}
          dataKey="totalCo2e"
          nameKey="category"
          cx="50%"
          cy="50%"
          innerRadius={45}
          outerRadius={90}
          paddingAngle={3}
          stroke="#ffffff"
          strokeWidth={2}
        >

          {data.map((entry, index) => (

            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
            />

          ))}

        </Pie>

        <Tooltip
          contentStyle={{
            background: "#ffffff",
            border: "1px solid #e3e9e5",
            borderRadius: "12px",
            color: "#0f1a14",
            boxShadow: "0 4px 12px rgba(15,26,20,0.08)"
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: "12px", color: "#5c6f66" }}
        />

      </PieChart>

    </ResponsiveContainer>

  );

}
