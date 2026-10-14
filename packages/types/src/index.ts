export type HeatRiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME_WARNING';

export interface HeatRiskInfo {
  location: { lat: number; lon: number };
  heat_index_celsius: number;
  risk_level: HeatRiskLevel;
  advisory: string;
}

export interface Alert {
  id: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  headline: string;
  issued_at: string;
}

export interface SafePlace {
  id: string;
  name: string;
  category: 'cooling_center' | 'water_station' | 'shaded_park' | 'medical_post';
  lat: number;
  lon: number;
  amenities: string[];
}
