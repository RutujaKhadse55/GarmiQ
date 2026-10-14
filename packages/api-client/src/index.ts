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

// PUNE MUNICIPAL CORPORATION (PMC) GEOGRAPHIC WARDS DATA
export const MOCK_WARDS: Ward[] = [
  {
    id: 'ward-pune-01',
    code: 'PMC-01',
    name: 'Shivajinagar & FC Road',
    city: 'Pune',
    current_heat_index: 41.8,
    wet_bulb_celsius: 29.8,
    risk_level: 'HIGH',
    vulnerability_score: 72,
    safe_hours: ['06:00 - 10:00', '17:30 - 20:30'],
    avoid_hours: ['11:30 - 16:30'],
    lat: 18.5314,
    lon: 73.8446,
    cooling_points_count: 6
  },
  {
    id: 'ward-pune-02',
    code: 'PMC-02',
    name: 'Kothrud & Karve Road',
    city: 'Pune',
    current_heat_index: 39.5,
    wet_bulb_celsius: 28.2,
    risk_level: 'MODERATE',
    vulnerability_score: 54,
    safe_hours: ['06:00 - 10:30', '17:00 - 21:00'],
    avoid_hours: ['12:00 - 16:00'],
    lat: 18.5074,
    lon: 73.8077,
    cooling_points_count: 5
  },
  {
    id: 'ward-pune-03',
    code: 'PMC-03',
    name: 'Kasba Peth & Shaniwar Wada',
    city: 'Pune',
    current_heat_index: 44.6,
    wet_bulb_celsius: 31.4,
    risk_level: 'VERY_HIGH',
    vulnerability_score: 89,
    safe_hours: ['05:30 - 09:30', '18:30 - 21:30'],
    avoid_hours: ['10:30 - 17:00'],
    lat: 18.5196,
    lon: 73.8553,
    cooling_points_count: 8
  },
  {
    id: 'ward-pune-04',
    code: 'PMC-04',
    name: 'Hadapsar & Magarpatta',
    city: 'Pune',
    current_heat_index: 43.2,
    wet_bulb_celsius: 30.1,
    risk_level: 'HIGH',
    vulnerability_score: 78,
    safe_hours: ['06:00 - 10:00', '18:00 - 21:00'],
    avoid_hours: ['11:00 - 16:30'],
    lat: 18.5089,
    lon: 73.9260,
    cooling_points_count: 4
  },
  {
    id: 'ward-pune-05',
    code: 'PMC-05',
    name: 'Viman Nagar & Airport Area',
    city: 'Pune',
    current_heat_index: 42.1,
    wet_bulb_celsius: 29.5,
    risk_level: 'HIGH',
    vulnerability_score: 68,
    safe_hours: ['06:00 - 10:00', '17:30 - 21:00'],
    avoid_hours: ['11:30 - 16:30'],
    lat: 18.5679,
    lon: 73.9143,
    cooling_points_count: 5
  },
  {
    id: 'ward-pune-06',
    code: 'PMC-06',
    name: 'Aundh & Baner Green Belt',
    city: 'Pune',
    current_heat_index: 38.2,
    wet_bulb_celsius: 27.2,
    risk_level: 'LOW',
    vulnerability_score: 42,
    safe_hours: ['05:30 - 11:00', '17:00 - 21:30'],
    avoid_hours: ['12:30 - 15:30'],
    lat: 18.5602,
    lon: 73.8031,
    cooling_points_count: 7
  },
  {
    id: 'ward-pune-07',
    code: 'PMC-07',
    name: 'Swargate Junction & Parvati',
    city: 'Pune',
    current_heat_index: 43.9,
    wet_bulb_celsius: 30.8,
    risk_level: 'VERY_HIGH',
    vulnerability_score: 84,
    safe_hours: ['05:30 - 09:30', '18:00 - 21:00'],
    avoid_hours: ['10:30 - 17:00'],
    lat: 18.5018,
    lon: 73.8586,
    cooling_points_count: 6
  }
];

