import Activities from "./pages/Activities";
import LogActivity from "./pages/LogActivity";
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './styles/index.css';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import OAuth2RedirectHandler from './pages/OAuth2RedirectHandler';

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
          <Route path="/logactivity/:id" element={<LogActivity />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/logactivity" element={<LogActivity />} />
            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Login */}
            <Route path="/login" element={<Login />} />
            
            {/* OAuth2 Redirect */}
            <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

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