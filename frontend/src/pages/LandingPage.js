import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, BarChart3, Globe2, ShieldCheck, ArrowRight, Activity, Zap } from "lucide-react";
import Login from "./Login";
import { isAuthenticated } from "../api";
import SplitText from "../components/SplitText";

function LandingPage() {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLoginClick = () => {
    if (isAuthenticated()) {
      navigate("/dashboard");
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <div className="relative text-ink-900 font-sans min-h-screen bg-surface-base overflow-hidden selection:bg-brand-200">

      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-50 via-surface-base to-surface-base z-0" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-200/40 rounded-full mix-blend-multiply filter blur-[120px] animate-blob" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-accent/10 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[50%] bg-sky-200/30 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-4000" />

      {/* Blurred Login Modal Overlay */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 backdrop-blur-xl"
          >
            <div className="absolute inset-0" onClick={() => setShowLoginModal(false)}></div>
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="relative z-50 w-full max-w-5xl mx-4 rounded-3xl overflow-hidden shadow-2xl border border-surface-border"
            >
              <div className="absolute top-4 right-4 z-[60]">
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="w-10 h-10 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-ink-700 transition-colors shadow-card"
                >
                  ✕
                </button>
              </div>
              <Login onLoginSuccess={() => {
                setShowLoginModal(false);
                navigate("/dashboard");
              }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`relative z-10 transition-all duration-500 ${showLoginModal ? 'blur-md pointer-events-none scale-[0.98]' : ''}`}>

        {/* Navbar */}
        <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Leaf size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-ink-900">CarbonTrack</span>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={handleLoginClick}
              className="text-sm font-medium text-ink-500 hover:text-ink-900 transition-colors hidden sm:block"
            >
              Customer Login
            </button>
            <Link to="/signup">
              <button className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-[0_4px_20px_rgba(34,194,116,0.25)] hover:shadow-[0_6px_28px_rgba(34,194,116,0.35)]">
                Request Demo
              </button>
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-6 pt-24 pb-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-card border border-surface-border text-brand-700 font-medium text-xs tracking-wide uppercase mb-8 shadow-card"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                </span>
                CarbonTrack Enterprise Platform v2.0
              </motion.div>

              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
                <SplitText text="Decarbonize your operations." delay={40} className="text-ink-900" />
                <span className="text-gradient block mt-2">Intelligently.</span>
              </h1>

              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }}
                className="text-lg lg:text-xl text-ink-500 mb-10 max-w-xl leading-relaxed"
              >
                CarbonTrack provides automated emission calculations, real-time analytics, and actionable insights to help your organization achieve net-zero goals faster and with absolute precision.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1 }}
                className="flex flex-wrap items-center gap-4"
              >
                <button
                  onClick={handleLoginClick}
                  className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-[0_4px_20px_rgba(34,194,116,0.25)] hover:shadow-[0_6px_28px_rgba(34,194,116,0.35)] group"
                >
                  Enter Workspace <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <Link to="/signup">
                  <button className="px-8 py-4 rounded-xl font-semibold text-ink-900 border border-surface-border hover:bg-surface-panel transition-colors bg-surface-card">
                    Contact Sales
                  </button>
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.4 }}
              className="relative"
            >
              <div className="glass-panel p-4 z-10 relative flex flex-col items-center justify-center min-h-[400px] border border-surface-border shadow-card-hover rounded-3xl overflow-hidden bg-surface-card">
                <div className="w-full max-w-[420px] aspect-square flex items-center justify-center">
                  <div className="w-40 h-40 rounded-3xl bg-gradient-brand flex items-center justify-center shadow-2xl shadow-brand-500/30">
                    <Leaf size={72} className="text-white" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <span className="text-xs uppercase tracking-widest text-brand-700 font-semibold bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
                    Real-time Eco Monitoring
                  </span>
                </div>
              </div>

              {/* Floating Metric */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-8 z-20 glass-panel border border-brand-200 p-5 rounded-2xl shadow-card-hover flex items-center gap-4 bg-surface-card"
              >
                <div className="bg-brand-50 p-3 rounded-xl border border-brand-200">
                  <Activity className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-0.5">Real-time Reduction</p>
                  <p className="text-2xl font-bold text-ink-900">45.2% <span className="text-brand-600 text-sm font-medium">↑ this month</span></p>
                </div>
              </motion.div>

              {/* Floating Alert */}
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                className="absolute -top-6 -right-8 z-20 glass-panel border border-accent/30 p-4 rounded-2xl shadow-card-hover flex items-center gap-4 bg-surface-card"
              >
                <div className="bg-accent/10 p-2.5 rounded-xl border border-accent/30">
                  <Zap className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-bold text-ink-900">Target Reached</p>
                  <p className="text-xs text-ink-500">Q3 Emission limit secured</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </main>

        {/* Features Section */}
        <section className="bg-surface-card border-y border-surface-border relative z-20">
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="text-center mb-20 max-w-3xl mx-auto">
              <h2 className="text-sm font-bold tracking-widest text-brand-600 uppercase mb-3">Enterprise Capabilities</h2>
              <h3 className="text-3xl lg:text-5xl font-bold mb-6 text-ink-900">Built for scale and precision.</h3>
              <p className="text-ink-500 text-lg">CarbonTrack integrates seamlessly into your corporate infrastructure to make environmental accountability accurate, automated, and legally compliant.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                whileHover={{ y: -5 }}
                className="glass-panel-hover p-8 rounded-3xl bg-surface-base border border-surface-border shadow-card"
              >
                <div className="bg-brand-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-brand-200">
                  <Globe2 className="w-6 h-6 text-brand-600" />
                </div>
                <h4 className="text-xl font-bold mb-3 text-ink-900">Global Compliance</h4>
                <p className="text-ink-500 leading-relaxed text-sm">Automatically generate reports compliant with GHG Protocol, SEC, and CSRD standards using dynamically updated EPA & IPCC emission factors.</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="glass-panel-hover p-8 rounded-3xl bg-surface-base border border-surface-border shadow-card"
              >
                <div className="bg-teal-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-teal-200">
                  <BarChart3 className="w-6 h-6 text-accent" />
                </div>
                <h4 className="text-xl font-bold mb-3 text-ink-900">Predictive Analytics</h4>
                <p className="text-ink-500 leading-relaxed text-sm">Visualize impact over time with interactive dashboards. Model future emissions based on growth projections and reduction initiatives.</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="glass-panel-hover p-8 rounded-3xl bg-surface-base border border-surface-border shadow-card"
              >
                <div className="bg-sky-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-sky-200">
                  <ShieldCheck className="w-6 h-6 text-sky-600" />
                </div>
                <h4 className="text-xl font-bold mb-3 text-ink-900">Bank-Grade Security</h4>
                <p className="text-ink-500 leading-relaxed text-sm">SOC2 Type II certified infrastructure. Granular RBAC, SSO integration, and end-to-end encryption for all organizational sustainability data.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-surface-border py-12 bg-surface-base relative z-20">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Leaf className="text-brand-600 w-5 h-5" />
              <span className="text-lg font-bold text-ink-900">CarbonTrack</span>
            </div>
            <p className="text-ink-300 text-sm text-center">
              © {new Date().getFullYear()} CarbonTrack Intelligence Inc. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-ink-300">
              <button type="button" className="hover:text-ink-900 transition-colors cursor-pointer">Privacy Policy</button>
              <button type="button" className="hover:text-ink-900 transition-colors cursor-pointer">Terms of Service</button>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}

export default LandingPage;
