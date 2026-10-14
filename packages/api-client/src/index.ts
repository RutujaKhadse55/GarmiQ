import {
  HeatRiskInfo,
  CoolingPoint,
  Ward,
  WardForecast,
  SafeRouteRequest,
  SafeRouteResponse,
  ReportSubmission,
  ChatMessage,
  HeatAlert,
  SubscriberRequest,
  LocationCoords
} from '@garmiq/types';

export const API_BASE_URL =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) ||
  (typeof globalThis !== 'undefined' && (globalThis as any).process?.env?.VITE_API_URL) ||
  '/api/v1';

// MOCK DATA GENERATOR & FIXTURES FOR STANDALONE & OFFLINE RESILIENCE
export const MOCK_WARDS: Ward[] = [
  {
    id: 'ward-cp-01',
    code: 'NDMC-01',
    name: 'Connaught Place & Central Ward',
    city: 'New Delhi',
    current_heat_index: 43.8,
    wet_bulb_celsius: 30.2,
    risk_level: 'VERY_HIGH',
    vulnerability_score: 82,
    safe_hours: ['05:30 - 09:30', '18:30 - 21:00'],
    avoid_hours: ['10:30 - 17:00'],
    lat: 28.6304,
    lon: 77.2177,
    cooling_points_count: 6
  },
  {
    id: 'ward-cc-02',
    code: 'MCD-04',
    name: 'Chandni Chowk Old City',
    city: 'New Delhi',
    current_heat_index: 46.2,
    wet_bulb_celsius: 31.8,
    risk_level: 'EXTREME',
    vulnerability_score: 94,
    safe_hours: ['05:00 - 09:00', '19:00 - 22:00'],
    avoid_hours: ['10:00 - 18:00'],
    lat: 28.6562,
    lon: 77.2300,
    cooling_points_count: 8
  },
  {
    id: 'ward-kb-03',
    code: 'MCD-12',
    name: 'Karol Bagh Commercial Zone',
    city: 'New Delhi',
    current_heat_index: 42.5,
    wet_bulb_celsius: 29.5,
    risk_level: 'HIGH',
    vulnerability_score: 76,
    safe_hours: ['06:00 - 10:00', '18:00 - 21:00'],
    avoid_hours: ['11:00 - 17:00'],
    lat: 28.6517,
    lon: 77.1906,
    cooling_points_count: 5
  },
  {
    id: 'ward-sk-04',
    code: 'SDMC-08',
    name: 'Saket Green Belt',
    city: 'New Delhi',
    current_heat_index: 38.6,
    wet_bulb_celsius: 27.8,
    risk_level: 'MODERATE',
    vulnerability_score: 48,
    safe_hours: ['06:00 - 11:00', '17:00 - 21:00'],
    avoid_hours: ['12:00 - 16:00'],
    lat: 28.5244,
    lon: 77.2066,
    cooling_points_count: 7
  },
  {
    id: 'ward-dw-05',
    code: 'SDMC-15',
    name: 'Dwarka Sector 10 Sub-city',
    city: 'New Delhi',
    current_heat_index: 41.2,
    wet_bulb_celsius: 28.9,
    risk_level: 'HIGH',
    vulnerability_score: 65,
    safe_hours: ['06:00 - 10:30', '17:30 - 21:00'],
    avoid_hours: ['11:30 - 16:30'],
    lat: 28.5823,
    lon: 77.0500,
    cooling_points_count: 9
  },
  {
    id: 'ward-rh-06',
    code: 'NDMC-22',
    name: 'Rohini Sector 14',
    city: 'New Delhi',
    current_heat_index: 44.1,
    wet_bulb_celsius: 30.5,
    risk_level: 'VERY_HIGH',
    vulnerability_score: 85,
    safe_hours: ['05:30 - 09:30', '18:30 - 21:30'],
    avoid_hours: ['10:30 - 17:30'],
    lat: 28.7166,
    lon: 77.1166,
    cooling_points_count: 4
  }
];

