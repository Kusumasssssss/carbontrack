import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "./context/ThemeContext";

import "./styles/index.css";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Activities from "./pages/Activities";
import LogActivity from "./pages/LogActivity";
import Analytics from "./pages/Analytics";
import OAuth2RedirectHandler from "./pages/OAuth2RedirectHandler";
import PageTransition from "./components/PageTransition";
import Layout from "./components/Layout";
import Goals from "./pages/Goals";
import Badges from "./pages/Badges";
import LeaderboardPage from "./pages/Leaderboard";
import Benchmarking from "./pages/Benchmarking";
import Profile from "./pages/Profile";
import Chatbot from "./pages/Chatbot";

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] glass-panel p-8 text-center border-dashed border-2 border-white/10">
    <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center mb-4 border border-brand-500/20">
      <svg className="w-8 h-8 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
    <h2 className="text-2xl font-bold text-white mb-2">
      Under Construction
    </h2>
    <p className="text-slate-400">
      This page does not exist or is currently being built. Check back later!
    </p>
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
        <Route
          path="/dashboard"
          element={
            <Layout>
              <PageTransition>
                <Dashboard />
              </PageTransition>
            </Layout>
          }
        />
        <Route path="/activities" element={<Layout><PageTransition><Activities /></PageTransition></Layout>} />
        <Route path="/logactivity" element={<Layout><PageTransition><LogActivity /></PageTransition></Layout>} />
        <Route path="/logactivity/:id" element={<Layout><PageTransition><LogActivity /></PageTransition></Layout>} />
        <Route path="/analytics" element={<Layout><PageTransition><Analytics /></PageTransition></Layout>} />
        {/* Goals Route */}
        <Route path="/goals" element={<Layout><PageTransition><Goals /></PageTransition></Layout>} />
        
        {/* Placeholder Routes for Sidebar Tabs */}
        <Route
          path="/badges"
          element={
            <Layout>
              <PageTransition>
                <Badges />
              </PageTransition>
            </Layout>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <Layout>
              <PageTransition>
                <LeaderboardPage />
              </PageTransition>
            </Layout>
          }
        />
        <Route
          path="/benchmarking"
          element={
            <Layout>
              <PageTransition>
                <Benchmarking />
              </PageTransition>
            </Layout>
          }
        />
        <Route
          path="/profile"
          element={
            <Layout>
              <PageTransition>
                <Profile />
              </PageTransition>
            </Layout>
          }
        />
        <Route
          path="/chatbot"
          element={
            <Layout>
              <PageTransition>
                <Chatbot />
              </PageTransition>
            </Layout>
          }
        />
        <Route path="/settings" element={<Layout><PageTransition><Settings /></PageTransition></Layout>} />

        {/* Catch-all 404 */}
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex min-h-screen bg-slate-900 dark:bg-slate-900 light:bg-white">
          <main className="flex-1 overflow-x-hidden">
            <AnimatedRoutes />
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;