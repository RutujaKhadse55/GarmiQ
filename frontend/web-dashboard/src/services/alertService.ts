import apiClient from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import { MunicipalAlert } from '../types';
import { MOCK_MUNICIPAL_ALERTS, MOCK_OFFICER } from '../mocks/fixtures';

export interface AlertsResponse {
  alerts: MunicipalAlert[];
  summary: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

export const alertService = {
  async getMunicipalAlerts(): Promise<AlertsResponse> {
    try {
      const response = await apiClient.get<AlertsResponse>(API_ENDPOINTS.ALERTS);
      return response.data;
    } catch {
      return {
        alerts: MOCK_MUNICIPAL_ALERTS,
        summary: {
          total: MOCK_MUNICIPAL_ALERTS.length,
          pending: MOCK_MUNICIPAL_ALERTS.filter((a) => a.status === 'PENDING_APPROVAL').length,
          approved: MOCK_MUNICIPAL_ALERTS.filter((a) => a.status === 'APPROVED').length,
          rejected: MOCK_MUNICIPAL_ALERTS.filter((a) => a.status === 'REJECTED').length,
        },
      };
    }
  },

  async approveAlert(id: string, notes?: string): Promise<MunicipalAlert> {
    try {
      const response = await apiClient.post<MunicipalAlert>(API_ENDPOINTS.ALERT_APPROVE(id), { notes });
      return response.data;
    } catch {
      const alert = MOCK_MUNICIPAL_ALERTS.find((a) => a.id === id);
      if (!alert) throw new Error('Alert not found');
      alert.status = 'APPROVED';
      alert.reviewed_by = MOCK_OFFICER.name;
      alert.reviewed_at = new Date().toISOString();
      alert.review_notes = notes || 'Approved for emergency public broadcast.';
      return alert;
    }
  },

  async rejectAlert(id: string, notes?: string): Promise<MunicipalAlert> {
    try {
      const response = await apiClient.post<MunicipalAlert>(API_ENDPOINTS.ALERT_REJECT(id), { notes });
      return response.data;
    } catch {
      const alert = MOCK_MUNICIPAL_ALERTS.find((a) => a.id === id);
      if (!alert) throw new Error('Alert not found');
      alert.status = 'REJECTED';
      alert.reviewed_by = MOCK_OFFICER.name;
      alert.reviewed_at = new Date().toISOString();
      alert.review_notes = notes || 'Rejected by officer review.';
      return alert;
    }
  },
};
