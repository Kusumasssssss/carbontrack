import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import "./styles/index.css";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Activities from "./pages/Activities";
import LogActivity from "./pages/LogActivity";
import Analytics from "./pages/Analytics";
import OAuth2RedirectHandler from "./pages/OAuth2RedirectHandler";
import PageTransition from "./components/PageTransition";
import Layout from "./components/Layout";

const NotFound = () => (
  <div className="glass-panel p-8">
    <h2 className="text-2xl font-semibold">
      404 - Page Not Found
    </h2>
  </div>
);

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Landing Page */}
        <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />

        {/* Authentication */}
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />

        {/* Google OAuth2 Redirect */}
        <Route
          path="/oauth2/redirect"
          element={<OAuth2RedirectHandler />}
        />

        {/* Dashboard Routes wrapped in Layout */}
        <Route path="/dashboard" element={<Layout><PageTransition><Dashboard /></PageTransition></Layout>} />
        <Route path="/activities" element={<Layout><PageTransition><Activities /></PageTransition></Layout>} />
        <Route path="/logactivity" element={<Layout><PageTransition><LogActivity /></PageTransition></Layout>} />
        <Route path="/logactivity/:id" element={<Layout><PageTransition><LogActivity /></PageTransition></Layout>} />
        <Route path="/analytics" element={<Layout><PageTransition><Analytics /></PageTransition></Layout>} />

        {/* 404 */}
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-slate-900">
        <main className="flex-1 overflow-x-hidden">
          <AnimatedRoutes />
        </main>
      </div>
    </Router>
  );
}

export default App;