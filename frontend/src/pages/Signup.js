import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { signup } from '../api';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signup(username, email, password);
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full px-4">
      <div className="glass-panel w-full max-w-[400px] p-8 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 text-primary mb-4">
            <Leaf size={32} />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Create an Account</h2>
          <p className="text-sm text-slate-400">Join CarbonTrack to start your sustainable journey</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-900/50 text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-emerald-500/20 transition-all"
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-900/50 text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-emerald-500/20 transition-all"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-900/50 text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-emerald-500/20 transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="w-full mt-6 bg-primary hover:bg-primary-hover text-white font-medium py-3 px-6 rounded-xl transition-all transform hover:-translate-y-[1px]">
            Sign Up
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <p className="text-slate-400">
            Already have an account? <Link to="/login" className="text-primary hover:text-primary-hover font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
