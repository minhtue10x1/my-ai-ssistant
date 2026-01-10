import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Configure Axios defaults
  if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
  } else {
      delete axios.defaults.headers.common['x-auth-token'];
  }

  const checkUser = async () => {
    // Check for token in URL (OAuth redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    
    if (tokenFromUrl) {
        localStorage.setItem('token', tokenFromUrl);
        setToken(tokenFromUrl);
        // Clear URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (token || tokenFromUrl) {
      try {
        const res = await axios.get(`${API_URL}/auth/me`, {
            headers: { 'x-auth-token': tokenFromUrl || token }
        });
        setUser(res.data);
      } catch (err) {
        console.error('Auth check failed', err);
        logout();
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    checkUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
  };

  const register = async (username, email, password) => {
      const res = await axios.post(`${API_URL}/auth/register`, { username, email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
  }

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['x-auth-token'];
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
