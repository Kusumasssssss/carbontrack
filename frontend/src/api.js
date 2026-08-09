import { API_BASE_URL } from './config';

export const login = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
        throw new Error('Login failed. Please check your credentials.');
    }
    
    const data = await response.json();
    if (data.token) {
        localStorage.setItem('token', data.token);
        if (data.username) localStorage.setItem('username', data.username);
        if (data.email) localStorage.setItem('email', data.email);
    }
    return data;
};

export const signup = async (username, email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    });
    
    if (!response.ok) {
        throw new Error('Signup failed. Email or username might already be in use.');
    }
    
    const data = await response.json();
    if (data.token) {
        localStorage.setItem('token', data.token);
        if (data.username) localStorage.setItem('username', data.username);
        if (data.email) localStorage.setItem('email', data.email);
    }
    return data;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

// Generic authenticated fetch wrapper
export const fetchAuth = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers
    });
    
    if (response.status === 401 || response.status === 403) {
        logout();
        window.location.href = '/login';
    }
    
    return response;
};
