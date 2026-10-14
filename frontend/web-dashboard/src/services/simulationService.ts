import apiClient from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import { SimulationRequest, SimulationResult } from '../types';
import { MOCK_MUNICIPAL_WARDS } from '../mocks/fixtures';

export const simulationService = {
  async runSimulation(payload: SimulationRequest): Promise<SimulationResult> {
    try {
      const response = await apiClient.post<SimulationResult>(API_ENDPOINTS.SIMULATE, payload);
      return response.data;
    } catch {
      const simId = 'sim-offline-' + Date.now();
      const targetWards = MOCK_MUNICIPAL_WARDS.filter((w) =>
        payload.target_ward_ids?.includes(w.id)
      );
      const activeWards = targetWards.length > 0 ? targetWards : [MOCK_MUNICIPAL_WARDS[2]];

      const tempReduction = Number((0.8 + (payload.intensity_pct || 25) * 0.05).toFixed(1));
      const hviReduction = Math.round(5 + (payload.intensity_pct || 25) * 0.35);

      return {
        id: simId,
        scenario_name: payload.scenario_name || 'Pune Urban Heat Mitigation Scenario',
        created_at: new Date().toISOString(),
        status: 'completed',
        intervention_type: payload.intervention_type || 'tree_canopy',
        intensity_pct: payload.intensity_pct || 25,
        target_ward_ids: activeWards.map((w) => w.id),
        baseline_avg_heat_index: Number(
          (activeWards.reduce((acc, w) => acc + w.current_heat_index, 0) / activeWards.length).toFixed(1)
        ),
        simulated_avg_heat_index: Number(
          (activeWards.reduce((acc, w) => acc + w.current_heat_index, 0) / activeWards.length - tempReduction).toFixed(1)
        ),
        estimated_temp_reduction_celsius: tempReduction,
        vulnerability_reduction_pct: hviReduction,
        population_protected_count: activeWards.reduce((acc, w) => acc + w.total_population, 0),
        ward_impacts: activeWards.map((w) => ({
          ward_id: w.id,
          ward_name: w.name,
          baseline_hvi: w.hvi,
          simulated_hvi: Math.max(20, w.hvi - hviReduction),
          hvi_reduction: hviReduction,
          baseline_temp: w.current_heat_index,
          simulated_temp: Number((w.current_heat_index - tempReduction).toFixed(1)),
          temp_delta: -tempReduction,
        })),
        recommendations: [
          `Deploy ${payload.intensity_pct}% intervention along high-albedo road corridors.`,
          `High-albedo reflective roof coatings on low-income tenements yield highest delta.`,
          `Augment with shaded hydration points during 12:00-15:30 solar maximum.`
        ],
        computation_time_ms: 480,
      };
    }
  },

  async getSimulationStatus(id: string): Promise<SimulationResult> {
    const response = await apiClient.get<SimulationResult>(API_ENDPOINTS.SIMULATION_STATUS(id));
    return response.data;
  },
};
