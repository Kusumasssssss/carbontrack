import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ActivitySquare,
  BarChart3,
  Target,
  Award,
  Settings,
  LogOut,
  Leaf,
  PlusCircle,
  Menu,
  X,
  ChevronDown,
  Bell,
  Sun,
  Moon,
  Trophy
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "../api";
import { useTheme } from "../context/ThemeContext";

const NAV_ITEMS = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Log Activity", icon: PlusCircle, path: "/logactivity" },
  { name: "Activities", icon: ActivitySquare, path: "/activities" },
  { name: "LeaderBoard", icon: Trophy, path: "/leaderboard" },
  { name: "Analytics", icon: BarChart3, path: "/analytics" },
  { name: "Goals", icon: Target, path: "/goals" },
  { name: "Badges", icon: Award, path: "/badges" },
];

export default function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const { isDark, setTheme } = useTheme();

  const username = localStorage.getItem("username") || localStorage.getItem("email") || "User";
  const initials = username.substring(0, 2).toUpperCase();

  // Close user menu on outside click
  useEffect(() => {
    function handleClick(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* ── Main Topbar ───────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16
        bg-white/85 backdrop-blur-xl border-b border-surface-border
        shadow-[0_1px_0_rgba(15,26,20,0.02),0_4px_24px_rgba(15,26,20,0.04)] transition-colors duration-300"
      >
        <div className="max-w-screen-2xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4">

          {/* Brand */}
          <Link to="/dashboard" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-brand flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/30 transition-shadow">
              <Leaf size={17} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-ink-900 hidden sm:block">CarbonTrack</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.name} to={item.path}>
                  <motion.div
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200
                      ${isActive
                        ? "text-brand-700 bg-brand-50"
                        : "text-ink-500 hover:text-ink-900 hover:bg-surface-panel"
                      }`}
                  >
                    <Icon size={16} />
                    <span>{item.name}</span>
                    {/* Active underline */}
                    {isActive && (
                      <motion.div
                        layoutId="topbar-active"
                        className="absolute bottom-0 left-3 right-3 h-[2px] bg-brand-500 rounded-full"
                        initial={false}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2 flex-shrink-0">

            {/* Dark / Light toggle */}
            <motion.button
              key={isDark ? "dark" : "light"}
              initial={{ rotate: -30, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.25 }}
              onClick={() => setTheme(isDark ? "light" : "dark")}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="p-2 rounded-xl text-ink-500 hover:text-ink-900 hover:bg-surface-panel transition-all"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>

            {/* Settings icon */}
            <Link to="/settings">
              <button
                title="Settings"
                className={`p-2 rounded-xl transition-all ${location.pathname === "/settings"
                    ? "bg-brand-50 text-brand-700"
                    : "text-ink-500 hover:text-ink-900 hover:bg-surface-panel"
                  }`}
              >
                <Settings size={18} />
              </button>
            </Link>

            {/* Notification bell */}
            <button
              title="Notifications"
              className="relative p-2 rounded-xl text-ink-500 hover:text-ink-900 hover:bg-surface-panel transition-all"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-white" />
            </button>

            {/* User menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-surface-panel transition-all group"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-brand flex items-center justify-center text-xs font-bold text-white">
                  {initials}
                </div>
                <span className="text-sm font-medium text-ink-700 hidden sm:block max-w-[120px] truncate">{username}</span>
                <ChevronDown
                  size={14}
                  className={`text-ink-300 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-52 bg-surface-card border border-surface-border rounded-2xl shadow-card-hover overflow-hidden"
                  >
                    <div className="p-3 border-b border-surface-border">
                      <p className="text-sm font-semibold text-ink-900 truncate">{username}</p>
                      <p className="text-xs text-ink-300 mt-0.5 truncate">{localStorage.getItem("email") || "—"}</p>
                    </div>
                    <div className="p-1.5">
                      <Link to="/settings" onClick={() => setUserMenuOpen(false)}>
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-ink-700 hover:text-ink-900 hover:bg-surface-panel transition-all text-left">
                          <Settings size={15} className="text-ink-300" />
                          Account Settings
                        </button>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-status-danger hover:bg-red-50 transition-all text-left mt-0.5"
                      >
                        <LogOut size={15} />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl text-ink-500 hover:text-ink-900 hover:bg-surface-panel transition-all"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile dropdown menu ─────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden bg-ink-900/30 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="fixed top-16 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-xl border-b border-surface-border shadow-card-hover"
            >
              <nav className="p-3 grid grid-cols-2 gap-1.5">
                {[...NAV_ITEMS, { name: "Settings", icon: Settings, path: "/settings" }].map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                    >
                      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                        ${isActive
                          ? "bg-brand-50 text-brand-700 border border-brand-200"
                          : "text-ink-500 hover:text-ink-900 hover:bg-surface-panel"
                        }`}
                      >
                        <Icon size={17} />
                        {item.name}
                      </div>
                    </Link>
                  );
                })}
              </nav>
              <div className="p-3 pt-0">
                <button
                  onClick={() => { setMobileOpen(false); handleLogout(); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-status-danger hover:bg-red-50 transition-all"
                >
                  <LogOut size={17} />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
