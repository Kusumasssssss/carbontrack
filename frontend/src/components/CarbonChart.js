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
      existing.quantity += Number(item.quantity);
    } else {
      chartData.push({
        category: item.category,
        quantity: Number(item.quantity),
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
        <Bar dataKey="quantity" fill="#22C55E" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default CarbonChart;