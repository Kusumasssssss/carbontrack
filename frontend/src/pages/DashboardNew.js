import React, { useEffect, useState } from "react";
import { fetchAuth } from "../api";
import CarbonOverview from "../components/CarbonOverview";
import DashboardHeader from "../components/DashboardHeader";
import SummaryCards from "../components/SummaryCards";
import GoalProgressCard from "../components/GoalProgressCard";
import CarbonPieChart from "../components/CarbonPieChart";
import CarbonTrendChart from "../components/CarbonTrendChart";
import PeerBenchmarking from "../components/PeerBenchmarking";
import Chatbot from "../components/Chatbot";
function DashboardNew() {
const [activities, setActivities] = useState([]);
const [recommendations, setRecommendations] = useState(null);
const [loadingRecs, setLoadingRecs] = useState(true);

useEffect(() => {
    fetchAuth("/activity")
        .then((res) => res.json())
        .then((data) => {
            if (Array.isArray(data)) {
                setActivities(data);
            }
        })
        .catch((err) => console.error(err));

    // Fetch AI Recommendations
    fetchAuth("/recommendations")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.recommendations) {
          setRecommendations(data.recommendations);
        }
        setLoadingRecs(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingRecs(false);
      });
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

            {/* Peer Benchmarking & Standing */}
            <PeerBenchmarking />

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




          {/* AI Sustainability Coach */}
          <div className="rounded-3xl bg-gradient-to-br from-[#111827] to-[#1a2333] p-6 shadow-xl border border-indigo-500/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-indigo-500/10 opacity-50" />
            <div className="relative z-10">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-400">
                  <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                </svg>
                AI Insights
              </h2>
              <div className="text-slate-400 mt-5 text-sm space-y-3 whitespace-pre-wrap">
                {loadingRecs ? (
                  <div className="animate-pulse flex flex-col space-y-3">
                    <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-700 rounded w-5/6"></div>
                    <div className="h-4 bg-slate-700 rounded w-2/3"></div>
                  </div>
                ) : (
                  recommendations || "No recommendations available at the moment. Keep logging your activities to get personalized insights!"
                )}
              </div>
            </div>
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
      <Chatbot />
    </div>
  );
}

export default DashboardNew;