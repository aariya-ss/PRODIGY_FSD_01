import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if session cookie is valid on application mount
  const checkAuth = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data && res.data.success) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Login handler
  const login = async (email, password, rememberMe) => {
    try {
      setError(null);
      const res = await api.post('/auth/login', { email, password, rememberMe });
      if (res.data && res.data.success) {
        setUser(res.data.user);
        return res.data;
      }
    } catch (err) {
      setError(err.message || 'Failed to log in.');
      throw err;
    }
  };

  // Registration handler
  const register = async (name, email, password, role) => {
    try {
      setError(null);
      const res = await api.post('/auth/register', { name, email, password, role });
      if (res.data && res.data.success) {
        setUser(res.data.user);
        return res.data;
      }
    } catch (err) {
      setError(err.message || 'Failed to register.');
      throw err;
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, checkAuth, setError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
