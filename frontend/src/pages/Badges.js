import React, { useEffect, useState } from "react";
import { fetchAuth } from "../api";
import { motion } from "framer-motion";
import { Award, Zap, Flame, Leaf, Star, Lock } from "lucide-react";

const BADGE_META = {
  GOAL: {
    icon: "🎯",
    color: "from-violet-500 to-violet-700",
    border: "border-violet-200",
    bg: "bg-violet-50",
    lucide: <Star size={16} className="text-violet-500" />,
  },
  STREAK: {
    icon: "🔥",
    color: "from-orange-400 to-orange-600",
    border: "border-orange-200",
    bg: "bg-orange-50",
    lucide: <Flame size={16} className="text-orange-500" />,
  },
  REDUCTION: {
    icon: "🌱",
    color: "from-brand-400 to-brand-600",
    border: "border-brand-200",
    bg: "bg-brand-50",
    lucide: <Leaf size={16} className="text-brand-600" />,
  },
  ACTIVITY: {
    icon: "⚡",
    color: "from-sky-400 to-sky-600",
    border: "border-sky-200",
    bg: "bg-sky-50",
    lucide: <Zap size={16} className="text-sky-600" />,
  },
};

const LOCKED_BADGES = [
  { name: "First Activity", description: "Log your first eco-friendly activity.", triggerType: "ACTIVITY", threshold: 1 },
  { name: "7 Day Streak", description: "Log activities for 7 consecutive days.", triggerType: "STREAK", threshold: 7 },
  { name: "First Goal", description: "Achieve your first carbon reduction goal.", triggerType: "GOAL", threshold: 1 },
  { name: "10kg Saver", description: "Reduce 10kg of CO₂ emissions.", triggerType: "REDUCTION", threshold: 10 },
  { name: "25kg Saver", description: "Reduce 25kg of CO₂ emissions.", triggerType: "REDUCTION", threshold: 25 },
  { name: "50kg Saver", description: "Reduce 50kg of CO₂ emissions.", triggerType: "REDUCTION", threshold: 50 },
];

function getMeta(type) {
  return BADGE_META[type] || BADGE_META["ACTIVITY"];
}

function BadgeCard({ badge, earned }) {
  const meta = getMeta(badge.triggerType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={`relative rounded-2xl border ${meta.border} bg-surface-card overflow-hidden group transition-all duration-300
        ${earned ? "shadow-card hover:shadow-card-hover" : "opacity-60 grayscale"}`}
    >
      <div className="p-6 relative z-10">
        {/* Icon */}
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${meta.color} flex items-center justify-center text-2xl shadow-lg mb-4`}>
          {earned ? badge.triggerType === "GOAL" ? "🎯" : badge.triggerType === "STREAK" ? "🔥" : badge.triggerType === "REDUCTION" ? "🌱" : "⚡"
            : <Lock size={22} className="text-white/80" />}
        </div>

        {/* Name & Type */}
        <h3 className="text-ink-900 font-bold text-base mb-1">{badge.name}</h3>
        <p className="text-ink-500 text-xs mb-4 leading-relaxed">{badge.description}</p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${meta.border} ${meta.bg}`}>
            {meta.lucide}
            {badge.triggerType}
          </span>

          {earned ? (
            <div className="text-right">
              {badge.earnedDate && (
                <p className="text-xs text-ink-300">
                  Earned <span className="text-ink-700">{badge.earnedDate}</span>
                </p>
              )}
            </div>
          ) : (
            <span className="text-xs text-ink-300 flex items-center gap-1">
              <Lock size={11} />
              Locked
            </span>
          )}
        </div>

        {badge.threshold && (
          <div className={`mt-4 text-xs font-semibold ${meta.bg} border ${meta.border} rounded-lg px-3 py-1.5 inline-block text-ink-700`}>
            Threshold: {badge.threshold} {badge.triggerType === "REDUCTION" ? "kg CO₂e" : badge.triggerType === "STREAK" ? "days" : ""}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function Badges() {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuth("/badges")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setBadges(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Merge earned badges with locked ones (deduplicated by name)
  const earnedNames = new Set(badges.map((b) => b.name));
  const lockedBadges = LOCKED_BADGES.filter((b) => !earnedNames.has(b.name));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto px-2 py-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-10 flex flex-col md:flex-row items-center justify-between bg-surface-card border border-surface-border p-8 rounded-3xl shadow-card">
        <div>
          <div className="flex items-center gap-2 text-amber-500 mb-2">
            <Award size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Achievements & Milestones</span>
          </div>
          <h1 className="text-4xl font-extrabold text-ink-900 tracking-tight mb-2">My Eco Badges</h1>
          <p className="text-ink-500 font-medium max-w-xl">
            Unlock rewards and collect achievements as you build sustainable daily habits and cut carbon emissions.
          </p>
        </div>
        <div className="w-28 h-28 mt-4 md:mt-0 flex-shrink-0 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
          <Award size={48} className="text-white" />
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total Badges", value: badges.length, color: "text-ink-900" },
          { label: "Goal Badges", value: badges.filter((b) => b.triggerType === "GOAL").length, color: "text-violet-600" },
          { label: "Streak Badges", value: badges.filter((b) => b.triggerType === "STREAK").length, color: "text-orange-500" },
          { label: "Reduction Badges", value: badges.filter((b) => b.triggerType === "REDUCTION").length, color: "text-brand-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-surface-card border border-surface-border rounded-2xl p-5 shadow-card">
            <p className="text-ink-300 text-xs font-semibold uppercase tracking-wider mb-1">{label}</p>
            <p className={`text-3xl font-black ${color}`}>{value}</p>
          </div>
        ))}
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-card border border-surface-border rounded-2xl p-6 animate-pulse h-52" />
          ))}
        </div>
      ) : (
        <>
          {/* Earned Badges */}
          {badges.length > 0 && (
            <motion.div variants={itemVariants} className="mb-10">
              <h2 className="text-sm font-bold text-ink-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-500 inline-block" />
                Earned ({badges.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {badges.map((badge) => (
                  <BadgeCard key={badge.id || badge.name} badge={badge} earned={true} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Locked Badges */}
          {lockedBadges.length > 0 && (
            <motion.div variants={itemVariants}>
              <h2 className="text-sm font-bold text-ink-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Lock size={13} className="text-ink-300" />
                Locked — Keep going! ({lockedBadges.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lockedBadges.map((badge) => (
                  <BadgeCard key={badge.name} badge={badge} earned={false} />
                ))}
              </div>
            </motion.div>
          )}

          {badges.length === 0 && lockedBadges.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-2xl bg-surface-panel flex items-center justify-center text-4xl mb-4">🏅</div>
              <h3 className="text-ink-900 font-bold text-xl mb-2">No Badges Yet</h3>
              <p className="text-ink-300 max-w-xs">
                Start logging eco-friendly activities and setting goals to earn your first badge!
              </p>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}

export default Badges;
