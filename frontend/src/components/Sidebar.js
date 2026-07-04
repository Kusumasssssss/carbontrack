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
    <div
      style={{
        width: "270px",
        height: "100vh",
        background: "#0F172A",
        color: "white",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1000,
      }}
    >
      {/* Logo */}

      <div
        style={{
          padding: "30px 25px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <h2
          style={{
            color: "#22C55E",
            margin: 0,
            fontSize: "28px",
          }}
        >
          🌍 CarbonTrack
        </h2>
      </div>

      {/* Menu */}

      <div
        style={{
          flex: 1,
          padding: "20px",
          overflowY: "auto",
        }}
      >
        {menu.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              textDecoration: "none",
              padding: "16px",
              marginBottom: "12px",
              borderRadius: "12px",
              color:
                location.pathname === item.path
                  ? "#22C55E"
                  : "#FFFFFF",
              background:
                location.pathname === item.path
                  ? "#1E293B"
                  : "transparent",
              fontSize: "17px",
              fontWeight: "500",
              transition: "all 0.3s ease",
            }}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </div>

      {/* Logout */}

      <div
        style={{
          padding: "20px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          style={{
            width: "100%",
            background: "#EF4444",
            color: "white",
            border: "none",
            padding: "16px",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "17px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;