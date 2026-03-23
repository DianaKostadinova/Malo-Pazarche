import { useCallback } from 'react';
import { useAuthStore } from '@store/authStore';
import { authApi } from '@services/api';

export const useAuth = () => {
  const auth = useAuthStore();

  // No useEffect needed — authStore already loads from localStorage on init

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

      if (response.data.user) {
        localStorage.setItem('authUser', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error: any) {
      const data = error.response?.data;
      let message = 'Registration failed';
      if (data?.errors) message = Object.values(data.errors).flat().join(' ');
      else if (data?.message) message = data.message;
      else if (data?.title) message = data.title;
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

      if (response.data.user) {
        localStorage.setItem('authUser', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error: any) {
      const data = error.response?.data;
      let message = 'Login failed';
      if (data?.errors) message = Object.values(data.errors).flat().join(' ');
      else if (data?.message) message = data.message;
      else if (data?.title) message = data.title;
      auth.setError(message);
      throw error;
    } finally {
      auth.setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    localStorage.removeItem('authTokens');
    localStorage.removeItem('authUser');
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