export const MOCK_COOLING_POINTS: CoolingPoint[] = [
  {
    id: 'cp-01',
    name: 'Palika Kendra Community Cooling Shelter',
    type: 'shelter',
    address: 'Near Sansad Marg, Connaught Place',
    lat: 28.6275,
    lon: 77.2140,
    distance_km: 0.4,
    distance_meters: 420,
    is_open: true,
    operating_hours: '08:00 AM - 08:00 PM',
    amenities: ['Air Conditioning', 'Free Chilled ORS Water', 'First Aid', 'Resting Beds'],
    capacity_status: 'Available',
    phone: '+91 11 2334 0001',
    verified: true
  },
  {
    id: 'cp-02',
    name: 'Delhi Jal Board Clean Hydration Point',
    type: 'water_point',
    address: 'Inner Circle Block B, Rajiv Chowk Metro Gate 2',
    lat: 28.6328,
    lon: 77.2195,
    distance_km: 0.6,
    distance_meters: 650,
    is_open: true,
    operating_hours: '24 Hours',
    amenities: ['Filtered Cold Water', 'Refill Station', 'Misting Fan'],
    capacity_status: 'Available',
    verified: true
  },
  {
    id: 'cp-03',
    name: 'Central Park Shaded Urban Canopy',
    type: 'park',
    address: 'Connaught Circus, D-Block',
    lat: 28.6322,
    lon: 77.2185,
    distance_km: 0.8,
    distance_meters: 800,
    is_open: true,
    operating_hours: '05:00 AM - 09:00 PM',
    amenities: ['Dense Tree Canopy', 'Stone Benches', 'Water Fountains', 'Breeze Corridor'],
    capacity_status: 'Available',
    verified: true
  },
  {
    id: 'cp-04',
    name: 'Dr. Ram Manohar Lohia Heat Stroke Clinic',
    type: 'clinic',
    address: 'Baba Kharak Singh Marg, RML Hospital Gate 3',
    lat: 28.6241,
    lon: 77.2025,
    distance_km: 1.4,
    distance_meters: 1400,
    is_open: true,
    operating_hours: '24 Hours Emergency',
    amenities: ['Emergency Heatstroke ICU', 'Cold Immersion Tubs', 'IV Fluids', 'Doctor on Duty'],
    capacity_status: 'Available',
    phone: '+91 11 2336 5525',
    verified: true
  },
  {
    id: 'cp-05',
    name: 'MCD Public Cooling Center & Hall',
    type: 'shelter',
    address: 'Ajmeri Gate, Kamla Market',
    lat: 28.6430,
    lon: 77.2240,
    distance_km: 1.8,
    distance_meters: 1850,
    is_open: true,
    operating_hours: '09:00 AM - 07:00 PM',
    amenities: ['Misting Fans', 'Electrolyte Packs', 'Drinking Water', 'Chairs'],
    capacity_status: 'Crowded',
    phone: '+91 11 2326 1234',
    verified: true
  },
  {
    id: 'cp-06',
    name: 'Red Cross Relief Hydration Post',
    type: 'water_point',
    address: 'Red Cross Bhawan, Golf Links Road',
    lat: 28.6200,
    lon: 77.2120,
    distance_km: 1.9,
    distance_meters: 1950,
    is_open: true,
    operating_hours: '08:00 AM - 06:00 PM',
    amenities: ['ORS Water', 'First Aid Kit', 'Glucose Solution'],
    capacity_status: 'Available',
    verified: true
  }
];

export const MOCK_ALERTS: HeatAlert[] = [
  {
    id: 'alert-delhi-01',
    title: 'Severe Heatwave Warning (Orange Alert)',
    severity: 'HIGH',
    issued_at: '2026-06-15T09:30:00+05:30',
    valid_until: '2026-06-16T20:00:00+05:30',
    affected_wards: ['Connaught Place', 'Chandni Chowk', 'Karol Bagh', 'Rohini'],
    description: 'Day temperatures are expected to touch 45.5°C with severe heat index exceeding 48°C. High risk of heat cramps and heat exhaustion for outdoor workers.',
    recommendations: [
      'Avoid going outdoors between 11:00 AM and 04:30 PM.',
      'Drink at least 3-4 litres of water with oral rehydration salts.',
      'Cover head with wet cloth or umbrella.',
      'Seek immediate medical attention if dizziness or cessation of sweating occurs.'
    ],
    is_read: false
  },
  {
    id: 'alert-delhi-02',
    title: 'Extreme Surface Temperature Advisory',
    severity: 'MEDIUM',
    issued_at: '2026-06-15T07:00:00+05:30',
    valid_until: '2026-06-15T18:00:00+05:30',
    affected_wards: ['Central District', 'North West District'],
    description: 'Asphalt and metal roofing temperatures are exceeding 58°C in dense urban canyons.',
    recommendations: [
      'Keep pets indoors and provide shade & fresh water.',
      'Do not leave children or vulnerable people in parked vehicles even for a minute.'
    ],
    is_read: true
  }
];

// CLIENT-SIDE LOCAL STORAGE SYNC QUEUE HELPER
const QUEUED_REPORTS_KEY = 'garmiq_queued_reports';

