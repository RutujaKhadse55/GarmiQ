export type HeatRiskLevel = 'VERY_LOW' | 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH' | 'EXTREME';

export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface LocationCoords {
  lat: number;
  lon: number;
  address?: string;
  ward_id?: string;
  ward_name?: string;
}

export interface HeatRiskInfo {
  location: LocationCoords;
  heat_index_celsius: number;
  wet_bulb_celsius: number;
  air_temp_celsius: number;
  humidity_pct: number;
  risk_level: HeatRiskLevel;
  alert_level: string; // e.g. "Red Alert", "Orange Warning"
  advisory: string;
  safe_hours: string[]; // e.g. ["06:00 - 10:00", "18:00 - 21:00"]
  avoid_hours: string[]; // e.g. ["11:00 - 16:30"]
  last_updated: string;
  is_cached?: boolean;
}

export type CoolingPointType = 'clinic' | 'water_point' | 'shelter' | 'park';

export interface CoolingPoint {
  id: string;
  name: string;
  type: CoolingPointType;
  address: string;
  lat: number;
  lon: number;
  distance_km: number;
  distance_meters: number;
  is_open: boolean;
  operating_hours: string;
  amenities: string[];
  capacity_status?: 'Available' | 'Crowded' | 'Full';
  phone?: string;
  verified?: boolean;
}

export interface Ward {
  id: string;
  code: string;
  name: string;
  city: string;
  current_heat_index: number;
  wet_bulb_celsius: number;
  risk_level: HeatRiskLevel;
  vulnerability_score: number; // 0 - 100
  safe_hours: string[];
  avoid_hours: string[];
  lat: number;
  lon: number;
  cooling_points_count: number;
}

export interface HourlyForecast {
  time: string; // e.g. "09:00"
  temp_celsius: number;
  heat_index_celsius: number;
  risk_level: HeatRiskLevel;
  is_safe: boolean;
}

export interface WardForecast {
  ward_id: string;
  ward_name: string;
  date: string;
  max_temp: number;
  min_temp: number;
  hourly: HourlyForecast[];
  daily_advisory: string;
}

export type ReportType = 'hot_spot' | 'no_shade' | 'no_water' | 'vulnerable_person';

export interface ReportSubmission {
  id: string;
  issue_type: ReportType;
  lat: number;
  lon: number;
  location_name?: string;
  felt_heat: number; // 1 to 5
  description?: string;
  photo_url?: string;
  status: 'pending_sync' | 'submitted' | 'under_review' | 'resolved';
  created_at: string;
  reference_number?: string;
}

export interface SafeRouteRequest {
  origin: { lat: number; lon: number; name?: string };
  destination: { lat: number; lon: number; name?: string };
  mode: 'walk' | 'bike';
}

export interface SafeRouteResponse {
  route_id: string;
  mode: 'walk' | 'bike';
  distance_km: number;
  duration_mins: number;
  shade_score: number; // 0 to 100
  risk_level: HeatRiskLevel;
  summary: string;
  advisory: string;
  waypoints: Array<[number, number]>; // [lon, lat] for mapping
}

export interface ChatCitation {
  document: string;
  page?: number | string;
  url?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: ChatCitation[];
  status?: 'sending' | 'sent' | 'error';
}

export interface HeatAlert {
  id: string;
  title: string;
  severity: AlertSeverity;
  issued_at: string;
  valid_until: string;
  affected_wards: string[];
  description: string;
  recommendations: string[];
  is_read?: boolean;
}

export interface SubscriberRequest {
  phone: string;
  channel: 'whatsapp' | 'sms';
  ward_id?: string;
  consent: boolean;
}
