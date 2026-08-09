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
import { Sparkles } from "lucide-react";

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
    <div className="min-h-screen bg-[#F7F9FC] text-[#111827] font-sans">
      {/* Header */}
      <DashboardHeader />

      <SummaryCards totalCarbon={totalCarbon} activities={activities} />

      {/* Dashboard */}
      <div className="px-6 sm:px-10 pb-10 flex flex-col lg:flex-row gap-6 items-start">
        {/* LEFT */}
        <div className="flex-1 w-full space-y-6">
          {/* Carbon Overview */}
          <CarbonOverview totalCarbon={totalCarbon} />

          {/* Peer Benchmarking & Standing */}
          <PeerBenchmarking />

          {/* Bottom Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 items-stretch">
            {/* Weekly Trend */}
            <div className="rounded-2xl bg-white p-6 h-[360px] shadow-[0_1px_2px_rgba(17,24,39,0.04)] hover:shadow-[0_4px_16px_rgba(17,24,39,0.06)] transition-shadow duration-300 border border-[#E5E7EB]">
              <h2 className="text-[15px] font-bold text-[#111827] mb-4">Weekly Trend</h2>
              <CarbonTrendChart />
            </div>

            {/* Carbon Breakdown */}
            <div className="rounded-2xl bg-white p-6 h-[360px] shadow-[0_1px_2px_rgba(17,24,39,0.04)] hover:shadow-[0_4px_16px_rgba(17,24,39,0.06)] transition-shadow duration-300 border border-[#E5E7EB]">
              <h2 className="text-[15px] font-bold text-[#111827] mb-4">Carbon Breakdown</h2>
              <CarbonPieChart />
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full lg:w-[360px] space-y-6">
          {/* Goal */}
          <GoalProgressCard />

          {/* AI Sustainability Coach */}
          <div className="rounded-2xl bg-gradient-to-br from-[#111827] via-[#1F2937] to-[#111827] p-6 shadow-[0_8px_30px_rgba(17,24,39,0.25)] relative overflow-hidden group">
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[#22C55E]/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-[#2563EB]/20 blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-[15px] font-bold flex items-center gap-2 text-white">
                <Sparkles className="w-4 h-4 text-[#4ADE80]" strokeWidth={2.2} />
                AI Insights
              </h2>
              <div className="text-white/70 mt-5 text-[13px] leading-relaxed space-y-3 whitespace-pre-wrap">
                {loadingRecs ? (
                  <div className="animate-pulse flex flex-col space-y-3">
                    <div className="h-3.5 bg-white/10 rounded w-3/4"></div>
                    <div className="h-3.5 bg-white/10 rounded w-5/6"></div>
                    <div className="h-3.5 bg-white/10 rounded w-2/3"></div>
                  </div>
                ) : (
                  recommendations ||
                  "No recommendations available at the moment. Keep logging your activities to get personalized insights!"
                )}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="rounded-2xl bg-white p-6 shadow-[0_1px_2px_rgba(17,24,39,0.04)] border border-[#E5E7EB]">
            <h2 className="text-[15px] font-bold text-[#111827] mb-5">Recent Activities</h2>

            <div className="space-y-2.5">
              {activities.length === 0 ? (
                <p className="text-[13.5px] text-[#6B7280]">No activities found.</p>
              ) : (
                activities.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center bg-[#F7F9FC] rounded-xl p-4 border border-transparent hover:border-[#E5E7EB] hover:bg-white hover:shadow-[0_2px_8px_rgba(17,24,39,0.06)] transition-all duration-200"
                  >
                    <div>
                      <h3 className="font-semibold text-[13.5px] text-[#111827]">
                        {item.activity}
                      </h3>
                      <p className="text-[12px] text-[#6B7280] mt-0.5">{item.category}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-[#22C55E] font-bold text-[13.5px]">
                        {item.carbonEmission} kg
                      </p>
                      <p className="text-[11px] text-[#9CA3AF] mt-0.5">{item.date}</p>
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
