import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaLeaf,
  FaChartBar,
  FaBullseye,
  FaAward,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { logout } from "../api";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const menu = [
    { name: "Dashboard", icon: <FaHome />, path: "/dashboard" },
    { name: "Log Activity", icon: <FaLeaf />, path: "/logactivity" },
    { name: "Activities", icon: <FaChartBar />, path: "/activities" },
    { name: "Analytics", icon: <FaChartBar />, path: "/analytics" },
    { name: "Goals", icon: <FaBullseye />, path: "/goals" },
    { name: "Badges", icon: <FaAward />, path: "/badges" },
    { name: "Settings", icon: <FaCog />, path: "/settings" },
  ];

  return (
    <div className="w-[270px] h-screen bg-slate-900 border-r border-slate-800 flex flex-col fixed left-0 top-0 z-50 shadow-2xl">
      {/* Logo */}
      <div className="p-8 border-b border-slate-800">
        <h2 className="text-emerald-400 m-0 text-3xl font-extrabold flex items-center gap-3 tracking-tight">
          🌍 Carbon<span className="text-white">Track</span>
        </h2>
      </div>

      {/* Menu */}
      <div className="flex-1 p-6 overflow-y-auto space-y-2">
        {menu.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className="block outline-none"
            >
              <motion.div
                whileHover={{ x: 5 }}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-[15px] font-semibold transition-all duration-300 relative overflow-hidden group
                  ${
                    isActive
                      ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 shadow-inner"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                  }`}
              >
                {/* Active Indicator Line */}
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-r-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                
                {/* Subtle shine effect on hover for inactive items */}
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                )}

                <span className={`text-lg ${isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-300"}`}>
                  {item.icon}
                </span>
                <span className="tracking-wide relative z-10">{item.name}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Logout */}
      <div className="p-6 border-t border-slate-800 bg-slate-900">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="w-full bg-slate-800 hover:bg-red-500/10 text-slate-300 hover:text-red-400 border border-slate-700 hover:border-red-500/20 py-3.5 px-4 rounded-xl cursor-pointer text-[15px] font-semibold flex items-center justify-center gap-3 transition-colors duration-300 shadow-sm"
        >
          <FaSignOutAlt />
          Logout
        </motion.button>
      </div>
    </div>
  );
}

export default Sidebar;