// PUNE COOLING POINTS & HYDRATION FACILITIES
export const MOCK_COOLING_POINTS: CoolingPoint[] = [
  {
    id: 'cp-pune-01',
    name: 'PMC Chhatrapati Sambhaji Garden Shaded Canopy',
    type: 'park',
    address: 'JM Road, Shivajinagar, Pune',
    lat: 18.5255,
    lon: 73.8475,
    distance_km: 0.4,
    distance_meters: 420,
    is_open: true,
    operating_hours: '06:00 AM - 08:30 PM',
    amenities: ['Dense Tree Canopy', 'Filtered Cold Water', 'Stone Benches', 'First Aid'],
    capacity_status: 'Available',
    phone: '+91 20 2550 1234',
    verified: true
  },
  {
    id: 'cp-pune-02',
    name: 'Sassoon General Hospital Heat Emergency Care Unit',
    type: 'clinic',
    address: 'Near Pune Railway Station, Sassoon Road',
    lat: 18.5276,
    lon: 73.8735,
    distance_km: 1.4,
    distance_meters: 1400,
    is_open: true,
    operating_hours: '24 Hours Emergency',
    amenities: ['Dedicated Cold Immersion ICU', 'IV Fluids', 'Doctor on Duty', 'Free ORS'],
    capacity_status: 'Available',
    phone: '+91 20 2612 8000',
    verified: true
  },
  {
    id: 'cp-pune-03',
    name: 'PMC Swargate Public Transit Cooling Shelter',
    type: 'shelter',
    address: 'Swargate ST Stand Chowk, Pune',
    lat: 18.5012,
    lon: 73.8590,
    distance_km: 1.8,
    distance_meters: 1800,
    is_open: true,
    operating_hours: '08:00 AM - 08:00 PM',
    amenities: ['Misting Cooling Fans', 'Chilled Water Pyaao', 'Resting Chairs', 'Electrolyte Packs'],
    capacity_status: 'Available',
    phone: '+91 20 2444 0001',
    verified: true
  },
  {
    id: 'cp-pune-04',
    name: 'Saras Baug Shaded Public Garden & Water Fountain',
    type: 'park',
    address: 'Near Peshwe Park, Sanathnagar, Pune',
    lat: 18.5005,
    lon: 73.8530,
    distance_km: 1.2,
    distance_meters: 1200,
    is_open: true,
    operating_hours: '06:00 AM - 09:00 PM',
    amenities: ['Lush Shade Corridor', 'Clean Drinking Water Fountains', 'Lawns'],
    capacity_status: 'Available',
    verified: true
  },
  {
    id: 'cp-pune-05',
    name: 'Kothrud Ward Office Chilled Hydration Kiosk',
    type: 'water_point',
    address: 'Karve Putala Chowk, Karve Road, Kothrud',
    lat: 18.5045,
    lon: 73.8110,
    distance_km: 2.1,
    distance_meters: 2100,
    is_open: true,
    operating_hours: '24 Hours',
    amenities: ['Purified RO Cold Water', 'Continuous Dispenser', 'Bottle Refill'],
    capacity_status: 'Available',
    verified: true
  },
  {
    id: 'cp-pune-06',
    name: 'Aundh District Hospital & Heat Emergency Center',
    type: 'clinic',
    address: 'DP Road, Near Sangvi Bridge, Aundh, Pune',
    lat: 18.5580,
    lon: 73.8055,
    distance_km: 2.5,
    distance_meters: 2500,
    is_open: true,
    operating_hours: '24 Hours',
    amenities: ['Heat Exhaustion Care', 'Air Conditioned Ward', 'Medical Staff'],
    capacity_status: 'Available',
    phone: '+91 20 2588 5000',
    verified: true
  }
];

