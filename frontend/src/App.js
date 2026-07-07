import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./styles/index.css";

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./styles/index.css";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Activities from "./pages/Activities";
import LogActivity from "./pages/LogActivity";
import Analytics from "./pages/Analytics";
import OAuth2RedirectHandler from "./pages/OAuth2RedirectHandler";
=======
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
            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Authentication */}
            <Route path="/login" element={<Login />} />

            {/* OAuth2 Redirect */}
            <Route
              path="/oauth2/redirect"
              element={<OAuth2RedirectHandler />}
            />

            <Route path="/signup" element={<Signup />} />

            {/* Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Activities */}
            <Route path="/activities" element={<Activities />} />
            <Route path="/logactivity" element={<LogActivity />} />
            <Route path="/logactivity/:id" element={<LogActivity />} />

            {/* Analytics */}
            <Route path="/analytics" element={<Analytics />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;