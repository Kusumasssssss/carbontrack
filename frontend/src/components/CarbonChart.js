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
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="4 4"
          stroke="#334155"
        />

        <XAxis
          dataKey="date"
          stroke="#94a3b8"
        />

        <YAxis
          stroke="#94a3b8"
        />

        <Tooltip
          contentStyle={{
            background:"#111827",
            border:"1px solid #374151",
            borderRadius:"12px"
          }}
        />

        <Area
          type="monotone"
          dataKey="emission"
          stroke="#22c55e"
          strokeWidth={4}
          fill="url(#colorEmission)"
        />

      </AreaChart>
    </ResponsiveContainer>
  );
}