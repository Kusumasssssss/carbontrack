import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function LandingPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#081c15,#1b4332,#2d6a4f)",
        color: "white",
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 60px",
        }}
      >
        <h2 style={{ color: "#95d5b2" }}>🌍 CarbonTrack</h2>

        <div style={{ display: "flex", gap: "20px" }}>
          <Link to="/login">
            <button
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Login
            </button>
          </Link>

          <Link to="/signup">
            <button
              style={{
                padding: "10px 20px",
                background: "#2dc653",
                color: "white",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Sign Up
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          padding: "80px",
          flexWrap: "wrap",
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          style={{ maxWidth: "600px" }}
        >
          <h1 style={{ fontSize: "60px" }}>
            Track Your Carbon Footprint
          </h1>

          <p
            style={{
              marginTop: "20px",
              fontSize: "22px",
              lineHeight: "1.7",
            }}
          >
            CarbonTrack helps individuals and organizations monitor,
            reduce, and achieve sustainability goals for a greener future.
          </p>

          <div style={{ marginTop: "40px" }}>
            <Link to="/signup">
              <button
                style={{
                  padding: "15px 35px",
                  background: "#2dc653",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  marginRight: "20px",
                  cursor: "pointer",
                }}
              >
                Get Started
              </button>
            </Link>

            <Link to="/login">
              <button
                style={{
                  padding: "15px 35px",
                  background: "transparent",
                  color: "white",
                  border: "2px solid white",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                Login
              </button>
            </Link>
          </div>
        </motion.div>

        <motion.img
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          src="https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=700"
          alt="Earth"
          style={{
            width: "450px",
            borderRadius: "50%",
            boxShadow: "0px 0px 60px rgba(0,255,120,.5)",
          }}
        />
      </div>
    </div>
  );
}

export default LandingPage;