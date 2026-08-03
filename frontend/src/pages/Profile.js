import React, { useEffect, useState } from "react";
import { fetchAuth } from "../api";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Trophy, 
  Award, 
  Target,
  Leaf
} from "lucide-react";
import LottieAnimation from "../components/LottieAnimation";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, statsRes] = await Promise.all([
        fetchAuth("/users/me"),
        fetchAuth("/footprint/monthly-summary")
      ]);

      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error loading profile:", err);
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-16 h-16 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto px-4 py-8"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Your Profile</h1>
        <p className="text-slate-400 mt-2">Manage your account and track your sustainability journey</p>
      </div>

      {/* Profile Card */}
      <motion.div variants={itemVariants} className="bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl mb-8">
        <div className="relative h-32 bg-gradient-to-r from-brand-600 to-emerald-600">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 -mb-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/20 backdrop-blur-sm border-4 border-slate-900 flex items-center justify-center">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} className="w-full h-full rounded-2xl object-cover" alt="Avatar" />
                ) : (
                  <div className="w-full h-full rounded-2xl flex items-center justify-center text-4xl font-bold text-white bg-gradient-to-br from-brand-500 to-emerald-500">
                    {user?.username?.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="pb-2">
                <h2 className="text-2xl font-bold text-white">{user?.username || "User"}</h2>
                <p className="text-brand-200 text-sm">{user?.email || "user@example.com"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-900">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Personal Information</h3>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-white/5">
                <User size={20} className="text-brand-400" />
                <div>
                  <p className="text-xs text-slate-500">Username</p>
                  <p className="text-sm font-medium text-white">{user?.username || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-white/5">
                <Mail size={20} className="text-brand-400" />
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="text-sm font-medium text-white">{user?.email || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-white/5">
                <Calendar size={20} className="text-brand-400" />
                <div>
                  <p className="text-xs text-slate-500">Member Since</p>
                  <p className="text-sm font-medium text-white">{user?.createdAt?.split('T')[0] || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Sustainability Stats</h3>
              {stats ? (
                <>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-white/5">
                    <Leaf size={20} className="text-emerald-400" />
                    <div>
                      <p className="text-xs text-slate-500">Total CO₂e</p>
                      <p className="text-sm font-bold text-white">{stats.totalFootprint.toFixed(2)} kg</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-white/5">
                    <Trophy size={20} className="text-amber-400" />
                    <div>
                      <p className="text-xs text-slate-500">Activities Logged</p>
                      <p className="text-sm font-bold text-white">{stats.totalActivities}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-white/5">
                    <Target size={20} className="text-brand-400" />
                    <div>
                      <p className="text-xs text-slate-500">Current Goal</p>
                      <p className="text-sm font-bold text-emerald-400">{stats.hasActiveGoal ? "Active" : "None"}</p>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-slate-500">No statistics available yet</p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Achievements</h3>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-white/5">
                <Award size={20} className="text-purple-400" />
                <div>
                  <p className="text-xs text-slate-500">Badges Earned</p>
                  <p className="text-sm font-bold text-purple-400">{stats?.badgesEarned || 0} badges</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-white/5">
                <Target size={20} className="text-green-400" />
                <div>
                  <p className="text-xs text-slate-500">Goal Streak</p>
                  <p className="text-sm font-bold text-green-400">{stats?.goalStreak || 0} days</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-white/5">
                <Trophy size={20} className="text-cyan-400" />
                <div>
                  <p className="text-xs text-slate-500">Community Rank</p>
                  <p className="text-sm font-bold text-cyan-400">
                    {stats?.percentileRank || "N/A"} percentile
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
            <button className="px-6 py-2.5 bg-gradient-to-r from-brand-500 to-emerald-500 hover:from-brand-400 hover:to-emerald-400 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-brand-500/20 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </button>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity Summary */}
      {stats?.recentActivity && (
        <motion.div variants={itemVariants} className="bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-white/5">
            <h3 className="text-lg font-bold text-white">Recent Activity Summary</h3>
            <p className="text-sm text-slate-400 mt-1">Your footprint trends over the last 30 days</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-300">Avg Daily CO₂e</span>
                  <span className="text-2xl font-bold text-white">{stats.avgDailyFootprint.toFixed(2)} kg</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 mb-1">
                  <div 
                    className="bg-gradient-to-r from-brand-500 to-emerald-500 h-2 rounded-full" 
                    style={{ width: `${stats.recentActivity.trendPercentage}%` }}
                  />
                </div>
                <p className={`text-xs ${stats.recentActivity.trendPercentage < 50 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {stats.recentActivity.trendPercentage < 50 ? "↓ Trending down - great job!" : "↑ Trending up - try reducing emissions"}
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-300">Best Category</span>
                  <span className="text-2xl font-bold text-emerald-400">{stats.recentActivity?.bestCategory || "N/A"}</span>
                </div>
                <p className="text-xs text-slate-400">
                  You're {stats.recentActivity?.bestCategoryScore || 0}% below average in this category
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
