import React from "react";
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
  PlusCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { logout } from "../api";

function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const menu = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
    { name: "Log Activity", icon: <PlusCircle size={20} />, path: "/logactivity" },
    { name: "Activities", icon: <ActivitySquare size={20} />, path: "/activities" },
    { name: "Analytics", icon: <BarChart3 size={20} />, path: "/analytics" },
    { name: "Goals", icon: <Target size={20} />, path: "/goals" },
    { name: "Badges", icon: <Award size={20} />, path: "/badges" },
    { name: "Settings", icon: <Settings size={20} />, path: "/settings" },
  ];

  return (
    <div className={`w-[280px] h-screen bg-bg-panel border-r border-white/5 flex flex-col fixed left-0 top-0 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.2)] transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
      {/* Brand Header */}
      <div className="p-8 pb-6 border-b border-white/5 relative">
        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsOpen?.(false)}
          className="lg:hidden absolute top-6 right-6 p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Leaf size={20} className="text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">Avni</span>
        </div>
        
        {/* Workspace Selector Mockup */}
        <div className="px-3 py-2.5 bg-slate-800/50 rounded-lg border border-white/5 flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-colors">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-6 h-6 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">
              C
            </div>
            <span className="text-sm font-medium text-slate-300 truncate">Corp Workspace</span>
          </div>
          <div className="w-4 h-4 text-slate-500">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="8 10 12 14 16 10"></polyline></svg>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 px-4 py-6 overflow-y-auto space-y-1.5 custom-scrollbar">
        <div className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Main Menu
        </div>
        {menu.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className="block outline-none"
              onClick={() => setIsOpen?.(false)}
            >
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative group
                  ${
                    isActive
                      ? "text-brand-400 bg-brand-500/10 shadow-inner"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-brand-500 rounded-r-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
                
                <span className={`transition-colors ${isActive ? "text-brand-400" : "text-slate-500 group-hover:text-slate-300"}`}>
                  {item.icon}
                </span>
                <span className="tracking-wide relative z-10">{item.name}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* User Profile / Logout */}
      <div className="p-4 border-t border-white/5 bg-slate-900/30">
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors group"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 shrink-0">
              <span className="text-xs font-bold text-slate-300">
                {localStorage.getItem('username') ? localStorage.getItem('username').substring(0, 2).toUpperCase() : 'U'}
              </span>
            </div>
            <div className="text-left overflow-hidden">
              <div className="text-sm font-medium text-slate-300 group-hover:text-red-300 transition-colors truncate">
                {localStorage.getItem('username') || localStorage.getItem('email') || 'User'}
              </div>
              <div className="text-xs text-slate-500 truncate">Sign out</div>
            </div>
          </div>
          <LogOut size={18} className="opacity-50 group-hover:opacity-100 shrink-0" />
        </button>
      </div>
    </div>
  );
}

export default Sidebar;