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
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#14b8a6"
];

export default function CarbonPieChart() {

  const [data, setData] = useState([]);

  useEffect(() => {

    fetchAuth("/activity/breakdown")
      .then(res => res.json())
      .then(result => {
        setData(result);
      })
      .catch(err => console.error(err));

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
        >

          {data.map((entry, index) => (

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

  );

}