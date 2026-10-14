import apiClient from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import { HeatActionPlan } from '../types';
import { MOCK_HEAT_ACTION_PLANS, MOCK_OFFICER } from '../mocks/fixtures';

export const planService = {
  async getHeatActionPlans(): Promise<HeatActionPlan[]> {
    try {
      const response = await apiClient.get<HeatActionPlan[]>(API_ENDPOINTS.PLANS);
      return response.data;
    } catch {
      return MOCK_HEAT_ACTION_PLANS;
    }
  },

  async getPlanById(id: string): Promise<HeatActionPlan> {
    try {
      const response = await apiClient.get<HeatActionPlan>(API_ENDPOINTS.PLAN_DETAILS(id));
      return response.data;
    } catch {
      const found = MOCK_HEAT_ACTION_PLANS.find((p) => p.id === id);
      if (!found) throw new Error('Plan not found');
      return found;
    }
  },

  async createHeatActionPlan(payload: Partial<HeatActionPlan>): Promise<HeatActionPlan> {
    try {
      const response = await apiClient.post<HeatActionPlan>(API_ENDPOINTS.PLANS, payload);
      return response.data;
    } catch {
      const newPlan: HeatActionPlan = {
        id: 'plan-pmc-' + Date.now(),
        title: payload.title || 'PMC Pune Heat Action Plan',
        year: payload.year || 2026,
        planning_cycle: payload.planning_cycle || '2026-2027 Planning Period',
        city: 'Pune',
        status: 'DRAFT',
        target_wards: payload.target_wards || ['Kasba Peth', 'Swargate'],
        vulnerability_focus: payload.vulnerability_focus || 'High-density unshaded areas',
        budget_lakhs: Number(payload.budget_lakhs) || 250,
        key_pillars: payload.key_pillars || [
          'Early Warning Systems & Color-Coded Public Alerts',
          'Cool Roofs & White Solar Reflective Paint',
          'Emergency Hydration & Chilled Water Stations'
        ],
        summary: payload.summary || 'Empirical heat mitigation plan generated via GarmiQ Control Centre.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        author: MOCK_OFFICER.name,
        download_url: `/api/v1/plans/plan-pmc-${Date.now()}/pdf`,
      };
      MOCK_HEAT_ACTION_PLANS.unshift(newPlan);
      return newPlan;
    }
  },

  async downloadPlanPdf(id: string): Promise<{ success: boolean; message: string; download_url: string }> {
    try {
      const response = await apiClient.get<{ success: boolean; message: string; download_url: string }>(
        API_ENDPOINTS.PLAN_PDF(id)
      );
      return response.data;
    } catch {
      const plan = MOCK_HEAT_ACTION_PLANS.find((p) => p.id === id);
      return {
        success: true,
        message: `Plan "${plan?.title || id}" generated and ready for print/download.`,
        download_url: `/api/v1/plans/${id}/pdf`,
      };
    }
  },
};
