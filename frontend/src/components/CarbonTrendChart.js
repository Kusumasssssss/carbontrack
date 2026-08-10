import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

const data = [
  { day: "Mon", carbon: 2.1 },
  { day: "Tue", carbon: 3.8 },
  { day: "Wed", carbon: 2.7 },
  { day: "Thu", carbon: 4.2 },
  { day: "Fri", carbon: 3.5 },
  { day: "Sat", carbon: 2.8 },
  { day: "Sun", carbon: 1.9 }
];

export default function CarbonTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>

        <CartesianGrid
          stroke="#e3e9e5"
          strokeDasharray="4 4"
        />

        <XAxis
          dataKey="day"
          stroke="#94a49c"
          tick={{ fill: "#5c6f66", fontSize: 12 }}
        />

        <Tooltip
          contentStyle={{
            background: "#ffffff",
            border: "1px solid #e3e9e5",
            borderRadius: "12px",
            color: "#0f1a14",
            boxShadow: "0 4px 12px rgba(15,26,20,0.08)"
          }}
        />

        <Line
          type="monotone"
          dataKey="carbon"
          stroke="#22c274"
          strokeWidth={4}
          dot={{
            fill: "#22c274",
            r: 5
          }}
          activeDot={{
            r: 8
          }}
        />

      </LineChart>
    </ResponsiveContainer>
  );
}