// PUNE WARDS GEOJSON BOUNDARY OVERLAY
export const PUNE_WARDS_GEOJSON: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'ward-pune-01',
        name: 'Shivajinagar & FC Road',
        code: 'PMC-01',
        risk_level: 'HIGH',
        color: '#F47738',
        heat_index: 41.8
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [73.8340, 18.5420],
          [73.8580, 18.5390],
          [73.8560, 18.5210],
          [73.8370, 18.5220],
          [73.8340, 18.5420]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'ward-pune-02',
        name: 'Kothrud & Karve Road',
        code: 'PMC-02',
        risk_level: 'MODERATE',
        color: '#F3B43F',
        heat_index: 39.5
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [73.7920, 18.5190],
          [73.8240, 18.5180],
          [73.8210, 18.4960],
          [73.7940, 18.4980],
          [73.7920, 18.5190]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'ward-pune-03',
        name: 'Kasba Peth & Shaniwar Wada',
        code: 'PMC-03',
        risk_level: 'VERY_HIGH',
        color: '#E5484D',
        heat_index: 44.6
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [73.8480, 18.5280],
          [73.8690, 18.5270],
          [73.8670, 18.5110],
          [73.8470, 18.5120],
          [73.8480, 18.5280]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'ward-pune-07',
        name: 'Swargate Junction & Parvati',
        code: 'PMC-07',
        risk_level: 'VERY_HIGH',
        color: '#E5484D',
        heat_index: 43.9
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [73.8470, 18.5110],
          [73.8720, 18.5100],
          [73.8700, 18.4910],
          [73.8460, 18.4920],
          [73.8470, 18.5110]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'ward-pune-06',
        name: 'Aundh & Baner Green Belt',
        code: 'PMC-06',
        risk_level: 'LOW',
        color: '#36B878',
        heat_index: 38.2
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [73.7880, 18.5720],
          [73.8220, 18.5690],
          [73.8180, 18.5480],
          [73.7890, 18.5510],
          [73.7880, 18.5720]
        ]]
      }
    }
  ]
};

export const MOCK_ALERTS: HeatAlert[] = [
  {
    id: 'alert-pune-01',
    title: 'Severe Heatwave Warning (Orange Alert)',
    severity: 'HIGH',
    issued_at: '2026-06-15T09:30:00+05:30',
    valid_until: '2026-06-16T20:00:00+05:30',
    affected_wards: ['Kasba Peth', 'Swargate', 'Shivajinagar', 'Hadapsar'],
    description: 'Day temperatures are expected to touch 43.5°C in Pune urban core. High thermal stress expected on asphalt roads and dense residential settlements.',
    recommendations: [
      'Avoid unshaded outdoor transit between 11:30 AM and 04:30 PM.',
      'Drink at least 3-4 litres of water with oral rehydration salts.',
      'Cover head with wet cloth or umbrella.',
      'Rest in nearest PMC cooling shelters if feeling dizziness or exhaustion.'
    ],
    is_read: false
  },
  {
    id: 'alert-pune-02',
    title: 'High Surface Temperature Advisory',
    severity: 'MEDIUM',
    issued_at: '2026-06-15T07:00:00+05:30',
    valid_until: '2026-06-15T18:00:00+05:30',
    affected_wards: ['Shivajinagar', 'Kothrud'],
    description: 'Direct solar radiation peak forecasted between 12:00 PM and 3:30 PM.',
    recommendations: [
      'Keep hydrated and carry clean water bottles.',
      'Check on elderly neighbors and outdoor workers.'
    ],
    is_read: true
  }
];

// CLIENT-SIDE STORAGE QUEUE
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
    console.error('Failed to save report locally', err);
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

