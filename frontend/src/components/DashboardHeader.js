import { CalendarDays, Bell } from "lucide-react";

export default function DashboardHeader() {
  return (
    <div className="flex justify-between items-center mb-8">

      <div>
        <p className="uppercase tracking-[5px] text-emerald-400 text-sm font-bold">
          Carbon Intelligence
        </p>

        <h1 className="text-5xl font-bold text-white mt-2">
          Welcome Back 👋
        </h1>

        <p className="text-slate-400 mt-3 text-lg">
          Monitor emissions, sustainability goals and carbon insights.
        </p>
      </div>

      <div className="flex gap-4">

        <button className="bg-slate-800 px-5 py-3 rounded-xl flex items-center gap-2 border border-slate-700">
          <CalendarDays size={18}/>
          Last 30 Days
        </button>

        <button className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex justify-center items-center">
          <Bell size={18}/>
        </button>

      </div>

    </div>
  );
}