import React from "react";
import { Calendar, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * RecentActivityCard
 * Compact list of the most recent activities, with a "View All" link.
 *
 * Props:
 *  - activities: array of { id, activity, category, date, carbonEmission }
 *  - limit: number of items to show (default 5)
 */
export default function RecentActivityCard({ activities = [], limit = 5 }) {
  const navigate = useNavigate();
  const items = activities.slice(0, limit);

  return (
    <div className="bg-surface-card border border-surface-border rounded-2xl p-6 shadow-card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-bold text-ink-900">Recent Activity</h3>
        <button
          onClick={() => navigate("/activities")}
          className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
        >
          View All →
        </button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-8">
          <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-3">
            <Leaf size={22} className="text-brand-500" />
          </div>
          <p className="text-sm text-ink-500">No activities logged yet.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-surface-panel rounded-xl p-3.5 border border-surface-border hover:bg-surface-muted transition-colors"
            >
              <div>
                <p className="text-sm font-semibold text-ink-900">{item.activity}</p>
                <p className="text-xs text-ink-500 mt-0.5">{item.category}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-brand-700">{Number(item.carbonEmission || 0).toFixed(2)} kg</p>
                <p className="text-xs text-ink-300 mt-0.5 flex items-center justify-end gap-1">
                  <Calendar size={10} /> {item.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
