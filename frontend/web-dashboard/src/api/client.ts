import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string) ||
  'http://localhost:8000';

export const USE_MOCKS =
  import.meta.env.VITE_USE_MOCKS !== 'false';

export const REAL_ENDPOINTS: string[] = (
  (import.meta.env.VITE_REAL_ENDPOINTS as string) || ''
)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

export function shouldBypassMock(endpoint: string): boolean {
  if (!USE_MOCKS) return true;
  return REAL_ENDPOINTS.some((realEp) => endpoint.startsWith(realEp));
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to attach bearer token
apiClient.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('garmiq_officer_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // ignore storage access issues
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401s and token expiration
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Invalidate auth if session expired
      try {
        localStorage.removeItem('garmiq_officer_token');
        localStorage.removeItem('garmiq_officer_user');
      } catch {
        // ignore
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
