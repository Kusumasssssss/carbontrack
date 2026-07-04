import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function CarbonChart({ activities }) {

  const chartData = [];

  activities.forEach((item) => {

    const existing = chartData.find(
      (data) => data.category === item.category
    );

    if (existing) {
      existing.carbonEmission += Number(item.carbonEmission || 0);
    } else {
      chartData.push({
        category: item.category,
        carbonEmission: Number(item.carbonEmission || 0),
      });
    }

  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="category" />

        <YAxis />

        <Tooltip />

        <Bar
          dataKey="carbonEmission"
          fill="#22C55E"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default CarbonChart;