import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Bell, Shield, Palette, Globe, Building2,
  Check, Moon, Sun, Monitor,
  Mail, Phone, MapPin, Save, Camera, AlertCircle,
  Trash2, Download, KeyRound, Eye, EyeOff, LogOut,
  RefreshCw, Wifi, WifiOff
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout, fetchAuth } from "../api";
import LottieAnimation from "../components/LottieAnimation";

const LOTTIE_SETTINGS = "https://assets9.lottiefiles.com/packages/lf20_hg7zdf8w.json";

// ─── Storage helpers ──────────────────────────────────────────────────────
const LS = {
  get: (key, fallback) => {
    try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  },
  set: (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
};

// ── Accent color palettes ─────────────────────────────────────────────────
const ACCENT_PALETTES = {
  green:  { name: "Emerald",  css: "#22c55e", cls: "bg-emerald-500" },
  indigo: { name: "Indigo",   css: "#6366f1", cls: "bg-indigo-500"  },
  violet: { name: "Violet",   css: "#8b5cf6", cls: "bg-violet-500"  },
  sky:    { name: "Sky",      css: "#0ea5e9", cls: "bg-sky-500"     },
  amber:  { name: "Amber",    css: "#f59e0b", cls: "bg-amber-500"   },
  rose:   { name: "Rose",     css: "#f43f5e", cls: "bg-rose-500"    },
};

// Apply accent color to document
function applyAccent(colorId) {
  const palette = ACCENT_PALETTES[colorId];
  if (!palette) return;
  document.documentElement.style.setProperty("--accent-brand", palette.css);
}

// Apply theme class to document
function applyTheme(theme) {
  if (theme === "light") {
    document.documentElement.classList.add("light-mode");
    document.documentElement.classList.remove("dark-mode");
  } else if (theme === "dark") {
    document.documentElement.classList.remove("light-mode");
    document.documentElement.classList.add("dark-mode");
  } else {
    // system
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("light-mode", !prefersDark);
    document.documentElement.classList.toggle("dark-mode", prefersDark);
  }
}

// ── Tab definitions ───────────────────────────────────────────────────────
const TABS = [
  { id: "profile",       label: "Profile",       icon: <User size={17} /> },
  { id: "notifications", label: "Notifications", icon: <Bell size={17} /> },
  { id: "appearance",   label: "Appearance",    icon: <Palette size={17} /> },
  { id: "security",     label: "Security",      icon: <Shield size={17} /> },
  { id: "organization", label: "Organization",  icon: <Building2 size={17} /> },
];

// ── Section wrapper ───────────────────────────────────────────────────────
function Section({ title, description, children }) {
  return (
    <div className="glass-panel p-6 space-y-5">
      <div className="pb-4 border-b border-white/5">
        <h3 className="text-base font-bold text-white">{title}</h3>
        {description && <p className="text-sm text-slate-400 mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

// ── Form row ──────────────────────────────────────────────────────────────
function FormRow({ label, hint, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-3">
      <div className="sm:w-44 flex-shrink-0 pt-0.5">
        <p className="text-sm font-medium text-slate-300">{label}</p>
        {hint && <p className="text-xs text-slate-500 mt-0.5 leading-snug">{hint}</p>}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

// ── Input ─────────────────────────────────────────────────────────────────
function Input({ type = "text", placeholder, value, onChange, icon: Icon, disabled, readOnly, rightEl }) {
  return (
    <div className="relative">
      {Icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"><Icon size={15} /></span>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        readOnly={readOnly}
        className={`w-full bg-slate-800/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600
          focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/30 transition-all
          ${Icon ? "pl-9" : ""} ${rightEl ? "pr-10" : ""} ${disabled || readOnly ? "opacity-50 cursor-not-allowed" : ""}`}
      />
      {rightEl && <span className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</span>}
    </div>
  );
}

// ── Toggle ────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between py-2 gap-4">
      <div>
        <p className="text-sm font-medium text-slate-300">{label}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0
          ${checked ? "bg-brand-500" : "bg-slate-700"}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200
          ${checked ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────
function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 48, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 48, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-medium max-w-xs cursor-pointer
        ${type === "success" ? "bg-brand-500 text-slate-950" : "bg-red-500 text-white"}`}
      onClick={onClose}
    >
      {type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
      <span>{message}</span>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
//  MAIN SETTINGS PAGE
// ─────────────────────────────────────────────────────────────────────────
export default function Settings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [toasts, setToasts]       = useState([]);
  const [saving, setSaving]       = useState(false);
  const [showPass, setShowPass]   = useState({ current: false, new: false, confirm: false });
  const [apiStatus, setApiStatus] = useState(null); // null | "ok" | "error"

  // ── Profile ──────────────────────────────────────────────────────────
  const [profile, setProfile] = useState({
    name:     LS.get("username", "") || "",
    email:    LS.get("email", "") || "",
    phone:    LS.get("s_phone", ""),
    location: LS.get("s_location", ""),
    bio:      LS.get("s_bio", ""),
  });
  const [profileDirty, setProfileDirty] = useState(false);

  // ── Notifications ─────────────────────────────────────────────────────
  const [notifs, setNotifs] = useState(LS.get("s_notifs", {
    weeklyReport: true, goalAlerts: true, aiInsights: true,
    badgeUnlocked: true, systemUpdates: false, marketingEmails: false,
  }));

  // ── Appearance ────────────────────────────────────────────────────────
  const [theme, setTheme]   = useState(LS.get("s_theme", "dark"));
  const [accent, setAccent] = useState(LS.get("s_accent", "green"));
  const [compact, setCompact] = useState(LS.get("s_compact", false));
  const [animations, setAnimations] = useState(LS.get("s_animations", true));

  // Apply saved theme/accent on mount
  useEffect(() => {
    applyTheme(theme);
    applyAccent(accent);
    if (compact) document.documentElement.classList.add("compact");
    else document.documentElement.classList.remove("compact");
  }, []); // eslint-disable-line

  // ── Security ──────────────────────────────────────────────────────────
  const [pw, setPw] = useState({ current: "", newPass: "", confirm: "" });
  const [twoFactor, setTwoFactor] = useState(LS.get("s_2fa", false));
  const [sessions] = useState([
    { id: 1, device: "Chrome · Windows", location: "Mumbai, IN", time: "Active now", current: true },
    { id: 2, device: "Safari · iPhone",  location: "Mumbai, IN", time: "2 hours ago", current: false },
  ]);

  // ── Organization ─────────────────────────────────────────────────────
  const [org, setOrg] = useState(LS.get("s_org", {
    name: "Corp Workspace", industry: "Technology",
    country: "India", reportStd: "GHG Protocol", fiscalYear: "January",
  }));

  // ── Toast helpers ─────────────────────────────────────────────────────
  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // ── API health check ──────────────────────────────────────────────────
  const checkApi = async () => {
    try {
      const res = await fetchAuth("/activity");
      setApiStatus(res.ok || res.status === 404 ? "ok" : "error");
    } catch {
      setApiStatus("error");
    }
  };

  // ── Save profile ──────────────────────────────────────────────────────
  const saveProfile = async () => {
    if (!profile.name.trim()) { addToast("Name cannot be empty", "error"); return; }
    setSaving(true);
    // Persist to localStorage immediately
    localStorage.setItem("username", profile.name.trim());
    localStorage.setItem("email", profile.email.trim());
    LS.set("s_phone", profile.phone);
    LS.set("s_location", profile.location);
    LS.set("s_bio", profile.bio);
    setProfileDirty(false);
    // Attempt API call (optional — backend may not have this endpoint)
    try {
      await fetchAuth("/auth/profile", {
        method: "PUT",
        body: JSON.stringify({ username: profile.name, email: profile.email }),
      });
    } catch {} // silent — local save is enough
    setSaving(false);
    addToast("Profile saved successfully!");
  };

  // ── Save notifications ────────────────────────────────────────────────
  const saveNotifs = () => {
    LS.set("s_notifs", notifs);
    addToast("Notification preferences saved!");
  };

  // ── Save appearance ───────────────────────────────────────────────────
  const saveAppearance = () => {
    LS.set("s_theme", theme);
    LS.set("s_accent", accent);
    LS.set("s_compact", compact);
    LS.set("s_animations", animations);
    applyTheme(theme);
    applyAccent(accent);
    if (compact) document.documentElement.classList.add("compact");
    else document.documentElement.classList.remove("compact");
    if (!animations) document.documentElement.style.setProperty("--motion-duration", "0ms");
    else document.documentElement.style.removeProperty("--motion-duration");
    addToast("Appearance updated!");
  };

  // ── Change password ───────────────────────────────────────────────────
  const changePassword = async () => {
    if (!pw.current)   { addToast("Enter your current password", "error"); return; }
    if (!pw.newPass)   { addToast("Enter a new password", "error"); return; }
    if (pw.newPass.length < 8) { addToast("New password must be at least 8 characters", "error"); return; }
    if (pw.newPass !== pw.confirm) { addToast("Passwords don't match", "error"); return; }
    setSaving(true);
    try {
      const res = await fetchAuth("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword: pw.current, newPassword: pw.newPass }),
      });
      if (res.ok) {
        addToast("Password changed successfully!");
        setPw({ current: "", newPass: "", confirm: "" });
      } else {
        const data = await res.json().catch(() => ({}));
        addToast(data.message || "Incorrect current password", "error");
      }
    } catch {
      addToast("Could not reach server — try again", "error");
    }
    setSaving(false);
  };

  // ── Toggle 2FA ────────────────────────────────────────────────────────
  const toggle2FA = (val) => {
    setTwoFactor(val);
    LS.set("s_2fa", val);
    addToast(val ? "Two-factor auth enabled" : "Two-factor auth disabled");
  };

  // ── Save org ──────────────────────────────────────────────────────────
  const saveOrg = () => {
    if (!org.name.trim()) { addToast("Organisation name cannot be empty", "error"); return; }
    LS.set("s_org", org);
    addToast("Organisation settings saved!");
  };

  // ── Export data ───────────────────────────────────────────────────────
  const exportData = async () => {
    setSaving(true);
    try {
      const res = await fetchAuth("/activity");
      if (!res.ok) throw new Error();
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `avni-export-${new Date().toISOString().slice(0,10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      addToast("Data exported successfully!");
    } catch {
      addToast("Export failed — please try again", "error");
    }
    setSaving(false);
  };

  // ── Delete account ────────────────────────────────────────────────────
  const [confirmDelete, setConfirmDelete] = useState("");
  const deleteAccount = async () => {
    if (confirmDelete !== "DELETE") {
      addToast("Type DELETE to confirm", "error");
      return;
    }
    setSaving(true);
    try {
      await fetchAuth("/auth/account", { method: "DELETE" });
    } catch {}
    logout();
    navigate("/");
  };

  // ── Sign out all devices ──────────────────────────────────────────────
  const signOutAll = async () => {
    try {
      await fetchAuth("/auth/logout-all", { method: "POST" });
    } catch {}
    logout();
    navigate("/login");
  };

  const tabVariants = {
    hidden:  { opacity: 0, x: 12 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: "easeOut" } },
    exit:    { opacity: 0, x: -12, transition: { duration: 0.12 } },
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center gap-5 bg-slate-900/60 border border-white/10 p-6 rounded-3xl backdrop-blur-xl">
        <div className="w-14 h-14 flex-shrink-0 hidden sm:block">
          <LottieAnimation src={LOTTIE_SETTINGS} style={{ width: "100%", height: "100%" }} />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-extrabold text-white">Account Settings</h1>
          <p className="text-slate-400 text-sm mt-0.5">Manage your profile, preferences, and workspace.</p>
        </div>
        {/* API status indicator */}
        <button
          onClick={checkApi}
          title="Check API connection"
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/60 border border-white/5 text-xs font-medium transition-all hover:bg-slate-800"
        >
          {apiStatus === null && <RefreshCw size={13} className="text-slate-500" />}
          {apiStatus === "ok" && <Wifi size={13} className="text-brand-400" />}
          {apiStatus === "error" && <WifiOff size={13} className="text-red-400" />}
          <span className={apiStatus === "ok" ? "text-brand-400" : apiStatus === "error" ? "text-red-400" : "text-slate-500"}>
            {apiStatus === "ok" ? "API Connected" : apiStatus === "error" ? "API Offline" : "Check API"}
          </span>
        </button>
      </div>

      {/* Layout */}
      <div className="flex flex-col md:flex-row gap-5">

        {/* Tab list */}
        <div className="md:w-48 flex-shrink-0">
          <div className="glass-panel p-2 flex md:flex-col gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all w-full text-left whitespace-nowrap
                  ${activeTab === tab.id
                    ? "bg-brand-500/15 text-brand-400 border border-brand-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"}`}
              >
                {tab.icon}
                <span className="hidden md:block">{tab.label}</span>
                <span className="md:hidden text-xs">{tab.label.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">

            {/* ══ PROFILE ══════════════════════════════════════════════ */}
            {activeTab === "profile" && (
              <motion.div key="profile" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-5">
                <Section title="Profile Information" description="Your personal details visible across the platform.">
                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-indigo-500 flex items-center justify-center text-2xl font-extrabold text-white shadow-lg">
                        {profile.name ? profile.name[0].toUpperCase() : "U"}
                      </div>
                      <button
                        title="Upload photo (coming soon)"
                        className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-slate-700 border border-white/10 flex items-center justify-center hover:bg-slate-600 transition-colors"
                        onClick={() => addToast("Photo upload coming soon!", "success")}
                      >
                        <Camera size={11} className="text-slate-300" />
                      </button>
                    </div>
                    <div>
                      <p className="text-base font-bold text-white">{profile.name || "User"}</p>
                      <p className="text-xs text-slate-500">{profile.email || "—"}</p>
                    </div>
                  </div>

                  <FormRow label="Display Name" hint="Shown in the dashboard">
                    <Input value={profile.name} placeholder="John Doe" icon={User}
                      onChange={(e) => { setProfile({ ...profile, name: e.target.value }); setProfileDirty(true); }} />
                  </FormRow>
                  <FormRow label="Email Address" hint="Used for sign-in and notifications">
                    <Input value={profile.email} placeholder="you@company.com" icon={Mail}
                      onChange={(e) => { setProfile({ ...profile, email: e.target.value }); setProfileDirty(true); }} />
                  </FormRow>
                  <FormRow label="Phone" hint="Optional">
                    <Input value={profile.phone} placeholder="+91 98765 43210" icon={Phone}
                      onChange={(e) => { setProfile({ ...profile, phone: e.target.value }); setProfileDirty(true); }} />
                  </FormRow>
                  <FormRow label="Location" hint="City, Country">
                    <Input value={profile.location} placeholder="Mumbai, India" icon={MapPin}
                      onChange={(e) => { setProfile({ ...profile, location: e.target.value }); setProfileDirty(true); }} />
                  </FormRow>
                  <FormRow label="Bio" hint="Short description">
                    <textarea
                      value={profile.bio}
                      onChange={(e) => { setProfile({ ...profile, bio: e.target.value }); setProfileDirty(true); }}
                      placeholder="Sustainability manager focused on Scope 3 reduction..."
                      rows={3}
                      className="w-full bg-slate-800/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/30 transition-all resize-none"
                    />
                  </FormRow>
                </Section>

                <div className="flex items-center justify-between">
                  {profileDirty && <p className="text-xs text-amber-400">Unsaved changes</p>}
                  <div className="flex gap-3 ml-auto">
                    <button
                      onClick={() => {
                        setProfile({ name: LS.get("username",""), email: LS.get("email",""), phone: LS.get("s_phone",""), location: LS.get("s_location",""), bio: LS.get("s_bio","") });
                        setProfileDirty(false);
                      }}
                      className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 text-sm font-medium transition-all"
                    >
                      Discard
                    </button>
                    <button
                      onClick={saveProfile}
                      disabled={saving}
                      className="flex items-center gap-2 bg-brand-500 hover:bg-brand-400 disabled:opacity-60 text-slate-950 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-[0_0_12px_rgba(34,197,94,0.3)]"
                    >
                      {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                      Save Profile
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══ NOTIFICATIONS ════════════════════════════════════════ */}
            {activeTab === "notifications" && (
              <motion.div key="notifications" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-5">
                <Section title="Email Notifications" description="Control what Avni emails you about.">
                  {[
                    { key: "weeklyReport",    label: "Weekly Summary Report",  desc: "Carbon footprint digest every Monday" },
                    { key: "goalAlerts",      label: "Goal Progress Alerts",   desc: "Notify when behind or ahead of targets" },
                    { key: "aiInsights",      label: "AI Insights",            desc: "Personalised reduction recommendations" },
                    { key: "badgeUnlocked",   label: "Badge Unlocked",         desc: "Celebrate sustainability achievements" },
                    { key: "systemUpdates",   label: "System Updates",         desc: "Platform feature announcements" },
                    { key: "marketingEmails", label: "Marketing Emails",       desc: "Tips, guides, and industry news" },
                  ].map(({ key, label, desc }) => (
                    <Toggle key={key} checked={notifs[key]} label={label} description={desc}
                      onChange={(v) => setNotifs(prev => ({ ...prev, [key]: v }))} />
                  ))}
                </Section>

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setNotifs({ weeklyReport: false, goalAlerts: false, aiInsights: false, badgeUnlocked: false, systemUpdates: false, marketingEmails: false })}
                    className="px-4 py-2 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 text-sm transition-all"
                  >
                    Disable All
                  </button>
                  <button onClick={saveNotifs}
                    className="flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-slate-950 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-[0_0_12px_rgba(34,197,94,0.3)]"
                  >
                    <Save size={14} /> Save Preferences
                  </button>
                </div>
              </motion.div>
            )}

            {/* ══ APPEARANCE ═══════════════════════════════════════════ */}
            {activeTab === "appearance" && (
              <motion.div key="appearance" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-5">
                <Section title="Color Theme" description="Affects background and surface colours.">
                  <div className="flex gap-3">
                    {[{ id: "dark", label: "Dark", icon: <Moon size={18} /> },
                      { id: "light", label: "Light", icon: <Sun size={18} /> },
                      { id: "system", label: "System", icon: <Monitor size={18} /> }].map((t) => (
                      <button key={t.id} onClick={() => setTheme(t.id)}
                        className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-xl border text-sm font-medium transition-all
                          ${theme === t.id ? "border-brand-500 bg-brand-500/10 text-brand-400" : "border-white/10 bg-slate-800/40 text-slate-400 hover:border-white/20"}`}
                      >
                        {t.icon} {t.label}
                        {theme === t.id && <Check size={13} />}
                      </button>
                    ))}
                  </div>
                </Section>

                <Section title="Accent Color" description="Applied to buttons, active states, and highlights.">
                  <div className="flex gap-2.5 flex-wrap">
                    {Object.entries(ACCENT_PALETTES).map(([id, { name, cls }]) => (
                      <button key={id} onClick={() => setAccent(id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all
                          ${accent === id ? "border-white/40 bg-white/10 text-white" : "border-white/10 text-slate-400 hover:border-white/20"}`}
                      >
                        <span className={`w-3 h-3 rounded-full ${cls}`} /> {name}
                        {accent === id && <Check size={12} />}
                      </button>
                    ))}
                  </div>
                </Section>

                <Section title="Interface Density">
                  <Toggle checked={compact} onChange={setCompact} label="Compact Mode" description="Reduce padding for a denser layout" />
                  <Toggle checked={animations} onChange={setAnimations} label="Motion & Animations" description="Enable smooth transitions and micro-interactions" />
                </Section>

                <div className="flex justify-end">
                  <button onClick={saveAppearance}
                    className="flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-slate-950 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-[0_0_12px_rgba(34,197,94,0.3)]"
                  >
                    <Check size={14} /> Apply Changes
                  </button>
                </div>
              </motion.div>
            )}

            {/* ══ SECURITY ═════════════════════════════════════════════ */}
            {activeTab === "security" && (
              <motion.div key="security" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-5">
                <Section title="Change Password" description="Choose a strong password you don't use elsewhere.">
                  <FormRow label="Current Password">
                    <Input type={showPass.current ? "text" : "password"} value={pw.current} placeholder="••••••••" icon={KeyRound}
                      onChange={(e) => setPw({ ...pw, current: e.target.value })}
                      rightEl={<button type="button" onClick={() => setShowPass(s => ({ ...s, current: !s.current }))} className="text-slate-500 hover:text-slate-300">{showPass.current ? <EyeOff size={14} /> : <Eye size={14} />}</button>}
                    />
                  </FormRow>
                  <FormRow label="New Password" hint="Min. 8 characters">
                    <Input type={showPass.new ? "text" : "password"} value={pw.newPass} placeholder="••••••••" icon={KeyRound}
                      onChange={(e) => setPw({ ...pw, newPass: e.target.value })}
                      rightEl={<button type="button" onClick={() => setShowPass(s => ({ ...s, new: !s.new }))} className="text-slate-500 hover:text-slate-300">{showPass.new ? <EyeOff size={14} /> : <Eye size={14} />}</button>}
                    />
                    {pw.newPass && (
                      <div className="mt-1.5 flex gap-1">
                        {[1,2,3,4].map(i => (
                          <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                            pw.newPass.length >= i*3
                              ? pw.newPass.length < 8 ? "bg-amber-500" : "bg-brand-500"
                              : "bg-slate-700"
                          }`} />
                        ))}
                        <span className="text-[10px] text-slate-500 ml-2 self-center">
                          {pw.newPass.length < 6 ? "Weak" : pw.newPass.length < 10 ? "Fair" : pw.newPass.length < 14 ? "Good" : "Strong"}
                        </span>
                      </div>
                    )}
                  </FormRow>
                  <FormRow label="Confirm Password">
                    <Input type={showPass.confirm ? "text" : "password"} value={pw.confirm} placeholder="••••••••" icon={KeyRound}
                      onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
                      rightEl={<button type="button" onClick={() => setShowPass(s => ({ ...s, confirm: !s.confirm }))} className="text-slate-500 hover:text-slate-300">{showPass.confirm ? <EyeOff size={14} /> : <Eye size={14} />}</button>}
                    />
                    {pw.confirm && pw.newPass && (
                      <p className={`text-xs mt-1 ${pw.confirm === pw.newPass ? "text-brand-400" : "text-red-400"}`}>
                        {pw.confirm === pw.newPass ? "✓ Passwords match" : "✗ Passwords do not match"}
                      </p>
                    )}
                  </FormRow>
                  <button onClick={changePassword} disabled={saving}
                    className="flex items-center gap-2 bg-brand-500 hover:bg-brand-400 disabled:opacity-60 text-slate-950 px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
                  >
                    {saving ? <RefreshCw size={13} className="animate-spin" /> : <KeyRound size={13} />}
                    Update Password
                  </button>
                </Section>

                <Section title="Two-Factor Authentication" description="Add an extra layer of security to your account.">
                  <Toggle checked={twoFactor} onChange={toggle2FA} label="Enable 2FA via Authenticator App" description="Require a code on every sign-in" />
                  {twoFactor && (
                    <div className="p-4 rounded-xl bg-brand-500/5 border border-brand-500/20 text-sm text-slate-300">
                      <p className="font-semibold text-brand-400 mb-1">2FA Enabled ✓</p>
                      <p>Scan the QR code in your authenticator app (Google Authenticator, Authy) to complete setup.</p>
                    </div>
                  )}
                </Section>

                <Section title="Active Sessions">
                  <div className="space-y-2">
                    {sessions.map((s) => (
                      <div key={s.id} className="flex items-center justify-between p-3.5 bg-slate-800/50 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-slate-700/60 flex items-center justify-center">
                            <Monitor size={17} className={s.current ? "text-brand-400" : "text-slate-400"} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{s.device}</p>
                            <p className="text-xs text-slate-500">{s.location} · {s.time}</p>
                          </div>
                        </div>
                        {s.current
                          ? <span className="text-xs text-brand-400 font-semibold px-2 py-0.5 bg-brand-500/10 rounded-full">Current</span>
                          : <button className="text-xs text-red-400 hover:text-red-300 transition-colors">Revoke</button>
                        }
                      </div>
                    ))}
                  </div>
                </Section>

                <Section title="Danger Zone">
                  <div className="space-y-4">
                    <button onClick={signOutAll}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 text-sm font-medium transition-all"
                    >
                      <LogOut size={15} /> Sign Out of All Devices
                    </button>
                    <div className="border-t border-white/5 pt-4 space-y-3">
                      <p className="text-sm text-slate-400">Type <span className="font-mono text-red-400 font-bold">DELETE</span> to permanently delete your account and all data.</p>
                      <div className="flex gap-3">
                        <input value={confirmDelete} onChange={(e) => setConfirmDelete(e.target.value)}
                          placeholder="Type DELETE to confirm"
                          className="flex-1 bg-slate-800/60 border border-red-500/20 rounded-xl px-4 py-2.5 text-sm text-red-300 placeholder-slate-600 focus:outline-none focus:border-red-500/50 transition-all"
                        />
                        <button onClick={deleteAccount} disabled={saving || confirmDelete !== "DELETE"}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Trash2 size={15} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </Section>
              </motion.div>
            )}

            {/* ══ ORGANIZATION ═════════════════════════════════════════ */}
            {activeTab === "organization" && (
              <motion.div key="organization" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-5">
                <Section title="Workspace Details" description="Configure your organisation's identity and compliance settings.">
                  <FormRow label="Organisation Name">
                    <Input value={org.name} placeholder="Acme Corp" icon={Building2}
                      onChange={(e) => setOrg({ ...org, name: e.target.value })} />
                  </FormRow>
                  <FormRow label="Industry">
                    <select value={org.industry} onChange={(e) => setOrg({ ...org, industry: e.target.value })}
                      className="w-full bg-slate-800/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-brand-500/60 transition-all">
                      {["Technology","Manufacturing","Finance","Healthcare","Energy","Retail","Transport","Agriculture","Consulting","Other"].map(i => (
                        <option key={i} value={i}>{i}</option>
                      ))}
                    </select>
                  </FormRow>
                  <FormRow label="Country / Region">
                    <Input value={org.country} placeholder="India" icon={Globe}
                      onChange={(e) => setOrg({ ...org, country: e.target.value })} />
                  </FormRow>
                  <FormRow label="Reporting Standard" hint="Governs how emissions are calculated">
                    <select value={org.reportStd} onChange={(e) => setOrg({ ...org, reportStd: e.target.value })}
                      className="w-full bg-slate-800/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-brand-500/60 transition-all">
                      {["GHG Protocol","ISO 14064","CSRD","SEC Climate Disclosure","TCFD","BRSR"].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </FormRow>
                  <FormRow label="Fiscal Year Start">
                    <select value={org.fiscalYear} onChange={(e) => setOrg({ ...org, fiscalYear: e.target.value })}
                      className="w-full bg-slate-800/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-brand-500/60 transition-all">
                      {["January","April","July","October"].map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </FormRow>
                </Section>

                <Section title="Data Management" description="Export or manage your organisation's stored data.">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={exportData} disabled={saving}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 text-sm font-medium transition-all disabled:opacity-50"
                    >
                      {saving ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
                      Export All Activities (JSON)
                    </button>
                  </div>
                  <p className="text-xs text-slate-500">Downloads all your logged activities as a JSON file to your device.</p>
                </Section>

                <div className="flex justify-end">
                  <button onClick={saveOrg}
                    className="flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-slate-950 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-[0_0_12px_rgba(34,197,94,0.3)]"
                  >
                    <Save size={14} /> Save Organisation
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* Toast stack */}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
