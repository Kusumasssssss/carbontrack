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
  ChevronRight
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
              ? "text-brand-400 bg-brand-500/10"
              : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
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

          <span className={`flex-shrink-0 transition-colors ${isActive ? "text-brand-400" : "text-slate-500 group-hover:text-slate-300"}`}>
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
            <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg border border-white/10 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
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
        className={`hidden lg:flex flex-col h-screen bg-bg-panel border-r border-white/5 fixed left-0 top-0 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.25)] overflow-hidden`}
      >
        {/* Brand */}
        <div className={`flex items-center border-b border-white/5 flex-shrink-0 ${collapsed ? "px-4 py-5 justify-center" : "px-5 py-5 justify-between"}`}>
          {!collapsed && (
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
                <Leaf size={18} className="text-white" />
              </div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl font-bold tracking-tight text-white"
              >
                Avni
              </motion.span>
            </Link>
          )}

          {collapsed && (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg">
              <Leaf size={18} className="text-white" />
            </div>
          )}

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors ${collapsed ? "mt-3" : ""}`}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        </div>

        {/* Main nav */}
        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto custom-scrollbar">
          {!collapsed && (
            <p className="px-3 mb-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              Main Menu
            </p>
          )}
          {MENU.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>

        {/* Bottom items */}
        <div className="px-2 py-3 border-t border-white/5 space-y-0.5">
          {BOTTOM_MENU.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}

          {/* User / logout */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => { logout(); navigate("/login"); }}
            title="Sign out"
            className={`w-full flex items-center gap-3 rounded-xl text-sm font-medium transition-all mt-1 text-slate-400 hover:text-red-400 hover:bg-red-500/8 group
              ${collapsed ? "px-4 py-3 justify-center" : "px-3 py-2.5"}`}
          >
            <div className={`flex-shrink-0 w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 group-hover:border-red-500/40 transition-colors ${collapsed ? "" : ""}`}>
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
                  <p className="text-sm font-medium text-slate-300 group-hover:text-red-300 truncate transition-colors leading-none mb-0.5">{username}</p>
                  <p className="text-xs text-slate-500 leading-none">Sign out</p>
                </motion.div>
              )}
            </AnimatePresence>
            {!collapsed && <LogOut size={16} className="flex-shrink-0 opacity-40 group-hover:opacity-100" />}
            {collapsed && (
              <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg border border-white/10 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsOpen?.(false)}
            />

            {/* Slide-in panel */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 h-screen w-[260px] bg-bg-panel border-r border-white/5 z-50 flex flex-col shadow-2xl lg:hidden"
            >
              {/* Brand + close */}
              <div className="flex items-center justify-between px-5 py-5 border-b border-white/5">
                <Link to="/dashboard" onClick={() => setIsOpen?.(false)} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                    <Leaf size={18} className="text-white" />
                  </div>
                  <span className="text-xl font-bold tracking-tight text-white">Avni</span>
                </Link>
                <button
                  onClick={() => setIsOpen?.(false)}
                  className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
              </div>

              {/* Nav */}
              <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
                <p className="px-3 mb-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Main Menu</p>
                {MENU.map((item) => (
                  <NavItem key={item.name} item={item} onClick={() => setIsOpen?.(false)} />
                ))}
              </nav>

              <div className="px-2 py-3 border-t border-white/5 space-y-0.5">
                {BOTTOM_MENU.map((item) => (
                  <NavItem key={item.name} item={item} onClick={() => setIsOpen?.(false)} />
                ))}
                <button
                  onClick={() => { logout(); navigate("/login"); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/8 transition-all group mt-1"
                >
                  <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                    {initials}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-slate-300 group-hover:text-red-300 truncate">{username}</p>
                    <p className="text-xs text-slate-500">Sign out</p>
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