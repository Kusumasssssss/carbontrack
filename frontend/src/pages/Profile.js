import React, { useEffect, useState } from "react";
import { fetchAuth } from "../api";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Calendar,
  Trophy,
  Award,
  Target,
  Leaf
} from "lucide-react";

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
        <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
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
        <h1 className="text-4xl font-extrabold text-ink-900 tracking-tight">Your Profile</h1>
        <p className="text-ink-500 mt-2">Manage your account and track your sustainability journey</p>
      </div>

      {/* Profile Card */}
      <motion.div variants={itemVariants} className="bg-surface-card border border-surface-border rounded-3xl overflow-hidden shadow-card-hover mb-8">
        <div className="relative h-32 bg-gradient-brand">
          <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 -mb-12 rounded-2xl bg-white/20 backdrop-blur-sm border-4 border-surface-card flex items-center justify-center">
                <div className="w-full h-full rounded-2xl flex items-center justify-center text-4xl font-bold text-white bg-gradient-brand">
                  {user?.username?.substring(0, 2).toUpperCase()}
                </div>
              </div>
              <div className="pb-2">
                <h2 className="text-2xl font-bold text-white">{user?.username || "User"}</h2>
                <p className="text-white/80 text-sm">{user?.email || "user@example.com"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-surface-card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-ink-500 uppercase tracking-wider mb-4">Personal Information</h3>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-panel border border-surface-border">
                <User size={20} className="text-brand-600" />
                <div>
                  <p className="text-xs text-ink-300">Username</p>
                  <p className="text-sm font-medium text-ink-900">{user?.username || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-panel border border-surface-border">
                <Mail size={20} className="text-brand-600" />
                <div>
                  <p className="text-xs text-ink-300">Email</p>
                  <p className="text-sm font-medium text-ink-900">{user?.email || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-panel border border-surface-border">
                <Calendar size={20} className="text-brand-600" />
                <div>
                  <p className="text-xs text-ink-300">Member Since</p>
                  <p className="text-sm font-medium text-ink-900">January 2024</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-ink-500 uppercase tracking-wider mb-4">Sustainability Stats</h3>
              {stats ? (
                <>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-panel border border-surface-border">
                    <Leaf size={20} className="text-brand-600" />
                    <div>
                      <p className="text-xs text-ink-300">Total CO₂e</p>
                      <p className="text-sm font-bold text-ink-900">{stats.totalFootprint.toFixed(2)} kg</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-panel border border-surface-border">
                    <Trophy size={20} className="text-amber-500" />
                    <div>
                      <p className="text-xs text-ink-300">Activities Logged</p>
                      <p className="text-sm font-bold text-ink-900">{stats.totalActivities}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-panel border border-surface-border">
                    <Target size={20} className="text-brand-600" />
                    <div>
                      <p className="text-xs text-ink-300">Current Goal</p>
                      <p className="text-sm font-bold text-brand-700">{stats.hasActiveGoal ? "Active" : "None"}</p>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-ink-300">No statistics available yet</p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-ink-500 uppercase tracking-wider mb-4">Achievements</h3>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-panel border border-surface-border">
                <Award size={20} className="text-violet-500" />
                <div>
                  <p className="text-xs text-ink-300">Badges Earned</p>
                  <p className="text-sm font-bold text-violet-600">{stats?.badgesEarned || 0} badges</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-panel border border-surface-border">
                <Target size={20} className="text-brand-600" />
                <div>
                  <p className="text-xs text-ink-300">Goal Streak</p>
                  <p className="text-sm font-bold text-brand-700">{stats?.goalStreak || 0} days</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-panel border border-surface-border">
                <Trophy size={20} className="text-sky-600" />
                <div>
                  <p className="text-xs text-ink-300">Community Rank</p>
                  <p className="text-sm font-bold text-sky-600">
                    {stats?.percentileRank || "N/A"} percentile
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <div className="mt-8 pt-6 border-t border-surface-border flex justify-end">
            <button className="px-6 py-2.5 bg-gradient-brand hover:opacity-90 text-white font-semibold rounded-xl transition-all shadow-[0_4px_16px_rgba(34,194,116,0.25)] flex items-center gap-2">
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
        <motion.div variants={itemVariants} className="bg-surface-card border border-surface-border rounded-3xl overflow-hidden shadow-card">
          <div className="p-6 border-b border-surface-border">
            <h3 className="text-lg font-bold text-ink-900">Recent Activity Summary</h3>
            <p className="text-sm text-ink-500 mt-1">Your footprint trends over the last 30 days</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface-panel rounded-2xl p-4 border border-surface-border">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-ink-700">Avg Daily CO₂e</span>
                  <span className="text-2xl font-bold text-ink-900">{stats.avgDailyFootprint.toFixed(2)} kg</span>
                </div>
                <div className="w-full bg-surface-muted rounded-full h-2 mb-1">
                  <div
                    className="bg-gradient-brand h-2 rounded-full"
                    style={{ width: `${stats.recentActivity.trendPercentage}%` }}
                  />
                </div>
                <p className={`text-xs ${stats.recentActivity.trendPercentage < 50 ? 'text-brand-700' : 'text-amber-600'}`}>
                  {stats.recentActivity.trendPercentage < 50 ? "↓ Trending down - great job!" : "↑ Trending up - try reducing emissions"}
                </p>
              </div>
              <div className="bg-surface-panel rounded-2xl p-4 border border-surface-border">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-ink-700">Best Category</span>
                  <span className="text-2xl font-bold text-brand-700">{stats.recentActivity?.bestCategory || "N/A"}</span>
                </div>
                <p className="text-xs text-ink-500">
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