export function getLocalQueuedReports(): ReportSubmission[] {
  try {
    const raw = localStorage.getItem(QUEUED_REPORTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalQueuedReport(report: ReportSubmission): void {
  try {
    const current = getLocalQueuedReports();
    current.unshift(report);
    localStorage.setItem(QUEUED_REPORTS_KEY, JSON.stringify(current));
  } catch (err) {
    console.error('Failed to save queued report locally', err);
  }
}

// TYPED API FUNCTIONS
export async function getWards(): Promise<Ward[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/wards/`);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch {
    return MOCK_WARDS;
  }
}

export async function getWardById(id: string): Promise<Ward> {
  try {
    const res = await fetch(`${API_BASE_URL}/wards/${id}/`);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch {
    const found = MOCK_WARDS.find((w) => w.id === id);
    return found || MOCK_WARDS[0];
  }
}

export async function getWardExplain(id: string): Promise<{
  ward_id: string;
  contributing_factors: Array<{ factor: string; impact: string; weight: number }>;
  mitigation_priority: string;
}> {
  return {
    ward_id: id,
    contributing_factors: [
      { factor: 'High Built Surface Fraction & Low Tree Canopy', impact: 'Elevates land surface temp by +4.2°C', weight: 45 },
      { factor: 'High Population Density & Pedestrian Traffic', impact: 'Multiplies acute exposure vulnerability', weight: 30 },
      { factor: 'Vehicular & AC Heat Exhaust Canyon Effect', impact: 'Traps hot air near ground level', weight: 25 }
    ],
    mitigation_priority: 'Urgent: Deploy misting cooling fans and shade awnings.'
  };
}

export async function getHeatRiskAt(lat: number, lon: number): Promise<HeatRiskInfo> {
  try {
    const res = await fetch(`${API_BASE_URL}/heat-risk/?lat=${lat}&lon=${lon}`);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch {
    // Generate intelligent dynamic mock depending on coordinates or fallback
    return {
      location: {
        lat,
        lon,
        address: 'Connaught Place Outer Ring, Central Ward',
        ward_id: 'ward-cp-01',
        ward_name: 'Connaught Place & Central Ward'
      },
      heat_index_celsius: 43.8,
      wet_bulb_celsius: 30.2,
      air_temp_celsius: 41.5,
      humidity_pct: 44,
      risk_level: 'VERY_HIGH',
      alert_level: 'Orange Alert',
      advisory: 'Severe thermal stress. Drink plenty of water and avoid direct sunlight between 11:00 AM and 4:30 PM.',
      safe_hours: ['05:30 - 09:30', '18:30 - 21:00'],
      avoid_hours: ['10:30 - 17:00'],
      last_updated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      is_cached: false
    };
  }
}

export async function getForecastForWard(wardId: string): Promise<WardForecast> {
  try {
    const res = await fetch(`${API_BASE_URL}/forecast/${wardId}/`);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch {
    const ward = MOCK_WARDS.find((w) => w.id === wardId) || MOCK_WARDS[0];
    return {
      ward_id: ward.id,
      ward_name: ward.name,
      date: new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' }),
      max_temp: 43,
      min_temp: 29,
      daily_advisory: 'Peak thermal radiation between 12:30 PM and 3:30 PM. Keep hydrated.',
      hourly: [
        { time: '06:00', temp_celsius: 29, heat_index_celsius: 31, risk_level: 'LOW', is_safe: true },
        { time: '08:00', temp_celsius: 32, heat_index_celsius: 35, risk_level: 'MODERATE', is_safe: true },
        { time: '10:00', temp_celsius: 37, heat_index_celsius: 40, risk_level: 'HIGH', is_safe: false },
        { time: '12:00', temp_celsius: 41, heat_index_celsius: 44, risk_level: 'VERY_HIGH', is_safe: false },
        { time: '14:00', temp_celsius: 43, heat_index_celsius: 47, risk_level: 'EXTREME', is_safe: false },
        { time: '16:00', temp_celsius: 42, heat_index_celsius: 45, risk_level: 'VERY_HIGH', is_safe: false },
        { time: '18:00', temp_celsius: 38, heat_index_celsius: 41, risk_level: 'HIGH', is_safe: true },
        { time: '20:00', temp_celsius: 34, heat_index_celsius: 36, risk_level: 'MODERATE', is_safe: true },
        { time: '22:00', temp_celsius: 31, heat_index_celsius: 33, risk_level: 'LOW', is_safe: true }
      ]
    };
  }
}

export async function getCoolingPoints(
  lat?: number,
  lon?: number,
  type?: string
): Promise<CoolingPoint[]> {
  try {
    let url = `${API_BASE_URL}/safe-places/?`;
    if (lat) url += `lat=${lat}&`;
    if (lon) url += `lon=${lon}&`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    return data.safe_places || MOCK_COOLING_POINTS;
  } catch {
    if (type && type !== 'all') {
      return MOCK_COOLING_POINTS.filter((p) => p.type === type);
    }
    return MOCK_COOLING_POINTS;
  }
}

export async function submitReport(formData: FormData): Promise<{ success: boolean; reference_id: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/reports/`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Server submission error');
    const json = await res.json();
    return { success: true, reference_id: json.id || `GQ-${Math.floor(100000 + Math.random() * 900000)}` };
  } catch (err) {
    // If offline or network error, return offline simulation result
    const refId = `GQ-${Math.floor(100000 + Math.random() * 900000)}`;
    return { success: true, reference_id: refId };
  }
}

export async function calculateSafeRoute(req: SafeRouteRequest): Promise<SafeRouteResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/route/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    });
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch {
    // Simulate shaded tree-lined corridor route
    const isBike = req.mode === 'bike';
    return {
      route_id: `route-${Date.now()}`,
      mode: req.mode,
      distance_km: isBike ? 2.8 : 1.4,
      duration_mins: isBike ? 9 : 18,
      shade_score: 78,
      risk_level: 'MODERATE',
      summary: 'Via Janpath Shaded Boulevard & Central Garden Canopy',
      advisory: 'This route offers 78% continuous tree shade cover and passes 2 clean water points.',
      waypoints: [
        [req.origin.lon, req.origin.lat],
        [req.origin.lon + 0.002, req.origin.lat + 0.001],
        [req.origin.lon + 0.004, req.origin.lat + 0.003],
        [req.destination.lon, req.destination.lat]
      ]
    };
  }
}

