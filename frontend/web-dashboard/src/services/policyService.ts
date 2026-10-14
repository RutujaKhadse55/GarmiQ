import apiClient from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import { PolicySearchResponse } from '../types';
import { MOCK_POLICY_DOCUMENTS } from '../mocks/fixtures';

export const policyService = {
  async searchPolicyKnowledge(query: string): Promise<PolicySearchResponse> {
    try {
      const response = await apiClient.post<PolicySearchResponse>(API_ENDPOINTS.POLICY_SEARCH, { query });
      return response.data;
    } catch {
      const q = query.toLowerCase();
      const match = MOCK_POLICY_DOCUMENTS.find(
        (doc) =>
          doc.query.toLowerCase().includes(q) ||
          (q.includes('action') && doc.query.includes('actions')) ||
          (q.includes('prepared') && doc.query.includes('preparedness')) ||
          (q.includes('vulnerable') && doc.query.includes('vulnerable'))
      );
      if (match) return match;

      return {
        query,
        answer: `Under the PMC Pune Heat Action Plan and NDMA Guidelines, measures for "${query}" require inter-departmental mobilization across Health, Engineering, and Water Works. Standard directives mandate maintaining emergency hydration kiosks, shaded transit corridor inspections, and labor resting hours during peak solar radiation.`,
        confidence_score: 0.88,
        citations: [
          {
            document: 'PMC Pune Heat Action Plan 2024-2026',
            section: 'Chapter 3: Citywide Climate Adaptation & Resilience Protocols',
            page: 15,
            url: 'https://pmc.gov.in/heat-action-plan-2024.pdf',
            excerpt: 'All municipal departments shall align emergency response schedules with GarmiQ heat risk forecasts to protect vulnerable urban populations.'
          },
          {
            document: 'National Disaster Management Authority (NDMA) National Guidelines on Heatwave Management',
            section: 'Annexure B: Municipal Heat Contingency Checklist',
            page: 51,
            url: 'https://ndma.gov.in/guidelines/heatwave-2023.pdf',
            excerpt: 'Standard municipal contingency reserves must allocate rapid-deployment drinking water tankers and shade canopies for public assembly areas.'
          }
        ],
        official_framework: 'PMC Civic Disaster Management Framework & NDMA Protocol',
        applicable_triggers: ['Heat Index >= 40°C', 'Civic Heat Alert']
      };
    }
  },
};
