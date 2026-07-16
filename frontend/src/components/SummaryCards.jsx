import React from "react";
import {
  Leaf,
  Activity,
  Target,
  Award
} from "lucide-react";

export default function SummaryCards({ totalCarbon, activities }) {

  return (

    <div className="px-10 mb-8">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Total Carbon */}

        <div className="rounded-3xl bg-gradient-to-br from-green-600 to-emerald-800 p-6 shadow-xl hover:scale-105 transition duration-300">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-green-100">
                Total Carbon
              </p>

              <h2 className="text-5xl font-bold text-white mt-3">
                {totalCarbon.toFixed(2)}
              </h2>

              <p className="text-green-100 mt-2">
                kg CO₂e
              </p>

            </div>

            <Leaf size={45} className="text-white opacity-80"/>

          </div>

        </div>

        {/* Activities */}

        <div className="rounded-3xl bg-[#111827] p-6 shadow-xl hover:scale-105 transition duration-300 border border-slate-700">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-slate-400">
                Activities
              </p>

              <h2 className="text-5xl font-bold text-white mt-3">
                {activities.length}
              </h2>

              <p className="text-slate-400 mt-2">
                Logged
              </p>

            </div>

            <Activity size={45} className="text-blue-400"/>

          </div>

        </div>

        {/* Eco Score */}

        <div className="rounded-3xl bg-[#111827] p-6 shadow-xl hover:scale-105 transition duration-300 border border-slate-700">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-slate-400">
                Eco Score
              </p>

              <h2 className="text-5xl font-bold text-white mt-3">
                94
              </h2>

              <p className="text-green-400 mt-2">
                Excellent
              </p>

            </div>

            <Award size={45} className="text-yellow-400"/>

          </div>

        </div>

        {/* Goal */}

        <div className="rounded-3xl bg-[#111827] p-6 shadow-xl hover:scale-105 transition duration-300 border border-slate-700">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-slate-400">
                Goal Progress
              </p>

              <h2 className="text-5xl font-bold text-white mt-3">
                60%
              </h2>

              <p className="text-green-400 mt-2">
                On Track
              </p>

            </div>

            <Target size={45} className="text-green-400"/>

          </div>

        </div>

      </div>

    </div>

  );

}