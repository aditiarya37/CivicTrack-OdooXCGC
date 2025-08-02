import React, { useState, useEffect } from 'react';
import { AuthContext, authService } from '../../services/auth';
import api from '../../services/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const userData = await authService.loadUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user:', error);
      authService.logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { token, user } = await authService.login(email, password);
    setUser(user);
    return { token, user };
  };

  const register = async (userData) => {
    const { token, user } = await authService.register(userData);
    setUser(user);
    return { token, user };
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}