import { CalendarDays, Bell } from "lucide-react";

export default function DashboardHeader() {
  return (
    <div className="flex justify-between items-center mb-8 px-10 pt-8">

      <div>
        <p className="uppercase tracking-[5px] text-brand-600 text-sm font-bold">
          Carbon Intelligence
        </p>

        <h1 className="text-5xl font-bold text-ink-900 mt-2">
          Welcome Back 👋
        </h1>

        <p className="text-ink-500 mt-3 text-lg">
          Monitor emissions, sustainability goals and carbon insights.
        </p>
      </div>

      <div className="flex gap-4">

        <button className="bg-surface-card px-5 py-3 rounded-xl flex items-center gap-2 border border-surface-border text-ink-700 shadow-card hover:shadow-card-hover transition-shadow">
          <CalendarDays size={18}/>
          Last 30 Days
        </button>

        <button className="w-12 h-12 rounded-xl bg-surface-card border border-surface-border flex justify-center items-center text-ink-700 shadow-card hover:shadow-card-hover transition-shadow">
          <Bell size={18}/>
        </button>

      </div>

    </div>
  );
}