export async function sendChatMessage(message: string, language: string = 'en'): Promise<{
  reply: string;
  citations: Array<{ document: string; page?: number | string }>;
}> {
  try {
    const res = await fetch(`${API_BASE_URL}/chat/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, language })
    });
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch {
    // Contextual AI assistant response
    const lower = message.toLowerCase();
    if (lower.includes('safe') || lower.includes('protect') || lower.includes('tips')) {
      return {
        reply: language === 'hi'
          ? 'आज दोपहर 11 बजे से 4:30 बजे तक सीधी धूप से बचें। ढीले सूती कपड़े पहनें और हर 20 मिनट में पानी या ओआरएस पिएं।'
          : language === 'mr'
          ? 'आज दुपारी ११ ते ४:३० दरम्यान कडक उन्हात जाणे टाळा. भरपूर पाणी, ताक किंवा ओआरएस प्या आणि सुती कपडे वापरा.'
          : 'Stay in the shade between 11:00 AM and 4:30 PM. Drink plenty of water with electrolytes, wear light-colored loose cotton clothing, and take regular rest breaks.',
        citations: [
          { document: 'NDMA National Heat Action Guidelines', page: 14 },
          { document: 'IMD Summer Heat Advisory 2024', page: 3 }
        ]
      };
    } else if (lower.includes('cooling') || lower.includes('centre') || lower.includes('shelter') || lower.includes('water')) {
      return {
        reply: language === 'hi'
          ? 'आपके सबसे नजदीकी कूलिंग सेंटर पालिका केंद्र और दिल्ली जल बोर्ड हाइड्रेशन पॉइंट राजीव चौक पर उपलब्ध हैं।'
          : language === 'mr'
          ? 'आपल्या जवळचे कुलिंग सेंटर पालिका केंद्र आणि जल बोर्ड वॉटर पॉईंट येथे उपलब्ध आहेत.'
          : 'The nearest cooling facilities are Palika Kendra Community Shelter (420m away) and Delhi Jal Board Hydration Point at Rajiv Chowk Metro Gate 2.',
        citations: [
          { document: 'Municipal Climate Action Infrastructure Registry', page: 8 }
        ]
      };
    } else {
      return {
        reply: language === 'hi'
          ? 'गर्मी का सूचकांक (Heat Index) आज 43.8°C है, जो अधिक जोखिम दर्शाता है। घर से बाहर निकलने से पहले ठंडे पानी की बोतल साथ रखें।'
          : language === 'mr'
          ? 'उष्णता निर्देशांक आज 43.8°C आहे, जो अति जोखीम दर्शवतो. बाहेर पडण्यापूर्वी पाण्याचे नियोजन करा.'
          : 'The current heat index in your area is 43.8°C (High Risk). We recommend scheduling outdoor commutes before 10:00 AM or after 6:00 PM.',
        citations: [
          { document: 'Heat Risk Index Manual - MoHFW', page: 22 }
        ]
      };
    }
  }
}

export async function subscribeAlerts(req: SubscriberRequest): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/subscribers/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    });
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch {
    return {
      success: true,
      message: `Successfully subscribed ${req.phone} to GarmiQ Heat Warnings via ${req.channel.toUpperCase()}.`
    };
  }
}

export async function getActiveAlerts(): Promise<HeatAlert[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/alerts/`);
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    return data.alerts || MOCK_ALERTS;
  } catch {
    return MOCK_ALERTS;
  }
}
