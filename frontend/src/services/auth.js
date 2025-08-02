import { createContext, useContext } from 'react';
import api from './api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export { AuthContext };

// Export the auth logic functions
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;
    
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return { token, user };
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    const { token, user } = response.data;
    
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return { token, user };
  },

  logout: () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  },

  loadUser: async () => {
    const response = await api.get('/auth/profile');
    return response.data.user;
  }
};