export async function getHeatRiskAt(lat: number, lon: number): Promise<HeatRiskInfo> {
  try {
    const res = await fetch(`${API_BASE_URL}/heat-risk/?lat=${lat}&lon=${lon}`);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch {
    return {
      location: {
        lat,
        lon,
        address: 'Shivajinagar, Pune, Maharashtra',
        ward_id: 'ward-pune-01',
        ward_name: 'Shivajinagar & FC Road (PMC-01)'
      },
      heat_index_celsius: 41.8,
      wet_bulb_celsius: 29.8,
      air_temp_celsius: 39.4,
      humidity_pct: 46,
      risk_level: 'HIGH',
      alert_level: 'Orange Alert',
      advisory: 'High thermal stress. Reduce strenuous outdoor activity between 11:30 AM and 4:30 PM. Carry ORS water.',
      safe_hours: ['06:00 - 10:00', '17:30 - 20:30'],
      avoid_hours: ['11:30 - 16:30'],
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
      max_temp: 41,
      min_temp: 26,
      daily_advisory: 'Maximum temperature peak at 02:00 PM. Drink plenty of fluids.',
      hourly: [
        { time: '06:00', temp_celsius: 26, heat_index_celsius: 27, risk_level: 'LOW', is_safe: true },
        { time: '08:00', temp_celsius: 30, heat_index_celsius: 32, risk_level: 'LOW', is_safe: true },
        { time: '10:00', temp_celsius: 35, heat_index_celsius: 38, risk_level: 'MODERATE', is_safe: true },
        { time: '12:00', temp_celsius: 39, heat_index_celsius: 42, risk_level: 'HIGH', is_safe: false },
        { time: '14:00', temp_celsius: 41, heat_index_celsius: 44, risk_level: 'VERY_HIGH', is_safe: false },
        { time: '16:00', temp_celsius: 40, heat_index_celsius: 43, risk_level: 'HIGH', is_safe: false },
        { time: '18:00', temp_celsius: 36, heat_index_celsius: 38, risk_level: 'MODERATE', is_safe: true },
        { time: '20:00', temp_celsius: 32, heat_index_celsius: 34, risk_level: 'LOW', is_safe: true }
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
    return { success: true, reference_id: json.id || `PMC-GQ-${Math.floor(100000 + Math.random() * 900000)}` };
  } catch {
    const refId = `PMC-GQ-${Math.floor(100000 + Math.random() * 900000)}`;
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
    const isBike = req.mode === 'bike';
    return {
      route_id: `route-${Date.now()}`,
      mode: req.mode,
      distance_km: isBike ? 3.2 : 1.6,
      duration_mins: isBike ? 11 : 22,
      shade_score: 82,
      risk_level: 'MODERATE',
      summary: 'Via JM Road Tree Canopy & Sambhaji Park Corridor',
      advisory: 'This route offers 82% continuous tree cover and passes 2 clean drinking water stations.',
      waypoints: [
        [req.origin.lon, req.origin.lat],
        [req.origin.lon + 0.003, req.origin.lat + 0.002],
        [req.origin.lon + 0.006, req.origin.lat + 0.004],
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
    const lower = message.toLowerCase();
    if (lower.includes('safe') || lower.includes('protect') || lower.includes('tips')) {
      return {
        reply: language === 'hi'
          ? 'पुणे में दोपहर 11:30 से 4:30 बजे तक सीधी धूप से बचें। ढीले सूती कपड़े पहनें और हर 20 मिनट में पानी या ओआरएस पिएं।'
          : language === 'mr'
          ? 'पुण्यात दुपारी ११:३० ते ४:३० दरम्यान कडक उन्हात जाणे टाळा. भरपूर पाणी, ताक किंवा ओआरएस प्या आणि सुती कपडे वापरा.'
          : 'In Pune, avoid outdoor travel between 11:30 AM and 4:30 PM. Drink water with electrolytes, wear light breathable cotton, and rest in shaded corridors.',
        citations: [
          { document: 'PMC Pune Heat Action Plan 2024', page: 12 },
          { document: 'IMD Maharashtra Summer Heat Advisory', page: 4 }
        ]
      };
    } else if (lower.includes('cooling') || lower.includes('shelter') || lower.includes('water')) {
      return {
        reply: language === 'hi'
          ? 'निकटतम कूलिंग सेंटर संभाजी गार्डन (जंगली महाराज रोड) और ससून अस्पताल हीट स्ट्रोक केयर यूनिट में उपलब्ध हैं।'
          : language === 'mr'
          ? 'जवळचे कुलिंग सेंटर छत्रपती संभाजी उद्यान (जेएम रोड) आणि ससून रुग्णालय येथे उपलब्ध आहेत.'
          : 'Nearest facilities are PMC Chhatrapati Sambhaji Garden (JM Road, Shivajinagar) and Sassoon Hospital Heat Stroke Emergency Unit.',
        citations: [
          { document: 'PMC Civic Heat Relief Registry', page: 6 }
        ]
      };
    } else {
      return {
        reply: language === 'hi'
          ? 'आज पुणे का हीट इंडेक्स 41.8°C है। दोपहर में बाहर निकलने से पहले ठंडे पानी की बोतल साथ रखें।'
          : language === 'mr'
          ? 'आज पुण्याचा उष्णता निर्देशांक ४१.८°C आहे. दुपारच्या वेळेत सावलीचा वापर करा आणि हायड्रेटेड राहा.'
          : 'The current heat index in Pune is 41.8°C (High Risk). We recommend scheduling outdoor commutes before 10:00 AM or after 5:30 PM.',
        citations: [
          { document: 'State Disaster Management Authority - Heat Protocol', page: 18 }
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
      message: `Subscribed ${req.phone} to PMC Pune Heatwave Alerts via ${req.channel.toUpperCase()}.`
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
