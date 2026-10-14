import apiClient from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import { MunicipalWard, WardRiskExplanation } from '../types';
import { MOCK_MUNICIPAL_WARDS, MOCK_WARD_EXPLANATIONS } from '../mocks/fixtures';

export const wardService = {
  async getWards(params?: { search?: string; risk?: string }): Promise<MunicipalWard[]> {
    try {
      const response = await apiClient.get<MunicipalWard[]>(API_ENDPOINTS.WARDS, {
        params,
      });
      return response.data;
    } catch {
      let filtered = [...MOCK_MUNICIPAL_WARDS];
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (w) =>
            w.name.toLowerCase().includes(q) ||
            w.code.toLowerCase().includes(q) ||
            w.id.toLowerCase().includes(q)
        );
      }
      if (params?.risk && params.risk !== 'ALL') {
        filtered = filtered.filter((w) => w.risk_level === params.risk);
      }
      return filtered;
    }
  },

  async getWardById(id: string): Promise<MunicipalWard> {
    try {
      const response = await apiClient.get<MunicipalWard>(API_ENDPOINTS.WARD_DETAILS(id));
      return response.data;
    } catch {
      const found = MOCK_MUNICIPAL_WARDS.find((w) => w.id === id);
      if (!found) throw new Error(`Ward with ID ${id} not found.`);
      return found;
    }
  },

  async getWardRiskExplanation(id: string): Promise<WardRiskExplanation> {
    try {
      const response = await apiClient.get<WardRiskExplanation>(API_ENDPOINTS.WARD_EXPLAIN(id));
      return response.data;
    } catch {
      const explanation = MOCK_WARD_EXPLANATIONS[id];
      if (explanation) return explanation;

      const ward = MOCK_MUNICIPAL_WARDS.find((w) => w.id === id) || MOCK_MUNICIPAL_WARDS[0];
      return {
        ward_id: ward.id,
        ward_name: ward.name,
        risk_level: ward.risk_level,
        base_score: 52.0,
        final_score: ward.vulnerability_score,
        primary_driver: `Built-up Surface (${ward.built_up_pct}%) & Tree Canopy (${ward.tree_canopy_pct}%)`,
        summary: `${ward.name} displays a vulnerability score of ${ward.vulnerability_score}/100. Factors include ${ward.built_up_pct}% impervious surface cover and ${ward.tree_canopy_pct}% tree canopy shade.`,
        features: [
          {
            feature_key: 'built_up',
            display_name: 'Built-up Surface (%)',
            feature_value: `${ward.built_up_pct}%`,
            shap_value: (ward.built_up_pct - 60) * 0.3,
            contribution_direction: ward.built_up_pct > 65 ? 'increases_risk' : 'decreases_risk',
            description: 'Reflective and thermal storage properties of building structures and road surfaces.'
          },
          {
            feature_key: 'canopy',
            display_name: 'Tree Canopy Cover (%)',
            feature_value: `${ward.tree_canopy_pct}%`,
            shap_value: -(ward.tree_canopy_pct - 15) * 0.4,
            contribution_direction: ward.tree_canopy_pct < 15 ? 'increases_risk' : 'decreases_risk',
            description: 'Vegetative shading and evapotranspiration cooling buffer.'
          },
          {
            feature_key: 'elderly',
            display_name: 'Elderly Demographic Ratio (%)',
            feature_value: `${ward.elderly_ratio_pct}%`,
            shap_value: (ward.elderly_ratio_pct - 12) * 0.5,
            contribution_direction: 'increases_risk',
            description: 'Age-related thermal vulnerability and physiological heat intolerance.'
          }
        ],
        timestamp: new Date().toISOString()
      };
    }
  },
};
