import apiClient from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import { SensorDevice } from '../types';
import { MOCK_SENSORS } from '../mocks/fixtures';

export interface TelemetryResponse {
  sensors: SensorDevice[];
  summary: {
    total: number;
    online: number;
    warning: number;
    offline: number;
  };
  last_poll_at: string;
}

export const telemetryService = {
  async getLiveTelemetry(): Promise<TelemetryResponse> {
    try {
      const response = await apiClient.get<TelemetryResponse>(API_ENDPOINTS.TELEMETRY_LIVE);
      return response.data;
    } catch {
      return {
        sensors: MOCK_SENSORS,
        summary: {
          total: MOCK_SENSORS.length,
          online: MOCK_SENSORS.filter((s) => s.status === 'online').length,
          warning: MOCK_SENSORS.filter((s) => s.status === 'warning').length,
          offline: MOCK_SENSORS.filter((s) => s.status === 'offline').length,
        },
        last_poll_at: new Date().toISOString(),
      };
    }
  },

  async getSensorDetails(sensorId: string): Promise<SensorDevice> {
    try {
      const response = await apiClient.get<SensorDevice>(API_ENDPOINTS.SENSOR_DETAILS(sensorId));
      return response.data;
    } catch {
      const found = MOCK_SENSORS.find((s) => s.id === sensorId);
      if (!found) throw new Error(`Sensor ${sensorId} not found.`);
      return found;
    }
  },
};
