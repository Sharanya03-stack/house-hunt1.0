import { create } from 'zustand';
import api from '../lib/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  isLoading: true,
  isAuthenticated: false,

  // ─── Bootstrap: load user from token ─────────────────────────────────────
  initialize: async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      set({ isLoading: false, isAuthenticated: false });
      return;
    }

    try {
      const { data } = await api.get('/auth/me');
      set({ user: data.data.user, isAuthenticated: true, isLoading: false });
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  // ─── Login ────────────────────────────────────────────────────────────────
  login: async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    const { user, accessToken, refreshToken } = data.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    set({ user, accessToken, isAuthenticated: true });
    return user;
  },

  // ─── Register ─────────────────────────────────────────────────────────────
  register: async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    // If email is disabled, backend returns tokens for immediate login
    if (data.data?.accessToken) {
      const { user, accessToken, refreshToken } = data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      set({ user, accessToken, isAuthenticated: true });
    }
    return data;
  },

  // ─── Google Login ─────────────────────────────────────────────────────────
  googleLogin: async (googleData) => {
    const { data } = await api.post('/auth/google', googleData);
    const { user, accessToken, refreshToken } = data.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    set({ user, accessToken, isAuthenticated: true });
    return user;
  },

  // ─── Logout ───────────────────────────────────────────────────────────────
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ user: null, accessToken: null, isAuthenticated: false });
  },

  // ─── Update user ──────────────────────────────────────────────────────────
  updateUser: (updates) => {
    set((state) => ({ user: { ...state.user, ...updates } }));
  },
}));
