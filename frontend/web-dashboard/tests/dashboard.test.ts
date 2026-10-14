import { describe, it, expect, beforeEach } from 'vitest';
import { authService } from '../src/services/authService';
import { wardService } from '../src/services/wardService';
import { simulationService } from '../src/services/simulationService';
import { reportService } from '../src/services/reportService';
import { alertService } from '../src/services/alertService';
import { planService } from '../src/services/planService';
import { policyService } from '../src/services/policyService';
import { telemetryService } from '../src/services/telemetryService';
import { MOCK_OFFICER } from '../src/mocks/fixtures';

const storage: Record<string, string> = {};
if (typeof globalThis.localStorage === 'undefined') {
  (globalThis as any).localStorage = {
    getItem: (k: string) => storage[k] || null,
    setItem: (k: string, v: string) => { storage[k] = String(v); },
    removeItem: (k: string) => { delete storage[k]; },
    clear: () => { Object.keys(storage).forEach((k) => delete storage[k]); },
  };
}

describe('GarmiQ Municipal Dashboard Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('1. Authentication & Protected Routes', () => {
    it('authenticates municipal officer and creates session token', async () => {
      const response = await authService.login('aarti.deshmukh@pmc.gov.in', 'pmc2026');
      expect(response.token).toBeDefined();
      expect(response.user.name).toBe('Dr. Aarti Deshmukh');
      expect(response.user.role).toContain('Municipal Health Officer');
      expect(authService.isAuthenticated()).toBe(true);
    });

    it('clears session on logout', async () => {
      await authService.login('aarti.deshmukh@pmc.gov.in', 'pmc2026');
      expect(authService.isAuthenticated()).toBe(true);
      authService.logout();
      expect(authService.getToken()).toBeFalsy();
    });
  });

  describe('2. Wards & SHAP Explainability', () => {
    it('fetches all monitored Pune wards with correct HVI scores', async () => {
      const wards = await wardService.getWards();
      expect(wards.length).toBeGreaterThanOrEqual(10);
      const kasba = wards.find((w) => w.id === 'ward-pune-03');
      expect(kasba).toBeDefined();
      expect(kasba?.risk_level).toBe('VERY_HIGH');
      expect(kasba?.hvi).toBeGreaterThan(85);
      expect(kasba?.built_up_pct).toBeGreaterThan(90);
    });

    it('filters wards by risk level and search keyword', async () => {
      const highWards = await wardService.getWards({ risk: 'HIGH' });
      expect(highWards.every((w) => w.risk_level === 'HIGH')).toBe(true);

      const searched = await wardService.getWards({ search: 'Kasba' });
      expect(searched.length).toBe(1);
      expect(searched[0].code).toBe('PMC-03');
    });

    it('retrieves SHAP feature contributions for ward explainability', async () => {
      const explain = await wardService.getWardRiskExplanation('ward-pune-03');
      expect(explain).toBeDefined();
      expect(explain.ward_id).toBe('ward-pune-03');
      expect(explain.features.length).toBeGreaterThanOrEqual(3);
      expect(explain.features.some((f) => f.shap_value > 0)).toBe(true);
      expect(explain.features.some((f) => f.shap_value < 0)).toBe(true);
    });
  });

  describe('3. Intervention Simulator', () => {
    it('executes cool roof simulation and projects temperature delta', async () => {
      const result = await simulationService.runSimulation({
        scenario_name: 'Peth Core Cool Roofs Scenario',
        target_ward_ids: ['ward-pune-03', 'ward-pune-08'],
        intervention_type: 'cool_roofs',
        intensity_pct: 35,
        simulation_period_days: 14,
        budget_inr_lakhs: 150,
      });

      expect(result.status).toBe('completed');
      expect(result.estimated_temp_reduction_celsius).toBeGreaterThan(1.0);
      expect(result.vulnerability_reduction_pct).toBeGreaterThan(10);
      expect(result.ward_impacts.length).toBe(2);
      expect(result.simulated_avg_heat_index).toBeLessThan(result.baseline_avg_heat_index);
      expect(result.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('4. Telemetry & Sensor Monitoring', () => {
    it('fetches live ESP32 IoT nodes and provides status breakdown', async () => {
      const data = await telemetryService.getLiveTelemetry();
      expect(data.sensors.length).toBeGreaterThanOrEqual(5);
      expect(data.summary.total).toBe(data.sensors.length);
      expect(data.summary.online).toBeGreaterThan(0);
      expect(data.sensors.some((s) => s.status === 'warning')).toBe(true);
      expect(data.sensors.some((s) => s.status === 'offline')).toBe(true);
    });
  });

  describe('5. Citizen Reports Triage', () => {
    it('retrieves inbound citizen reports and updates status', async () => {
      const data = await reportService.getMunicipalReports();
      expect(data.reports.length).toBeGreaterThan(0);
      const first = data.reports[0];

      const updated = await reportService.updateReportStatus(
        first.id,
        'in_progress',
        'Field emergency team dispatched with water supplies.'
      );
      expect(updated.status).toBe('in_progress');
      expect(updated.officer_notes).toContain('dispatched');
    });
  });

  describe('6. Heat Alert Approval Queue', () => {
    it('approves pending municipal alert with review audit', async () => {
      const initial = await alertService.getMunicipalAlerts();
      const pending = initial.alerts.find((a) => a.status === 'PENDING_APPROVAL');
      expect(pending).toBeDefined();

      if (pending) {
        const approved = await alertService.approveAlert(pending.id, 'Authorized for mass public SMS.');
        expect(approved.status).toBe('APPROVED');
        expect(approved.reviewed_by).toBe(MOCK_OFFICER.name);
      }
    });

    it('rejects alert with reason notes', async () => {
      const initial = await alertService.getMunicipalAlerts();
      const pending = initial.alerts.find((a) => a.status === 'PENDING_APPROVAL');
      if (pending) {
        const rejected = await alertService.rejectAlert(pending.id, 'Threshold criteria departure < 4.5C');
        expect(rejected.status).toBe('REJECTED');
      }
    });
  });

  describe('7. Heat Action Plans Lifecycle', () => {
    it('creates new municipal action plan and verifies PDF readiness', async () => {
      const newPlan = await planService.createHeatActionPlan({
        title: 'Pune Eastern Industrial Belt Heat Safety Plan 2026',
        year: 2026,
        planning_cycle: 'Industrial Zone Preparedness',
        city: 'Pune',
        target_wards: ['Hadapsar', 'Yerwada'],
        budget_lakhs: 180,
      });

      expect(newPlan.id).toBeDefined();
      expect(newPlan.status).toBe('DRAFT');

      const pdf = await planService.downloadPlanPdf(newPlan.id);
      expect(pdf.success).toBe(true);
      expect(pdf.download_url).toBeDefined();
    });
  });

  describe('8. Policy & Guidelines RAG Search', () => {
    it('retrieves grounded answer and official citations for heat queries', async () => {
      const res = await policyService.searchPolicyKnowledge(
        'What actions are recommended for high-risk wards?'
      );

      expect(res.answer).toBeDefined();
      expect(res.answer).toContain('high-risk');
      expect(res.citations.length).toBeGreaterThan(0);
      expect(res.citations[0].document).toContain('Pune Municipal Corporation Heat Action Plan');
      expect(res.citations[0].page).toBeDefined();
      expect(res.citations[0].excerpt.length).toBeGreaterThan(20);
    });
  });
});
