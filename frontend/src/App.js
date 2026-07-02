import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/index.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { isAuthenticated, logout } from './api';
import { useNavigate } from 'react-router-dom';

// Placeholder Pages
const Dashboard = () => {
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="glass-panel p-8 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-semibold">Welcome to CarbonTrack</h1>
        <button onClick={() => { logout(); navigate('/login'); }} className="text-sm text-slate-400 hover:text-white">Logout</button>
      </div>
      <p className="text-slate-400 mb-6">Your sustainable journey begins here.</p>
      <button className="bg-primary hover:bg-primary-hover text-white font-medium py-3 px-6 rounded-xl transition-all transform hover:-translate-y-[1px]">
        Log Activity
      </button>
    </div>
  );
};

const NotFound = () => (
  <div className="glass-panel p-8">
    <h2 className="text-2xl font-semibold">404 - Page Not Found</h2>
  </div>
);

function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        {/* Sidebar placeholder would go here */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
