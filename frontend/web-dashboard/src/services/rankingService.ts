import apiClient from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import { RiskRankingItem } from '../types';
import { MOCK_RANKINGS } from '../mocks/fixtures';

export const rankingService = {
  async getRiskRankings(): Promise<RiskRankingItem[]> {
    try {
      const response = await apiClient.get<RiskRankingItem[]>(API_ENDPOINTS.RANKINGS);
      return response.data;
    } catch {
      return MOCK_RANKINGS;
    }
  },
};
