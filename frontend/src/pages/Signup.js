import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, ArrowRight, Server, Globe, BarChart3 } from 'lucide-react';
import { signup } from '../api';
import { motion } from 'framer-motion';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(username, email, password);
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-bg-dark text-slate-50 font-sans">
      
      {/* Left Registration Form Panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-12 relative z-10">
        <div className="w-full max-w-md">
          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">Create your workspace</h2>
            <p className="text-slate-400">Join Avni to scale your sustainability.</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">Username</label>
              <input
                type="text"
                id="username"
                className="w-full px-4 py-3 rounded-xl border border-slate-700/50 bg-slate-900/50 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/50 transition-all placeholder-slate-600"
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Work Email</label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 rounded-xl border border-slate-700/50 bg-slate-900/50 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/50 transition-all placeholder-slate-600"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-3 rounded-xl border border-slate-700/50 bg-slate-900/50 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/50 transition-all placeholder-slate-600"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-6 bg-brand-500 hover:bg-brand-400 text-slate-950 font-semibold py-3.5 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 group"
            >
              {loading ? 'Setting up...' : 'Create Account'}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-10 flex items-center">
            <div className="flex-1 border-t border-slate-800"></div>
            <span className="px-4 text-xs font-medium text-slate-500">Or sign up with</span>
            <div className="flex-1 border-t border-slate-800"></div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <a 
              href="http://localhost:8080/oauth2/authorization/google"
              className="flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium py-3 px-4 rounded-xl border border-slate-800 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </a>
            <a 
              href="http://localhost:8080/oauth2/authorization/github"
              className="flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium py-3 px-4 rounded-xl border border-slate-800 transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
            </a>
          </div>

          <div className="mt-12 text-center lg:text-left">
            <p className="text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
                Sign in to workspace
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Value Prop Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center p-12 overflow-hidden border-l border-white/5 bg-slate-900/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-bg-dark to-bg-dark z-0" />
        
        <div className="relative z-10 max-w-lg mx-auto">
          <div className="grid gap-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className="flex gap-5 items-start"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700/50">
                <Globe className="text-accent" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Global compliance ready</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Instantly generate reports compliant with GHG Protocol, SEC, and CSRD standards.</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="flex gap-5 items-start"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700/50">
                <Server className="text-brand-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Automated integrations</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Connect to your existing ERP and utility providers for zero-touch data collection.</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="flex gap-5 items-start"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700/50">
                <BarChart3 className="text-purple-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Predictive analytics</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Model future emissions based on growth projections and planned reduction initiatives.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
