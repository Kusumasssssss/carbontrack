import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

export default function CarbonChart({ activities }) {

  const chartData = activities.map((item) => ({
    date: item.date,
    emission: Number(item.carbonEmission || 0),
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={chartData}>

        <defs>
          <linearGradient id="colorEmission" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c274" stopOpacity={0.7}/>
            <stop offset="95%" stopColor="#22c274" stopOpacity={0}/>
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="4 4"
          stroke="#e3e9e5"
        />

        <XAxis
          dataKey="date"
          stroke="#94a49c"
          tick={{ fill: "#5c6f66", fontSize: 12 }}
        />

        <YAxis
          stroke="#94a49c"
          tick={{ fill: "#5c6f66", fontSize: 12 }}
        />

        <Tooltip
          contentStyle={{
            background:"#ffffff",
            border:"1px solid #e3e9e5",
            borderRadius:"12px",
            color: "#0f1a14",
            boxShadow: "0 4px 12px rgba(15,26,20,0.08)"
          }}
        />

        <Area
          type="monotone"
          dataKey="emission"
          stroke="#22c274"
          strokeWidth={4}
          fill="url(#colorEmission)"
        />

      </AreaChart>
    </ResponsiveContainer>
  );
}
