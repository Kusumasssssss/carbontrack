import React, { useEffect, useState } from "react";
import { fetchAuth } from "../api";
import { motion } from "framer-motion";
import { Award, Zap, Flame, Leaf, Star, Lock } from "lucide-react";
import LottieAnimation from "../components/LottieAnimation";

const BADGE_META = {
  GOAL: {
    icon: "🎯",
    color: "from-violet-600 to-purple-800",
    border: "border-violet-500/30",
    glow: "shadow-violet-500/20",
    bg: "bg-violet-500/10",
    lucide: <Star size={16} className="text-violet-400" />,
  },
  STREAK: {
    icon: "🔥",
    color: "from-orange-500 to-red-700",
    border: "border-orange-500/30",
    glow: "shadow-orange-500/20",
    bg: "bg-orange-500/10",
    lucide: <Flame size={16} className="text-orange-400" />,
  },
  REDUCTION: {
    icon: "🌱",
    color: "from-emerald-500 to-teal-700",
    border: "border-emerald-500/30",
    glow: "shadow-emerald-500/20",
    bg: "bg-emerald-500/10",
    lucide: <Leaf size={16} className="text-emerald-400" />,
  },
  ACTIVITY: {
    icon: "⚡",
    color: "from-sky-500 to-blue-700",
    border: "border-sky-500/30",
    glow: "shadow-sky-500/20",
    bg: "bg-sky-500/10",
    lucide: <Zap size={16} className="text-sky-400" />,
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
      className={`relative rounded-2xl border ${meta.border} bg-[#111827] overflow-hidden group transition-all duration-300
        ${earned ? `shadow-xl ${meta.glow}` : "opacity-50 grayscale"}`}
    >
      {/* Glow accent */}
      {earned && (
        <div className={`absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br ${meta.color} opacity-10 rounded-full blur-2xl pointer-events-none`} />
      )}

      <div className="p-6 relative z-10">
        {/* Icon */}
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${meta.color} flex items-center justify-center text-2xl shadow-lg mb-4`}>
          {earned ? badge.triggerType === "GOAL" ? "🎯" : badge.triggerType === "STREAK" ? "🔥" : badge.triggerType === "REDUCTION" ? "🌱" : "⚡"
            : <Lock size={22} className="text-white/70" />}
        </div>

        {/* Name & Type */}
        <h3 className="text-white font-bold text-base mb-1">{badge.name}</h3>
        <p className="text-slate-400 text-xs mb-4 leading-relaxed">{badge.description}</p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${meta.border} ${meta.bg}`}>
            {meta.lucide}
            {badge.triggerType}
          </span>

          {earned ? (
            <div className="text-right">
              {badge.earnedDate && (
                <p className="text-xs text-slate-500">
                  Earned <span className="text-slate-300">{badge.earnedDate}</span>
                </p>
              )}
            </div>
          ) : (
            <span className="text-xs text-slate-600 flex items-center gap-1">
              <Lock size={11} />
              Locked
            </span>
          )}
        </div>

        {badge.threshold && (
          <div className={`mt-4 text-xs font-semibold ${meta.bg} border ${meta.border} rounded-lg px-3 py-1.5 inline-block`}>
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
      <motion.div variants={itemVariants} className="mb-10 flex flex-col md:flex-row items-center justify-between bg-slate-900/60 border border-white/10 p-8 rounded-3xl backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-amber-400 mb-2">
            <Award size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Achievements & Milestones</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">My Eco Badges</h1>
          <p className="text-slate-400 font-medium max-w-xl">
            Unlock rewards and collect achievements as you build sustainable daily habits and cut carbon emissions.
          </p>
        </div>
        <div className="w-36 h-36 mt-4 md:mt-0 flex-shrink-0">
          <LottieAnimation
            src="https://assets4.lottiefiles.com/packages/lf20_touohxv0.json"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total Badges", value: badges.length, color: "text-white" },
          { label: "Goal Badges", value: badges.filter((b) => b.triggerType === "GOAL").length, color: "text-violet-400" },
          { label: "Streak Badges", value: badges.filter((b) => b.triggerType === "STREAK").length, color: "text-orange-400" },
          { label: "Reduction Badges", value: badges.filter((b) => b.triggerType === "REDUCTION").length, color: "text-emerald-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-[#111827] border border-white/10 rounded-2xl p-5 shadow-lg">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">{label}</p>
            <p className={`text-3xl font-black ${color}`}>{value}</p>
          </div>
        ))}
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#111827] border border-white/10 rounded-2xl p-6 animate-pulse h-52" />
          ))}
        </div>
      ) : (
        <>
          {/* Earned Badges */}
          {badges.length > 0 && (
            <motion.div variants={itemVariants} className="mb-10">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
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
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Lock size={13} className="text-slate-600" />
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
              <div className="w-20 h-20 rounded-2xl bg-slate-800 flex items-center justify-center text-4xl mb-4">🏅</div>
              <h3 className="text-white font-bold text-xl mb-2">No Badges Yet</h3>
              <p className="text-slate-500 max-w-xs">
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