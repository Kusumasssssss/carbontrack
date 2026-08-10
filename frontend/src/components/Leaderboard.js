import React, { useEffect, useState } from "react";
import { fetchAuth } from "../api";
import { Users, Trophy, TrendingDown, Award } from "lucide-react";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetchAuth("/benchmarks/leaderboard?limit=50");
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(Array.isArray(data) ? data : []);

        // Find current user's rank (if logged in, their username is stored)
        const username = localStorage.getItem('username');
        if (username) {
          const userEntry = data.find(entry => entry.username === username);
          if (userEntry) {
            setUserRank(data.indexOf(userEntry) + 1);
          }
        }
        setLoading(false);
      }
    } catch (err) {
      console.error("Error loading leaderboard:", err);
      setLoading(false);
    }
  };

  const getRankColor = (rank) => {
    if (rank === 1) return "text-amber-500";
    if (rank === 2) return "text-slate-400";
    if (rank === 3) return "text-orange-500";
    return "text-ink-900";
  };

  const getRankBadge = (rank) => {
    if (rank <= 3) {
      const bg = rank === 1 ? "bg-amber-50 border-amber-200" : rank === 2 ? "bg-surface-panel border-surface-border" : "bg-orange-50 border-orange-200";
      return (
        <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${bg}`}>
          <Trophy size={22} className={getRankColor(rank)} />
        </div>
      );
    }
    return <span className={`text-2xl font-black ${getRankColor(rank)}`}>#{rank}</span>;
  };

  if (loading) {
    return (
      <div className="bg-surface-card border border-surface-border rounded-2xl p-8 shadow-card animate-pulse">
        <div className="h-8 bg-surface-muted rounded w-1/4 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-surface-panel rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sky-600 mb-2">
          <Users size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">Community Rankings</span>
        </div>
        <h1 className="text-4xl font-extrabold text-ink-900 tracking-tight mb-2">
          Carbon Leaderboard 🏆
        </h1>
        <p className="text-ink-500 font-medium max-w-xl">
          See how you compare against the community. Lower footprint = higher rank.
        </p>
      </div>

      {/* User Rank Card */}
      {userRank && (
        <div className="mb-8">
          <div className="bg-gradient-to-r from-sky-50 to-brand-50 border border-sky-200 rounded-2xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-brand-500 flex items-center justify-center shadow-lg">
                <Trophy size={30} className="text-white" />
              </div>
              <div>
                <p className="text-ink-500 text-sm mb-1">Your Standing</p>
                <h2 className="text-4xl font-black text-ink-900">
                  Rank #{userRank}
                </h2>
                <p className="text-sky-600 text-sm font-semibold mt-1">
                  {userRank <= 3
                    ? "Top Tier Eco-Performer! 🌟"
                    : userRank <= 10
                      ? "Excellent! You're in the top 20% 🏆"
                      : "Great job! You're making a difference 🌱"}
                </p>
              </div>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-xs text-ink-300 uppercase tracking-wider mb-1">Total Community Members</p>
              <p className="text-3xl font-bold text-ink-900">{leaderboard.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard List */}
      <div className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden shadow-card">
        <div className="p-6 border-b border-surface-border bg-surface-panel">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-ink-900 flex items-center gap-2">
              <TrendingDown size={20} className="text-sky-600" />
              Top 50 Eco-Champions
            </h2>
            <span className="px-3 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-full text-xs font-bold">
              Sorted by CO₂e (Lowest First)
            </span>
          </div>

          <div className="grid grid-cols-12 text-xs font-semibold text-ink-300 uppercase tracking-wider mb-2">
            <div className="col-span-2 pl-4">Rank</div>
            <div className="col-span-4">User</div>
            <div className="col-span-3">Total CO₂e</div>
            <div className="col-span-3 text-right">Category Strengths</div>
          </div>
        </div>

        <div className="divide-y divide-surface-border max-h-[600px] overflow-y-auto custom-scrollbar">
          {leaderboard.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-panel flex items-center justify-center">
                <Users size={32} className="text-ink-300" />
              </div>
              <p className="text-ink-500">No users yet. Be the first to log an activity!</p>
            </div>
          ) : (
            leaderboard.map((entry, index) => {
              const rank = index + 1;
              return (
                <div
                  key={entry.userId}
                  className={`grid grid-cols-12 items-center p-4 hover:bg-surface-panel transition-colors ${
                    rank <= 3 ? "bg-gradient-to-r from-transparent via-brand-50/40 to-transparent" : ""
                  }`}
                >
                  {/* Rank */}
                  <div className="col-span-2 pl-4 flex items-center gap-3">
                    {getRankBadge(rank)}
                    {rank <= 3 && (
                      <span className={`text-xs font-bold ${getRankColor(rank)}`}>
                        {rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}
                      </span>
                    )}
                  </div>

                  {/* Username */}
                  <div className="col-span-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-xs font-bold text-white">
                        {entry.username.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-semibold text-ink-900">{entry.username}</span>
                      {rank <= 3 && (
                        <span className="px-2 py-0.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold rounded-full">
                          Top {rank}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CO₂e */}
                  <div className="col-span-3">
                    <span className="text-xl font-bold text-brand-700">
                      {entry.totalFootprint.toFixed(2)}
                    </span>
                    <span className="text-xs text-ink-300 ml-1">kg CO₂e</span>
                  </div>

                  {/* Category Strengths */}
                  <div className="col-span-3 text-right">
                    <span className="text-xs text-ink-500 bg-surface-panel px-2 py-1 rounded-lg border border-surface-border">
                      {rank <= 10 ? "Top 10 Eco-Champion" : rank <= 25 ? "Low-Impact User" : "Sustainable Living"}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-surface-panel border-t border-surface-border text-center">
          <p className="text-xs text-ink-300">
            Leaderboard updates daily. Anonymous usernames shown for privacy.
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-card border border-surface-border rounded-2xl p-6 shadow-card">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
            <Trophy size={20} className="text-brand-600" />
          </div>
          <h3 className="text-ink-900 font-bold mb-2">Ranking Method</h3>
          <p className="text-sm text-ink-500">
            Users are ranked by their total carbon footprint. Lower CO₂e = higher rank.
          </p>
        </div>
        <div className="bg-surface-card border border-surface-border rounded-2xl p-6 shadow-card">
          <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center mb-4">
            <Users size={20} className="text-sky-600" />
          </div>
          <h3 className="text-ink-900 font-bold mb-2">Privacy First</h3>
          <p className="text-sm text-ink-500">
            Only usernames are displayed. No personal data or exact locations are shared.
          </p>
        </div>
        <div className="bg-surface-card border border-surface-border rounded-2xl p-6 shadow-card">
          <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center mb-4">
            <Award size={20} className="text-violet-500" />
          </div>
          <h3 className="text-ink-900 font-bold mb-2">Monthly Reset</h3>
          <p className="text-sm text-ink-500">
            Leaderboards reset monthly to give everyone a fresh start and new goals.
          </p>
        </div>
      </div>
    </div>
  );
}
