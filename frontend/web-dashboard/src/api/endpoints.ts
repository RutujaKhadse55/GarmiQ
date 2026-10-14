export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',

  // Wards & Risk
  WARDS: '/wards',
  WARD_DETAILS: (id: string) => `/wards/${id}`,
  WARD_EXPLAIN: (id: string) => `/wards/${id}/explain`,
  WARD_FORECAST: (id: string) => `/forecast/${id}`,

  // Risk & Map
  HEAT_RISK: '/heat-risk',
  HEATMAP_GEOJSON: '/heatmap',
  RANKINGS: '/rankings',

  // Telemetry & Sensors
  TELEMETRY_LIVE: '/telemetry/live',
  SENSOR_DETAILS: (id: string) => `/telemetry/sensors/${id}`,

  // Citizen Reports
  REPORTS: '/reports',
  REPORT_DETAILS: (id: string) => `/reports/${id}`,
  REPORT_UPDATE_STATUS: (id: string) => `/reports/${id}/status`,

  // Alerts
  ALERTS: '/alerts',
  ALERT_DETAILS: (id: string) => `/alerts/${id}`,
  ALERT_APPROVE: (id: string) => `/alerts/${id}/approve`,
  ALERT_REJECT: (id: string) => `/alerts/${id}/reject`,

  // Interventions & Simulation
  SIMULATE: '/simulate',
  SIMULATION_STATUS: (id: string) => `/simulations/${id}`,

  // Heat Action Plans
  PLANS: '/plans',
  PLAN_DETAILS: (id: string) => `/plans/${id}`,
  PLAN_PDF: (id: string) => `/plans/${id}/pdf`,

  // Policy & Guidelines (RAG)
  POLICY_SEARCH: '/policy/search',
} as const;
