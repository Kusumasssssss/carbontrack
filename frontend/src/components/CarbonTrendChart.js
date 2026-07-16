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
          stroke="#1e293b"
          strokeDasharray="4 4"
        />

        <XAxis
          dataKey="day"
          stroke="#94a3b8"
        />

        <Tooltip
          contentStyle={{
            background: "#0f172a",
            border: "1px solid #334155",
            borderRadius: "12px",
            color: "#fff"
          }}
        />

        <Line
          type="monotone"
          dataKey="carbon"
          stroke="#22c55e"
          strokeWidth={4}
          dot={{
            fill: "#22c55e",
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