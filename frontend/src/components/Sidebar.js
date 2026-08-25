import React, { useState } from "react";
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
  ChevronLeft,
  ChevronRight,
  Trophy,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "../api";

const MENU = [
  { name: "Dashboard",   icon: LayoutDashboard, path: "/dashboard" },
  { name: "Log Activity",icon: PlusCircle,       path: "/logactivity" },
  { name: "Activities",  icon: ActivitySquare,   path: "/activities" },
  { name: "Analytics",   icon: BarChart3,        path: "/analytics" },
  { name: "Goals",       icon: Target,           path: "/goals" },
  { name: "Badges",      icon: Award,            path: "/badges" },
  { name: "Leaderboard", icon: Trophy,           path: "/leaderboard" },
  { name: "Benchmarking",icon: Users,            path: "/benchmarking" },
];

const BOTTOM_MENU = [
  { name: "Settings",    icon: Settings,         path: "/settings" },
];

function Sidebar({ isOpen, setIsOpen }) {
  const location  = useLocation();
  const navigate  = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const username  = localStorage.getItem("username") || localStorage.getItem("email") || "User";
  const initials  = username.substring(0, 2).toUpperCase();

  const NavItem = ({ item, onClick }) => {
    const Icon     = item.icon;
    const isActive = location.pathname === item.path;

    return (
      <Link
        to={item.path}
        onClick={onClick}
        className="block outline-none"
        title={collapsed ? item.name : undefined}
      >
        <motion.div
          whileHover={{ x: collapsed ? 0 : 3 }}
          whileTap={{ scale: 0.97 }}
          className={`flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200 relative group cursor-pointer
            ${collapsed ? "px-4 py-3 justify-center" : "px-3 py-2.5"}
            ${isActive
              ? "text-brand-700 bg-brand-50"
              : "text-ink-500 hover:text-ink-900 hover:bg-surface-panel"
            }`}
        >
          {/* Active indicator bar */}
          {isActive && (
            <motion.div
              layoutId="sidebar-active"
              className="absolute left-0 top-2 bottom-2 w-[3px] bg-brand-500 rounded-r-full"
              initial={false}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}

          <span className={`flex-shrink-0 transition-colors ${isActive ? "text-brand-600" : "text-ink-300 group-hover:text-ink-700"}`}>
            <Icon size={19} />
          </span>

          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden whitespace-nowrap relative z-10"
              >
                {item.name}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Tooltip when collapsed */}
          {collapsed && (
            <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-ink-900 text-white text-xs font-medium rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
              {item.name}
            </div>
          )}
        </motion.div>
      </Link>
    );
  };

  return (
    <>
      {/* ── Desktop / fixed sidebar ──────────────────────────────────── */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`hidden lg:flex flex-col h-screen bg-surface-card border-r border-surface-border fixed left-0 top-0 z-50 shadow-[4px_0_24px_rgba(15,26,20,0.04)] overflow-hidden`}
      >
        {/* Brand */}
        <div className={`flex items-center border-b border-surface-border flex-shrink-0 ${collapsed ? "px-4 py-5 justify-center" : "px-5 py-5 justify-between"}`}>
          {!collapsed && (
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-gradient-brand rounded-xl blur-md opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative w-full h-full rounded-xl bg-gradient-brand flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-300">
                  <Leaf size={20} className="text-white" strokeWidth={2.25} />
                </div>
              </div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl font-bold tracking-tight text-ink-900"
              >
                CarbonTrack
              </motion.span>
            </Link>
          )}

          {collapsed && (
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-gradient-brand rounded-xl blur-sm opacity-25"></div>
              <div className="relative w-full h-full rounded-xl bg-gradient-brand flex items-center justify-center shadow-lg shadow-brand-500/20">
                <Leaf size={16} className="text-white" strokeWidth={2.25} />
              </div>
            </div>
          )}

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-1.5 rounded-lg bg-surface-panel hover:bg-surface-muted text-ink-500 hover:text-ink-900 transition-colors ${collapsed ? "mt-3" : ""}`}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        </div>

        {/* Main nav */}
        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto custom-scrollbar">
          {!collapsed && (
            <p className="px-3 mb-2 text-[10px] font-bold text-ink-300 uppercase tracking-widest">
              Main Menu
            </p>
          )}
          {MENU.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>

        {/* Bottom items */}
        <div className="px-2 py-3 border-t border-surface-border space-y-0.5">
          {BOTTOM_MENU.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}

          {/* User / logout */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => { logout(); navigate("/login"); }}
            title="Sign out"
            className={`w-full flex items-center gap-3 rounded-xl text-sm font-medium transition-all mt-1 text-ink-500 hover:text-status-danger hover:bg-red-50 group
              ${collapsed ? "px-4 py-3 justify-center" : "px-3 py-2.5"}`}
          >
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-100 border border-brand-200 flex items-center justify-center text-xs font-bold text-brand-700 group-hover:border-red-300 transition-colors">
              {initials}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex-1 text-left overflow-hidden"
                >
                  <p className="text-sm font-medium text-ink-700 group-hover:text-status-danger truncate transition-colors leading-none mb-0.5">{username}</p>
                  <p className="text-xs text-ink-300 leading-none">Sign out</p>
                </motion.div>
              )}
            </AnimatePresence>
            {!collapsed && <LogOut size={16} className="flex-shrink-0 opacity-40 group-hover:opacity-100" />}
            {collapsed && (
              <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-ink-900 text-white text-xs font-medium rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                Sign out
              </div>
            )}
          </motion.button>
        </div>
      </motion.aside>

      {/* ── Mobile overlay sidebar ─────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-ink-900/40 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsOpen?.(false)}
            />

            {/* Slide-in panel */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 h-screen w-[260px] bg-surface-card border-r border-surface-border z-50 flex flex-col shadow-2xl lg:hidden"
            >
              {/* Brand + close */}
              <div className="flex items-center justify-between px-5 py-5 border-b border-surface-border">
                <Link to="/dashboard" onClick={() => setIsOpen?.(false)} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-lg shadow-brand-500/20">
                    <Leaf size={20} className="text-white" strokeWidth={2.25} />
                  </div>
                  <span className="text-xl font-bold tracking-tight text-ink-900">CarbonTrack</span>
                </Link>
                <button
                  onClick={() => setIsOpen?.(false)}
                  className="p-1.5 rounded-lg bg-surface-panel text-ink-500 hover:text-ink-900 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
              </div>

              {/* Nav */}
              <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
                <p className="px-3 mb-2 text-[10px] font-bold text-ink-300 uppercase tracking-widest">Main Menu</p>
                {MENU.map((item) => (
                  <NavItem key={item.name} item={item} onClick={() => setIsOpen?.(false)} />
                ))}
              </nav>

              <div className="px-2 py-3 border-t border-surface-border space-y-0.5">
                {BOTTOM_MENU.map((item) => (
                  <NavItem key={item.name} item={item} onClick={() => setIsOpen?.(false)} />
                ))}
                <button
                  onClick={() => { logout(); navigate("/login"); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-500 hover:text-status-danger hover:bg-red-50 transition-all group mt-1"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-100 border border-brand-200 flex items-center justify-center text-xs font-bold text-brand-700">
                    {initials}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-ink-700 group-hover:text-status-danger truncate">{username}</p>
                    <p className="text-xs text-ink-300">Sign out</p>
                  </div>
                  <LogOut size={16} className="opacity-40 group-hover:opacity-100" />
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Sidebar;
