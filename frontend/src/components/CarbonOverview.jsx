import React from "react";
import { TrendingDown, Leaf } from "lucide-react";
import CarbonTrendChart from "./CarbonTrendChart";

export default function CarbonOverview({ totalCarbon }) {
  return (
    <div className="rounded-[30px] bg-gradient-brand p-8 shadow-card-hover">

      {/* Top */}
      <div className="flex justify-between items-start">

        <div>

          <p className="text-white/80 text-lg">
            Carbon Overview
          </p>

          <h1 className="text-6xl font-bold text-white mt-4">
            {totalCarbon.toFixed(2)}
          </h1>

          <p className="text-white/80 mt-2">
            kg CO₂e
          </p>

        </div>

        <div className="bg-white/15 rounded-2xl p-4">

          <Leaf size={42} className="text-white"/>

        </div>

      </div>

      {/* Weekly Trend */}

      <div className="flex items-center gap-2 mt-6">

        <TrendingDown className="text-white"/>

        <span className="text-white font-semibold">
          18% Lower than last week
        </span>

      </div>

      {/* Chart */}

      <div className="mt-8 h-[220px] bg-white/10 rounded-2xl p-2">

        <CarbonTrendChart />

      </div>

    </div>
  );
}
