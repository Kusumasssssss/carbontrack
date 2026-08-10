import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, ArrowRight } from 'lucide-react';
import { login, signup } from '../api';
import { motion } from 'framer-motion';

const Login = ({ onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const goToDashboard = () => {
    if (onLoginSuccess) onLoginSuccess();
    else navigate('/dashboard');
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      goToDashboard();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await signup(username, email, password);
      goToDashboard();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-surface-base px-4 py-10">
      <div className="relative w-full max-w-3xl min-h-[560px] bg-surface-card border border-surface-border rounded-3xl shadow-card-hover overflow-hidden">

        {/* ---------- Sign In form ---------- */}
        <div
          className={`absolute top-0 h-full w-full md:w-1/2 flex items-center justify-center transition-all duration-700 ease-in-out z-10
            ${isSignUp ? 'md:translate-x-full opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <form onSubmit={handleSignIn} className="w-full px-8 sm:px-12 flex flex-col items-center text-center">
            <h1 className="text-3xl font-bold text-ink-900 mb-1">Sign In</h1>
            <p className="text-sm text-ink-500 mb-6">Sign in to your CarbonTrack workspace</p>

            {error && !isSignUp && (
              <p className="text-sm text-status-danger mb-3">{error}</p>
            )}

            <input
              type="email"
              placeholder="Work email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-surface-panel border border-surface-border text-ink-900 placeholder-ink-300 rounded-lg px-4 py-3 my-2 text-sm outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-surface-panel border border-surface-border text-ink-900 placeholder-ink-300 rounded-lg px-4 py-3 my-2 text-sm outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400"
            />

            <button type="button" className="text-xs text-brand-600 hover:text-brand-700 my-4">
              Forgot your password?
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 uppercase tracking-wider text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white rounded-full px-10 py-3.5 shadow-[0_4px_20px_rgba(34,194,116,0.25)] transition-colors disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight size={16} />}
            </button>

            <div className="w-full mt-6 flex items-center gap-3">
              <div className="flex-1 border-t border-surface-border" />
              <span className="text-[11px] text-ink-300">Enterprise SSO</span>
              <div className="flex-1 border-t border-surface-border" />
            </div>

            <div className="w-full grid grid-cols-2 gap-3 mt-4">
              <a
                href="http://localhost:8080/oauth2/authorization/google"
                className="flex items-center justify-center gap-2 bg-surface-panel hover:bg-surface-muted text-ink-700 text-xs font-medium py-2.5 rounded-lg border border-surface-border transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </a>
              <a
                href="http://localhost:8080/oauth2/authorization/github"
                className="flex items-center justify-center gap-2 bg-surface-panel hover:bg-surface-muted text-ink-700 text-xs font-medium py-2.5 rounded-lg border border-surface-border transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                GitHub
              </a>
            </div>

            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className="md:hidden mt-6 text-sm text-brand-600 underline"
            >
              New to CarbonTrack? Create an account
            </button>
          </form>
        </div>

        {/* ---------- Sign Up form ---------- */}
        <div
          className={`absolute top-0 h-full w-full md:w-1/2 flex items-center justify-center transition-all duration-700 ease-in-out
            ${isSignUp ? 'md:translate-x-full opacity-100 z-30' : 'opacity-0 pointer-events-none z-0'}`}
        >
          <form onSubmit={handleSignUp} className="w-full px-8 sm:px-12 flex flex-col items-center text-center">
            <h1 className="text-3xl font-bold text-ink-900 mb-1">Create Account</h1>
            <p className="text-sm text-ink-500 mb-6">Set up CarbonTrack for your organization</p>

            {error && isSignUp && (
              <p className="text-sm text-status-danger mb-3">{error}</p>
            )}

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-surface-panel border border-surface-border text-ink-900 placeholder-ink-300 rounded-lg px-4 py-3 my-2 text-sm outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400"
            />
            <input
              type="email"
              placeholder="Work email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-surface-panel border border-surface-border text-ink-900 placeholder-ink-300 rounded-lg px-4 py-3 my-2 text-sm outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-surface-panel border border-surface-border text-ink-900 placeholder-ink-300 rounded-lg px-4 py-3 my-2 text-sm outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400"
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full bg-surface-panel border border-surface-border text-ink-900 placeholder-ink-300 rounded-lg px-4 py-3 my-2 text-sm outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 uppercase tracking-wider text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white rounded-full px-10 py-3.5 mt-6 shadow-[0_4px_20px_rgba(34,194,116,0.25)] transition-colors disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
              {!loading && <ArrowRight size={16} />}
            </button>

            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className="md:hidden mt-6 text-sm text-brand-600 underline"
            >
              Already have an account? Sign In
            </button>
          </form>
        </div>

        {/* ---------- Sliding overlay panel (desktop only) ---------- */}
        <motion.div
          className="hidden md:block absolute top-0 h-full w-1/2 z-20 overflow-hidden rounded-r-3xl"
          animate={{ left: isSignUp ? '0%' : '50%' }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        >
          <div className="relative h-full w-full bg-gradient-brand text-white overflow-hidden">
            {/* ambient blobs to match the app's visual language */}
            <div className="absolute -top-10 -left-10 w-56 h-56 bg-white/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 -right-10 w-56 h-56 bg-black/10 rounded-full blur-3xl" />

            <div
              className={`absolute inset-0 flex flex-col items-center justify-center px-8 text-center transition-opacity duration-500
                ${isSignUp ? 'opacity-0 pointer-events-none' : 'opacity-100 delay-200'}`}
            >
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mb-4">
                <Leaf size={26} />
              </div>
              <h1 className="text-2xl font-bold mb-3">Hello, Friend!</h1>
              <p className="text-sm font-medium mb-6 leading-relaxed opacity-90">
                Register your organization to start tracking, reducing, and reporting your carbon footprint.
              </p>
              <button
                onClick={() => setIsSignUp(true)}
                className="border-2 border-white rounded-full uppercase text-xs font-bold tracking-wider px-10 py-3 hover:bg-white hover:text-brand-600 transition-colors"
              >
                Sign Up
              </button>
            </div>

            <div
              className={`absolute inset-0 flex flex-col items-center justify-center px-8 text-center transition-opacity duration-500
                ${isSignUp ? 'opacity-100 delay-200' : 'opacity-0 pointer-events-none'}`}
            >
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mb-4">
                <Leaf size={26} />
              </div>
              <h1 className="text-2xl font-bold mb-3">Welcome Back!</h1>
              <p className="text-sm font-medium mb-6 leading-relaxed opacity-90">
                Sign in to keep tracking your organization's emissions and sustainability goals.
              </p>
              <button
                onClick={() => setIsSignUp(false)}
                className="border-2 border-white rounded-full uppercase text-xs font-bold tracking-wider px-10 py-3 hover:bg-white hover:text-brand-600 transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
