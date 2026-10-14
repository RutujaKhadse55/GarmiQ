import apiClient from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import { WardForecast } from '../types';
import { MOCK_MUNICIPAL_WARDS } from '../mocks/fixtures';

export const forecastService = {
  async getWardForecast(wardId: string): Promise<WardForecast> {
    try {
      const response = await apiClient.get<WardForecast>(API_ENDPOINTS.WARD_FORECAST(wardId));
      return response.data;
    } catch {
      const ward = MOCK_MUNICIPAL_WARDS.find((w) => w.id === wardId) || MOCK_MUNICIPAL_WARDS[0];
      return {
        ward_id: ward.id,
        ward_name: ward.name,
        date: new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' }),
        max_temp: Math.round(ward.current_heat_index),
        min_temp: 26,
        daily_advisory: `High solar radiation peak forecasted between 12:00 PM and 3:30 PM. Current heat index: ${ward.current_heat_index}°C.`,
        hourly: [
          { time: '06:00', temp_celsius: 26, heat_index_celsius: 27, risk_level: 'LOW', is_safe: true },
          { time: '08:00', temp_celsius: 30, heat_index_celsius: 32, risk_level: 'LOW', is_safe: true },
          { time: '10:00', temp_celsius: 36, heat_index_celsius: 39, risk_level: 'MODERATE', is_safe: true },
          { time: '12:00', temp_celsius: Math.round(ward.current_heat_index - 1), heat_index_celsius: Math.round(ward.current_heat_index), risk_level: ward.risk_level, is_safe: false },
          { time: '14:00', temp_celsius: Math.round(ward.current_heat_index), heat_index_celsius: Math.round(ward.current_heat_index + 2), risk_level: ward.risk_level, is_safe: false },
          { time: '16:00', temp_celsius: Math.round(ward.current_heat_index - 1), heat_index_celsius: Math.round(ward.current_heat_index + 1), risk_level: ward.risk_level, is_safe: false },
          { time: '18:00', temp_celsius: 36, heat_index_celsius: 38, risk_level: 'MODERATE', is_safe: true },
          { time: '20:00', temp_celsius: 32, heat_index_celsius: 34, risk_level: 'LOW', is_safe: true }
        ]
      };
    }
  },
};
