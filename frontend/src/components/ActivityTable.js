import React, { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, AlertCircle } from "lucide-react";

/**
 * ActivityTable
 * Reusable sortable table of activity records. Lighter-weight than the
 * full Activities page — no search/filter/delete, just a clean data table
 * for embedding in dashboards, reports, or modals.
 *
 * Props:
 *  - activities: array of { id, date, category, activity, quantity, unit, carbonEmission }
 */
export default function ActivityTable({ activities = [] }) {
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });

  const requestSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sorted = useMemo(() => {
    const copy = [...activities];
    copy.sort((a, b) => {
      if (sortConfig.key === "date") {
        return sortConfig.direction === "asc"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      }
      if (sortConfig.key === "emissions") {
        return sortConfig.direction === "asc"
          ? (a.carbonEmission || 0) - (b.carbonEmission || 0)
          : (b.carbonEmission || 0) - (a.carbonEmission || 0);
      }
      return 0;
    });
    return copy;
  }, [activities, sortConfig]);

  const SortIcon = ({ column }) =>
    sortConfig.key === column ? (
      sortConfig.direction === "asc" ? <ChevronUp size={13} className="text-brand-600" /> : <ChevronDown size={13} className="text-brand-600" />
    ) : null;

  return (
    <div className="bg-surface-card border border-surface-border rounded-2xl shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead className="bg-surface-panel">
            <tr>
              <th onClick={() => requestSort("date")} className="py-3.5 px-5 text-xs font-semibold text-ink-500 uppercase tracking-wider cursor-pointer hover:text-ink-900 transition-colors select-none">
                <div className="flex items-center gap-1.5">Date <SortIcon column="date" /></div>
              </th>
              <th className="py-3.5 px-5 text-xs font-semibold text-ink-500 uppercase tracking-wider">Category</th>
              <th className="py-3.5 px-5 text-xs font-semibold text-ink-500 uppercase tracking-wider">Activity</th>
              <th className="py-3.5 px-5 text-xs font-semibold text-ink-500 uppercase tracking-wider">Quantity</th>
              <th onClick={() => requestSort("emissions")} className="py-3.5 px-5 text-xs font-semibold text-ink-500 uppercase tracking-wider cursor-pointer hover:text-ink-900 transition-colors select-none">
                <div className="flex items-center gap-1.5">Emissions <SortIcon column="emissions" /></div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <AlertCircle size={24} className="text-ink-300" />
                    <p className="text-sm text-ink-300">No activity records to show.</p>
                  </div>
                </td>
              </tr>
            ) : (
              sorted.map((item) => (
                <tr key={item.id} className="hover:bg-surface-panel transition-colors">
                  <td className="py-3 px-5 text-sm text-ink-700">{item.date}</td>
                  <td className="py-3 px-5">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-brand-50 text-brand-700 border border-brand-200">
                      {item.category?.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-sm text-ink-900">{item.activity}</td>
                  <td className="py-3 px-5 text-sm text-ink-700">{item.quantity} <span className="text-ink-300 text-xs">{item.unit}</span></td>
                  <td className="py-3 px-5 text-sm font-bold text-brand-700">{Number(item.carbonEmission || 0).toFixed(2)} kg</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
