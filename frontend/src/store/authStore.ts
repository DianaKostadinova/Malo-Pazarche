import { create } from 'zustand';
import { User, AuthResponse } from '../types';

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setAuthResponse: (response: AuthResponse) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setTokens: (accessToken, refreshToken) => 
    set({ accessToken, refreshToken, isAuthenticated: !!accessToken }),
  clearAuth: () => set({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
  }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setAuthResponse: (response) => {
    if (response.success && response.user && response.accessToken) {
      set({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken || null,
        isAuthenticated: true,
        error: null,
      });
    } else {
      set({
        error: response.message || 'Authentication failed',
      });
    }
  },
}));
