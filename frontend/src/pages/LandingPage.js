import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, BarChart3, Globe2, ShieldCheck, ArrowRight } from "lucide-react";
import Login from "./Login";
import { isAuthenticated } from "../api";
import SplitText from "../components/SplitText";
import AuroraBackground from "../components/AuroraBackground";

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
    <AuroraBackground>
      <div className="relative text-slate-50 font-sans overflow-hidden">
        
        {/* Blurred Login Modal Overlay */}
        <AnimatePresence>
          {showLoginModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xl"
            >
              <div className="absolute inset-0" onClick={() => setShowLoginModal(false)}></div>
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                className="relative z-50 w-full max-w-md"
              >
                <Login onLoginSuccess={() => {
                  setShowLoginModal(false);
                  navigate("/dashboard");
                }} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content - Blurs when modal is open */}
        <div className={`transition-all duration-300 ${showLoginModal ? 'blur-md pointer-events-none' : ''}`}>
          
          {/* Navigation */}
          <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto relative z-20">
            <div className="flex items-center gap-2">
              <Leaf className="text-emerald-400 w-8 h-8" />
              <span className="text-2xl font-bold tracking-tight text-white">Carbon<span className="text-emerald-400">Track</span></span>
            </div>
            <div className="flex items-center gap-6">
              <button 
                onClick={handleLoginClick}
                className="text-slate-300 hover:text-white font-medium transition-colors"
              >
                Sign In
              </button>
              <Link to="/signup">
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-full font-medium transition-colors shadow-lg shadow-emerald-500/20">
                  Get Started
                </button>
              </Link>
            </div>
          </nav>

          {/* Hero Section */}
          <main className="max-w-7xl mx-auto px-8 pt-20 pb-32 relative z-20">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              <div className="z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 text-emerald-400 font-medium text-sm mb-6"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Enterprise Grade Sustainability
                </motion.div>
                
                <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
                  <SplitText 
                    text="Track Your Carbon Footprint With Precision." 
                    delay={50} 
                    className="text-white"
                  />
                </h1>
                
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="text-lg lg:text-xl text-slate-400 mb-10 max-w-xl leading-relaxed"
                >
                  CarbonTrack provides automated emission calculations, real-time analytics, and actionable insights to help you or your organization achieve net-zero goals.
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="flex flex-wrap items-center gap-4"
                >
                  <button 
                    onClick={handleLoginClick}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full font-semibold transition-all transform hover:-translate-y-1 shadow-xl shadow-emerald-500/20"
                  >
                    Enter Dashboard <ArrowRight className="w-5 h-5" />
                  </button>
                  <Link to="/signup">
                    <button className="px-8 py-4 rounded-full font-semibold text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-800 transition-colors">
                      Create Account
                    </button>
                  </Link>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="relative z-10"
              >
                <div className="glass-panel border border-slate-700/50 p-2 rounded-2xl shadow-2xl relative z-10 bg-slate-800/40 backdrop-blur-sm">
                  <img 
                    src="https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&q=80" 
                    alt="Earth View" 
                    className="rounded-xl w-full object-cover h-[400px]"
                  />
                  
                  {/* Floating Stats */}
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 5 }}
                    className="absolute -bottom-6 -left-6 bg-slate-800 border border-slate-700 p-4 rounded-xl shadow-xl flex items-center gap-4"
                  >
                    <div className="bg-emerald-500/20 p-3 rounded-lg">
                      <BarChart3 className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Emission Offset</p>
                      <p className="text-xl font-bold text-white">45.2% <span className="text-emerald-400 text-sm font-medium">↑ this month</span></p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </main>

          {/* Features Section */}
          <section className="bg-slate-900/50 border-t border-slate-800 py-24 relative overflow-hidden z-20 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-5xl font-bold mb-4">Why choose CarbonTrack?</h2>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg">Our platform is designed to make environmental accountability seamless, accurate, and visually stunning.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-slate-800/60 backdrop-blur-lg border border-slate-700/50 p-8 rounded-2xl transition-all shadow-lg hover:shadow-emerald-500/10"
                >
                  <div className="bg-emerald-500/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                    <Globe2 className="w-7 h-7 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Global Emission Factors</h3>
                  <p className="text-slate-400 leading-relaxed">Our dynamic engine uses up-to-date, scientifically backed emission factors (EPA, IPCC) to calculate your exact carbon footprint automatically.</p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-slate-800/60 backdrop-blur-lg border border-slate-700/50 p-8 rounded-2xl transition-all shadow-lg hover:shadow-blue-500/10"
                >
                  <div className="bg-blue-500/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                    <BarChart3 className="w-7 h-7 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Real-time Analytics</h3>
                  <p className="text-slate-400 leading-relaxed">Visualize your impact over time with beautiful, interactive charts. Track trends, identify peak emission sources, and make informed decisions.</p>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-slate-800/60 backdrop-blur-lg border border-slate-700/50 p-8 rounded-2xl transition-all shadow-lg hover:shadow-purple-500/10"
                >
                  <div className="bg-purple-500/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                    <ShieldCheck className="w-7 h-7 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Goal Management</h3>
                  <p className="text-slate-400 leading-relaxed">Set reduction targets, track your progress, and earn achievements. Keep your goals private or share them publicly to inspire others.</p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-slate-800/50 py-8 text-center text-slate-500 text-sm relative z-20 bg-slate-900/50 backdrop-blur-md">
            <p>© {new Date().getFullYear()} CarbonTrack Inc. All rights reserved. Building a sustainable future.</p>
          </footer>

        </div>
      </div>
    </AuroraBackground>
  );
}

export default LandingPage;