import React from "react";
import { TrendingDown, Leaf } from "lucide-react";
import CarbonTrendChart from "./CarbonTrendChart";

export default function CarbonOverview({ totalCarbon }) {
  return (
    <div className="rounded-[30px] bg-gradient-to-br from-[#14532d] via-[#0f3d2e] to-[#07111d] p-8 shadow-2xl border border-green-800">

      {/* Top */}
      <div className="flex justify-between items-start">

        <div>

          <p className="text-green-200 text-lg">
            Carbon Overview
          </p>

          <h1 className="text-6xl font-bold text-white mt-4">
            {totalCarbon.toFixed(2)}
          </h1>

          <p className="text-green-300 mt-2">
            kg CO₂e
          </p>

        </div>

        <div className="bg-green-500/20 rounded-2xl p-4">

          <Leaf size={42} className="text-green-300"/>

        </div>

      </div>

      {/* Weekly Trend */}

      <div className="flex items-center gap-2 mt-6">

        <TrendingDown className="text-green-400"/>

        <span className="text-green-400 font-semibold">
          18% Lower than last week
        </span>

      </div>

      {/* Chart */}

      <div className="mt-8 h-[220px]">

        <CarbonTrendChart />

      </div>

    </div>
  );
}