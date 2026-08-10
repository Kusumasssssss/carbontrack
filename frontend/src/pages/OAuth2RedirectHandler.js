import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract token from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const username = queryParams.get('username');
    const email = queryParams.get('email');
    const error = queryParams.get('error');

    if (token) {
      localStorage.setItem('token', token);
      if (username) localStorage.setItem('username', username);
      if (email) localStorage.setItem('email', email);
      navigate('/dashboard', { replace: true });
    } else {
      console.error("OAuth2 Error: ", error || "Unknown error");
      navigate('/login', { state: { error: error || "Authentication failed" }, replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-surface-base">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-ink-500">Authenticating...</p>
      </div>
    </div>
  );
};

export default OAuth2RedirectHandler;
