import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './styles/index.css';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

const NotFound = () => (
  <div className="glass-panel p-8">
    <h2 className="text-2xl font-semibold">
      404 - Page Not Found
    </h2>
  </div>
);

function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        <main className="flex-1 p-8 overflow-y-auto">

          <Routes>

            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Login */}
            <Route path="/login" element={<Login />} />

            {/* Signup */}
            <Route path="/signup" element={<Signup />} />

            {/* Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />

          </Routes>

        </main>
      </div>
    </Router>
  );
}

export default App;