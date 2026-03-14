import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@store/authStore';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { refreshToken } = useAuthStore.getState();

      if (refreshToken) {
        try {
          const response = await axios.post<AuthResponse>(
            `${API_BASE_URL}/api/auth/refresh-token`,
            { refreshToken }
          );

          useAuthStore.getState().setAuthResponse(response.data);
          return apiClient(originalRequest);
        } catch (refreshError) {
          useAuthStore.getState().clearAuth();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        useAuthStore.getState().clearAuth();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data: RegisterRequest) =>
    apiClient.post<AuthResponse>('/api/auth/register', data),

  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>('/api/auth/login', data),

  refreshToken: (refreshToken: string) =>
    apiClient.post<AuthResponse>('/api/auth/refresh-token', { refreshToken }),

  getCurrentUser: () =>
    apiClient.get('/api/auth/me'),

  logout: () => {
    useAuthStore.getState().clearAuth();
    localStorage.removeItem('authTokens');
  },
};

export default apiClient;
