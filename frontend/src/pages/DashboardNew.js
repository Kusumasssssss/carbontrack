import React, { useEffect, useState } from "react";
import { fetchAuth } from "../api";
import CarbonOverview from "../components/CarbonOverview";
import DashboardHeader from "../components/DashboardHeader";
import SummaryCards from "../components/SummaryCards";
import GoalProgressCard from "../components/GoalProgressCard";
import CarbonPieChart from "../components/CarbonPieChart";
import CarbonTrendChart from "../components/CarbonTrendChart";
function DashboardNew() {
const [activities, setActivities] = useState([]);
useEffect(() => {
    fetchAuth("/activity")
        .then((res) => res.json())
        .then((data) => {
            if (Array.isArray(data)) {
                setActivities(data);
            }
        })
        .catch((err) => console.error(err));
}, []);
const totalCarbon = activities.reduce(
    (sum, activity) => sum + Number(activity.carbonEmission || 0),
    0
);
  return (
    <div className="min-h-screen bg-[#07111d] text-white">

      {/* Header */}
      <DashboardHeader />

       <SummaryCards
           totalCarbon={totalCarbon}
           activities={activities}
       />

      {/* Dashboard */}
      <div className="px-10 pb-10 flex gap-6 items-start">


        {/* LEFT */}

        {/* LEFT */}

        <div className="flex-1 space-y-6">

            {/* Carbon Overview */}
            <CarbonOverview totalCarbon={totalCarbon} />

            {/* Bottom Charts */}
            <div className="grid grid-cols-2 gap-6 mt-6 items-stretch">

                {/* Weekly Trend */}
                <div className="rounded-3xl bg-[#111827] p-6 h-[360px] shadow-xl border border-slate-700">

                    <h2 className="text-xl font-semibold mb-4">
                        Weekly Trend
                    </h2>

                    <CarbonTrendChart />

                </div>

                {/* Carbon Breakdown */}
                <div className="rounded-3xl bg-[#111827] p-6 h-[360px] shadow-xl border border-slate-700">

                    <h2 className="text-xl font-semibold mb-4">
                        Carbon Breakdown
                    </h2>

                    <CarbonPieChart />

                </div>

            </div>

        </div>
        {/* RIGHT */}

        <div className="w-[360px] space-y-6">

          {/* Goal */}
          <GoalProgressCard />




          {/* Eco Tips */}

          <div className="rounded-3xl bg-[#111827] p-6">

            <h2 className="text-xl font-semibold">

              Eco Tips

            </h2>

            <p className="text-slate-400 mt-5">

              Walk instead of driving for short distances to reduce carbon emissions.

            </p>

          </div>

          {/* Recent Activities */}

          <div className="rounded-3xl bg-[#111827] p-6 shadow-xl border border-slate-700">

            <h2 className="text-xl font-semibold mb-6">

              Recent Activities

            </h2>

            <div className="space-y-3">

            {activities.length === 0 ? (

                <p className="text-slate-400">
                    No activities found.
                </p>

            ) : (

            activities.slice(0,5).map((item)=>(
            <div
            key={item.id}
            className="flex justify-between items-center bg-[#1b2435] rounded-xl p-4 hover:bg-[#243041] transition-all duration-300"
            >

            <div>

            <h3 className="font-semibold text-white">
            {item.activity}
            </h3>

            <p className="text-sm text-slate-400">
            {item.category}
            </p>

            </div>

            <div className="text-right">

            <p className="text-green-400 font-bold">
            {item.carbonEmission} kg
            </p>

            <p className="text-xs text-slate-500">
            {item.date}
            </p>

            </div>

            </div>

            ))

            )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardNew;