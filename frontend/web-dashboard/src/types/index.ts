import {
  HeatRiskLevel,
  AlertSeverity,
  LocationCoords,
  HeatRiskInfo,
  CoolingPoint,
  Ward,
  HourlyForecast,
  WardForecast,
  ReportType
} from '@garmiq/types';

export type {
  HeatRiskLevel,
  AlertSeverity,
  LocationCoords,
  HeatRiskInfo,
  CoolingPoint,
  Ward,
  HourlyForecast,
  WardForecast,
  ReportType
};

// Officer / Auth types
export interface OfficerUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  badge_id: string;
  avatar_url?: string;
  permissions: string[];
}

export interface AuthResponse {
  token: string;
  user: OfficerUser;
}

// Extended Ward with municipal indicators
export interface MunicipalWard extends Ward {
  hvi: number; // Heat Vulnerability Index (0 - 100)
  lst_celsius: number; // Land Surface Temperature
  built_up_pct: number; // Impervious surface %
  vegetation_ndvi: number; // 0.0 to 1.0
  population_density: number; // people / km2
  total_population: number;
  elderly_ratio_pct: number; // % age 60+
  slum_population_pct: number;
  tree_canopy_pct: number;
  active_alerts_count: number;
  unresolved_reports_count: number;
  sensor_count: number;
}

// SHAP Feature Contribution explainability
export interface ShapFeature {
  feature_key: string;
  display_name: string;
  feature_value: string | number;
  shap_value: number; // Positive increases risk, negative decreases
  contribution_direction: 'increases_risk' | 'decreases_risk';
  description: string;
}

export interface WardRiskExplanation {
  ward_id: string;
  ward_name: string;
  risk_level: HeatRiskLevel;
  base_score: number;
  final_score: number;
  primary_driver: string;
  summary: string;
  features: ShapFeature[];
  timestamp: string;
}

// Intervention Simulator types
export type InterventionType =
  | 'tree_canopy'
  | 'cool_roofs'
  | 'misting_shade'
  | 'cooling_shelters'
  | 'water_kiosks';

export interface SimulationRequest {
  scenario_name: string;
  target_ward_ids: string[];
  intervention_type: InterventionType;
  intensity_pct: number; // 10% to 50%
  simulation_period_days: number;
  budget_inr_lakhs?: number;
}

export interface WardSimulationDelta {
  ward_id: string;
  ward_name: string;
  baseline_hvi: number;
  simulated_hvi: number;
  hvi_reduction: number;
  baseline_temp: number;
  simulated_temp: number;
  temp_delta: number;
}

export interface SimulationResult {
  id: string;
  scenario_name: string;
  created_at: string;
  status: 'idle' | 'validating' | 'queued' | 'running' | 'completed' | 'failed';
  intervention_type: InterventionType;
  intensity_pct: number;
  target_ward_ids: string[];
  baseline_avg_heat_index: number;
  simulated_avg_heat_index: number;
  estimated_temp_reduction_celsius: number;
  vulnerability_reduction_pct: number;
  population_protected_count: number;
  ward_impacts: WardSimulationDelta[];
  recommendations: string[];
  computation_time_ms: number;
}

// Rankings
export interface RiskRankingItem {
  rank: number;
  ward_id: string;
  ward_name: string;
  code: string;
  risk_level: HeatRiskLevel;
  vulnerability_score: number;
  heat_index: number;
  lst_celsius: number;
  tree_canopy_pct: number;
  population: number;
  key_risk_driver: string;
  recommended_intervention: string;
  estimated_benefit: string;
  cooling_centres_count: number;
}

// Telemetry & Sensors
export type SensorStatus = 'online' | 'offline' | 'warning';

export interface SensorTelemetryPoint {
  timestamp: string;
  temp_celsius: number;
  humidity_pct: number;
  heat_index_celsius: number;
}

export interface SensorDevice {
  id: string;
  hardware_id: string; // e.g. "ESP32-PMC-S04"
  hardware_model: string;
  ward_id: string;
  ward_name: string;
  location_name: string;
  lat: number;
  lon: number;
  temperature_celsius: number;
  humidity_pct: number;
  heat_index_celsius: number;
  battery_pct: number;
  rssi_dbm: number;
  status: SensorStatus;
  warning_reason?: string;
  last_reading_at: string;
  is_stale: boolean;
  history: SensorTelemetryPoint[];
}

// Municipal Citizen Reports
export type MunicipalReportStatus = 'submitted' | 'under_review' | 'in_progress' | 'resolved' | 'rejected';
export type MunicipalReportSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface MunicipalReport {
  id: string;
  reference_no: string;
  issue_type: ReportType;
  ward_id: string;
  ward_name: string;
  location_name: string;
  lat: number;
  lon: number;
  felt_heat: number;
  severity: MunicipalReportSeverity;
  status: MunicipalReportStatus;
  description: string;
  photo_url?: string;
  created_at: string;
  updated_at: string;
  officer_notes?: string;
  assigned_officer?: string;
}

// Municipal Alert Approval
export type MunicipalAlertStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'EXPIRED';

export interface MunicipalAlert {
  id: string;
  title: string;
  severity: AlertSeverity;
  status: MunicipalAlertStatus;
  issued_at: string;
  valid_until: string;
  affected_ward_ids: string[];
  affected_ward_names: string[];
  source: string;
  heat_index_forecast: number;
  description: string;
  recommendations: string[];
  created_by: string;
  reviewed_by?: string;
  reviewed_at?: string;
  review_notes?: string;
  approved_by?: string;
  approved_at?: string;
}

// Heat Action Plans
export type PlanStatus = 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'PUBLISHED';

export interface HeatActionPlan {
  id: string;
  title: string;
  year: number;
  planning_cycle: string;
  city: string;
  status: PlanStatus;
  target_wards: string[];
  vulnerability_focus: string;
  budget_lakhs: number;
  key_pillars: string[];
  summary: string;
  created_at: string;
  updated_at: string;
  author: string;
  download_url?: string;
}

// Policy & Guidelines RAG
export interface PolicyCitation {
  document: string;
  section: string;
  page?: number | string;
  url?: string;
  excerpt: string;
}

export interface PolicySearchResponse {
  query: string;
  answer: string;
  confidence_score: number;
  citations: PolicyCitation[];
  official_framework: string;
  applicable_triggers: string[];
}
