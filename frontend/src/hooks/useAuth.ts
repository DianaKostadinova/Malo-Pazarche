import { useEffect, useCallback } from 'react';
import { useAuthStore } from '@store/authStore';
import { authApi } from '@services/api';

export const useAuth = () => {
  const auth = useAuthStore();

  // Load tokens from localStorage on mount
  useEffect(() => {
    const tokens = localStorage.getItem('authTokens');
    if (tokens) {
      try {
        const { accessToken, refreshToken } = JSON.parse(tokens);
        auth.setTokens(accessToken, refreshToken);
      } catch (error) {
        console.error('Failed to restore auth tokens:', error);
      }
    }
  }, []);

  const register = useCallback(async (email: string, username: string, password: string, fullName?: string) => {
    auth.setLoading(true);
    try {
      const response = await authApi.register({
        email,
        username,
        password,
        confirmPassword: password,
        fullName,
      });

      auth.setAuthResponse(response.data);
      
      if (response.data.accessToken && response.data.refreshToken) {
        localStorage.setItem('authTokens', JSON.stringify({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        }));
      }

      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      auth.setError(message);
      throw error;
    } finally {
      auth.setLoading(false);
    }
  }, []);

  const login = useCallback(async (emailOrUsername: string, password: string) => {
    auth.setLoading(true);
    try {
      const response = await authApi.login({ emailOrUsername, password });
      
      auth.setAuthResponse(response.data);
      
      if (response.data.accessToken && response.data.refreshToken) {
        localStorage.setItem('authTokens', JSON.stringify({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        }));
      }

      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      auth.setError(message);
      throw error;
    } finally {
      auth.setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    localStorage.removeItem('authTokens');
  }, []);

  const clearError = useCallback(() => {
    auth.setError(null);
  }, []);

  return {
    ...auth,
    register,
    login,
    logout,
    clearError,
  };
};
