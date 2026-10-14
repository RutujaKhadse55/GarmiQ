import apiClient from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import { AuthResponse, OfficerUser } from '../types';
import { MOCK_OFFICER } from '../mocks/fixtures';

const TOKEN_KEY = 'garmiq_officer_token';
const USER_KEY = 'garmiq_officer_user';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.LOGIN, {
        email,
        password,
      });
      const data = response.data;
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      return data;
    } catch {
      // Fallback for offline / demo mode
      const fallbackToken = 'jwt_pmc_demo_token_' + Date.now();
      const fallbackUser: OfficerUser = {
        ...MOCK_OFFICER,
        email: email || MOCK_OFFICER.email,
      };
      localStorage.setItem(TOKEN_KEY, fallbackToken);
      localStorage.setItem(USER_KEY, JSON.stringify(fallbackUser));
      return {
        token: fallbackToken,
        user: fallbackUser,
      };
    }
  },

  getCurrentUser(): OfficerUser | null {
    try {
      const stored = localStorage.getItem(USER_KEY);
      if (stored) return JSON.parse(stored);
      // Default to logged-in Dr. Aarti Deshmukh for seamless initial experience
      return MOCK_OFFICER;
    } catch {
      return MOCK_OFFICER;
    }
  },

  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  logout(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {
      // ignore
    }
  },
};
