import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wardService } from '../services/wardService';
import { forecastService } from '../services/forecastService';
import { rankingService } from '../services/rankingService';
import { telemetryService } from '../services/telemetryService';
import { reportService } from '../services/reportService';
import { alertService } from '../services/alertService';
import { simulationService } from '../services/simulationService';
import { planService } from '../services/planService';
import { policyService } from '../services/policyService';
import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import { PUNE_MUNICIPAL_GEOJSON } from '../mocks/puneGeoJson';
import { MunicipalReportStatus, SimulationRequest, HeatActionPlan } from '../types';
import { useDashboardStore } from '../store/useDashboardStore';

export const QUERY_KEYS = {
  WARDS: 'wards',
  WARD_DETAIL: (id: string) => ['ward', id],
  WARD_EXPLAIN: (id: string) => ['ward_explain', id],
  WARD_FORECAST: (id: string) => ['ward_forecast', id],
  HEATMAP: 'heatmap',
  RANKINGS: 'rankings',
  TELEMETRY: 'telemetry',
  REPORTS: 'reports',
  ALERTS: 'alerts',
  SIMULATION: (id: string) => ['simulation', id],
  PLANS: 'plans',
  PLAN_DETAIL: (id: string) => ['plan', id],
  POLICY: (q: string) => ['policy', q],
};

// Wards
export function useWards(params?: { search?: string; risk?: string }) {
  return useQuery({
    queryKey: [QUERY_KEYS.WARDS, params],
    queryFn: () => wardService.getWards(params),
    staleTime: 60 * 1000,
  });
}

export function useWard(id: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.WARD_DETAIL(id || ''),
    queryFn: () => (id ? wardService.getWardById(id) : Promise.reject('No ward ID')),
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}

export function useWardExplanation(id: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.WARD_EXPLAIN(id || ''),
    queryFn: () => (id ? wardService.getWardRiskExplanation(id) : Promise.reject('No ward ID')),
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}

export function useWardForecast(id: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.WARD_FORECAST(id || ''),
    queryFn: () => (id ? forecastService.getWardForecast(id) : Promise.reject('No ward ID')),
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}

// Map GeoJSON
export function useHeatmapGeoJson() {
  return useQuery({
    queryKey: [QUERY_KEYS.HEATMAP],
    queryFn: async () => {
      try {
        const res = await apiClient.get(API_ENDPOINTS.HEATMAP_GEOJSON);
        return res.data;
      } catch {
        return PUNE_MUNICIPAL_GEOJSON;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Rankings
export function useRiskRankings() {
  return useQuery({
    queryKey: [QUERY_KEYS.RANKINGS],
    queryFn: () => rankingService.getRiskRankings(),
    staleTime: 60 * 1000,
  });
}

// Live Telemetry
export function useLiveTelemetry() {
  const isPolling = useDashboardStore((s) => s.isLivePollingActive);
  const intervalSec = useDashboardStore((s) => s.telemetryPollingIntervalSec);
  const recordRefresh = useDashboardStore((s) => s.recordTelemetryRefresh);

  return useQuery({
    queryKey: [QUERY_KEYS.TELEMETRY],
    queryFn: async () => {
      const data = await telemetryService.getLiveTelemetry();
      recordRefresh();
      return data;
    },
    refetchInterval: isPolling ? intervalSec * 1000 : false,
    staleTime: 10 * 1000,
  });
}

// Reports
export function useMunicipalReports(params?: { status?: string; ward_id?: string }) {
  return useQuery({
    queryKey: [QUERY_KEYS.REPORTS, params],
    queryFn: () => reportService.getMunicipalReports(params),
    staleTime: 30 * 1000,
  });
}

export function useUpdateReportStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: MunicipalReportStatus; notes?: string }) =>
      reportService.updateReportStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REPORTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WARDS] });
    },
  });
}

// Alerts
export function useMunicipalAlerts() {
  return useQuery({
    queryKey: [QUERY_KEYS.ALERTS],
    queryFn: () => alertService.getMunicipalAlerts(),
    staleTime: 30 * 1000,
  });
}

export function useApproveAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      alertService.approveAlert(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ALERTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WARDS] });
    },
  });
}

export function useRejectAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      alertService.rejectAlert(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ALERTS] });
    },
  });
}

// Interventions & Simulation
export function useRunSimulation() {
  return useMutation({
    mutationFn: (payload: SimulationRequest) => simulationService.runSimulation(payload),
  });
}

// Heat Action Plans
export function useHeatActionPlans() {
  return useQuery({
    queryKey: [QUERY_KEYS.PLANS],
    queryFn: () => planService.getHeatActionPlans(),
    staleTime: 60 * 1000,
  });
}

export function useHeatActionPlan(id: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.PLAN_DETAIL(id || ''),
    queryFn: () => (id ? planService.getPlanById(id) : Promise.reject('No plan ID')),
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}

export function useCreateHeatActionPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<HeatActionPlan>) => planService.createHeatActionPlan(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PLANS] });
    },
  });
}

export function useDownloadPlanPdf() {
  return useMutation({
    mutationFn: (id: string) => planService.downloadPlanPdf(id),
  });
}

// Policy RAG
export function usePolicySearch() {
  return useMutation({
    mutationFn: (query: string) => policyService.searchPolicyKnowledge(query),
  });
}
