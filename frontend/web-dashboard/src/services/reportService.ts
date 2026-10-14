import apiClient from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import { MunicipalReport, MunicipalReportStatus } from '../types';
import { MOCK_REPORTS } from '../mocks/fixtures';

export interface ReportsResponse {
  reports: MunicipalReport[];
  total: number;
}

export const reportService = {
  async getMunicipalReports(params?: { status?: string; ward_id?: string }): Promise<ReportsResponse> {
    try {
      const response = await apiClient.get<ReportsResponse>(API_ENDPOINTS.REPORTS, { params });
      return response.data;
    } catch {
      let filtered = [...MOCK_REPORTS];
      if (params?.status && params.status !== 'ALL') {
        filtered = filtered.filter((r) => r.status === params.status);
      }
      if (params?.ward_id && params.ward_id !== 'ALL') {
        filtered = filtered.filter((r) => r.ward_id === params.ward_id);
      }
      return {
        reports: filtered,
        total: filtered.length,
      };
    }
  },

  async updateReportStatus(
    id: string,
    status: MunicipalReportStatus,
    notes?: string
  ): Promise<MunicipalReport> {
    try {
      const response = await apiClient.patch<MunicipalReport>(
        API_ENDPOINTS.REPORT_UPDATE_STATUS(id),
        { status, notes }
      );
      return response.data;
    } catch {
      const report = MOCK_REPORTS.find((r) => r.id === id);
      if (!report) throw new Error('Report not found');
      report.status = status;
      if (notes) report.officer_notes = notes;
      report.updated_at = new Date().toISOString();
      return report;
    }
  },
};
