import React, { useEffect, useState } from "react";
import { fetchAuth } from "../api";
import { Users, Trophy, TrendingDown, Award, Medal, Crown } from "lucide-react";
import LottieAnimation from "./LottieAnimation";

const BADGE_LOTTIE = {
  1: "https://assets4.lottiefiles.com/packages/lf20_touohxv0.json",
  2: "https://assets7.lottiefiles.com/packages/lf20_m6cu980y.json",
  3: "https://assets2.lottiefiles.com/packages/lf20_5njp3vgg.json",
};

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
    if (rank === 1) return "text-yellow-400";
    if (rank === 2) return "text-slate-300";
    if (rank === 3) return "text-orange-400";
    return "text-white";
  };

  const getRankBadge = (rank) => {
    if (rank <= 3) {
      return (
        <div className="w-12 h-12 flex items-center justify-center">
          <LottieAnimation
            src={BADGE_LOTTIE[rank]}
            style={{ width: "48px", height: "48px" }}
          />
        </div>
      );
    }
    return <span className={`text-2xl font-black ${getRankColor(rank)}`}>#{rank}</span>;
  };

  const getRankBadgeSmall = (rank) => {
    if (rank === 1) return <Crown size={18} className="text-yellow-400" />;
    if (rank === 2) return <Medal size={18} className="text-slate-300" />;
    if (rank === 3) return <Award size={18} className="text-orange-400" />;
    return <span className={`font-bold ${getRankColor(rank)}`}>#{rank}</span>;
  };

  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl animate-pulse">
        <div className="h-8 bg-slate-700 rounded w-1/4 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-slate-800 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-cyan-400 mb-2">
          <Users size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">Community Rankings</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
          Carbon Leaderboard 🏆
        </h1>
        <p className="text-slate-400 font-medium max-w-xl">
          See how you compare against the community. Lower footprint = higher rank.
        </p>
      </div>

      {/* User Rank Card */}
      {userRank && (
        <div className="mb-8">
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20">
                <LottieAnimation
                  src="https://assets2.lottiefiles.com/packages/lf20_vnik4lq6.json"
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Your Standing</p>
                <h2 className="text-4xl font-black text-white">
                  Rank #{userRank}
                </h2>
                <p className="text-cyan-400 text-sm font-semibold mt-1">
                  {userRank <= 3 
                    ? "Top Tier Eco-Performer! 🌟" 
                    : userRank <= 10 
                      ? "Excellent! You're in the top 20% 🏆"
                      : "Great job! You're making a difference 🌱"}
                </p>
              </div>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Community Members</p>
              <p className="text-3xl font-bold text-white">{leaderboard.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard List */}
      <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-white/5 bg-slate-950/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingDown size={20} className="text-cyan-400" />
              Top 50 Eco-Champions
            </h2>
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full text-xs font-bold">
              Sorted by CO₂e (Lowest First)
            </span>
          </div>

          <div className="grid grid-cols-12 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            <div className="col-span-2 pl-4">Rank</div>
            <div className="col-span-4">User</div>
            <div className="col-span-3">Total CO₂e</div>
            <div className="col-span-3 text-right">Category Strengths</div>
          </div>
        </div>

        <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto custom-scrollbar">
          {leaderboard.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
                <Users size={32} className="text-slate-500" />
              </div>
              <p className="text-slate-400">No users yet. Be the first to log an activity!</p>
            </div>
          ) : (
            leaderboard.map((entry, index) => {
              const rank = index + 1;
              return (
                <div
                  key={entry.userId}
                  className={`grid grid-cols-12 items-center p-4 hover:bg-white/[0.02] transition-colors ${
                    rank <= 3 ? "bg-gradient-to-r from-transparent via-white/[0.02] to-transparent" : ""
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
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
                        {entry.username.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-semibold text-white">{entry.username}</span>
                      {rank <= 3 && (
                        <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] font-bold rounded-full">
                          Top {rank}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CO₂e */}
                  <div className="col-span-3">
                    <span className="text-xl font-bold text-emerald-400">
                      {entry.totalFootprint.toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-500 ml-1">kg CO₂e</span>
                  </div>

                  {/* Category Strengths */}
                  <div className="col-span-3 text-right">
                    <span className="text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded-lg">
                      {rank <= 10 ? "Top 10 Eco-Champion" : rank <= 25 ? "Low-Impact User" : "Sustainable Living"}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/50 border-t border-white/5 text-center">
          <p className="text-xs text-slate-500">
            Leaderboard updates daily. Anonymous usernames shown for privacy.
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4">
            <Trophy size={20} className="text-emerald-400" />
          </div>
          <h3 className="text-white font-bold mb-2">Ranking Method</h3>
          <p className="text-sm text-slate-400">
            Users are ranked by their total carbon footprint. Lower CO₂e = higher rank.
          </p>
        </div>
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-4">
            <Users size={20} className="text-cyan-400" />
          </div>
          <h3 className="text-white font-bold mb-2">Privacy First</h3>
          <p className="text-sm text-slate-400">
            Only usernames are displayed. No personal data or exact locations are shared.
          </p>
        </div>
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
            <Award size={20} className="text-purple-400" />
          </div>
          <h3 className="text-white font-bold mb-2">Monthly Reset</h3>
          <p className="text-sm text-slate-400">
            Leaderboards reset monthly to give everyone a fresh start and new goals.
          </p>
        </div>
      </div>
    </div>
  );
}
