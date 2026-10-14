import { describe, it, expect } from 'vitest';
import { MOCK_WARDS, MOCK_COOLING_POINTS, getHeatRiskAt } from '@garmiq/api-client';

describe('GarmiQ Citizen App Domain & State Tests', () => {
  it('loads mock wards and cooling points accurately', () => {
    expect(MOCK_WARDS.length).toBeGreaterThan(0);
    const firstWard = MOCK_WARDS[0];
    expect(firstWard.name).toBe('Connaught Place & Central Ward');
    expect(firstWard.current_heat_index).toBeGreaterThan(35);
    expect(firstWard.safe_hours.length).toBeGreaterThan(0);
    expect(firstWard.avoid_hours.length).toBeGreaterThan(0);
  });

  it('provides verified cooling facilities across wards', () => {
    expect(MOCK_COOLING_POINTS.length).toBeGreaterThanOrEqual(4);
    const shelter = MOCK_COOLING_POINTS.find((p) => p.type === 'shelter');
    expect(shelter).toBeDefined();
    expect(shelter?.is_open).toBe(true);
    expect(shelter?.amenities).toContain('Air Conditioning');
  });

  it('calculates dynamic heat risk at coordinates', async () => {
    const risk = await getHeatRiskAt(28.6304, 77.2177);
    expect(risk).toBeDefined();
    expect(risk.heat_index_celsius).toBeGreaterThan(30);
    expect(risk.wet_bulb_celsius).toBeGreaterThan(20);
    expect(['LOW', 'MODERATE', 'HIGH', 'VERY_HIGH', 'EXTREME']).toContain(risk.risk_level);
  });
});
