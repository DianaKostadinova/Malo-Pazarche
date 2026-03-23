import { create } from 'zustand';
import { User, AuthResponse } from '../types';

// Вчитај од localStorage при иницијализација
const loadInitialAuth = () => {
  try {
    const tokens = localStorage.getItem('authTokens');
    const userStr = localStorage.getItem('authUser');
    if (tokens) {
      const { accessToken, refreshToken } = JSON.parse(tokens);
      const user = userStr ? JSON.parse(userStr) : null;
      return { accessToken, refreshToken, user, isAuthenticated: !!accessToken };
    }
  } catch {}
  return { accessToken: null, refreshToken: null, user: null, isAuthenticated: false };
};

const initial = loadInitialAuth();

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setAuthResponse: (response: AuthResponse) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  ...initial,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setTokens: (accessToken, refreshToken) =>
    set({ accessToken, refreshToken, isAuthenticated: !!accessToken }),
  clearAuth: () => {
    localStorage.removeItem('authTokens');
    localStorage.removeItem('authUser');
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
  },
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setAuthResponse: (response) => {
    if (response.success && response.user && response.accessToken) {
      // Зачувај user во localStorage
      localStorage.setItem('authUser', JSON.stringify(response.user));
      set({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken || null,
        isAuthenticated: true,
        error: null,
      });
    } else {
      set({ error: response.message || 'Authentication failed' });
    }
  },
}));