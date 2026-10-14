import { http, HttpResponse, delay } from 'msw';
import {
  MOCK_OFFICER,
  MOCK_MUNICIPAL_WARDS,
  MOCK_WARD_EXPLANATIONS,
  MOCK_RANKINGS,
  MOCK_SENSORS,
  MOCK_REPORTS,
  MOCK_MUNICIPAL_ALERTS,
  MOCK_HEAT_ACTION_PLANS,
  MOCK_POLICY_DOCUMENTS,
} from './fixtures';
import { PUNE_MUNICIPAL_GEOJSON } from './puneGeoJson';
import { SimulationResult, HeatActionPlan } from '../types';

let currentReports = [...MOCK_REPORTS];
let currentAlerts = [...MOCK_MUNICIPAL_ALERTS];
let currentPlans = [...MOCK_HEAT_ACTION_PLANS];
let simulationsStore: Record<string, SimulationResult> = {};

export const handlers = [
  // Authentication
  http.post('*/api/v1/auth/login', async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as any;
    if (!body?.email || !body?.password) {
      return HttpResponse.json({ message: 'Email and password are required.' }, { status: 400 });
    }
    // Simple demo password validation (any password >= 4 chars accepted for demo)
    if (body.password.length < 4) {
      return HttpResponse.json({ message: 'Invalid credentials. Password must be at least 4 characters.' }, { status: 401 });
    }

    return HttpResponse.json({
      token: 'jwt_mock_pmc_officer_token_' + Date.now(),
      user: {
        ...MOCK_OFFICER,
        email: body.email,
      },
    });
  }),

  http.get('*/api/v1/auth/me', async () => {
    return HttpResponse.json(MOCK_OFFICER);
  }),

  // Wards Listing
  http.get('*/api/v1/wards', async ({ request }) => {
    await delay(200);
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const risk = url.searchParams.get('risk')?.toUpperCase() || '';

    let result = [...MOCK_MUNICIPAL_WARDS];
    if (search) {
      result = result.filter(
        (w) =>
          w.name.toLowerCase().includes(search) ||
          w.code.toLowerCase().includes(search) ||
          w.id.toLowerCase().includes(search)
      );
    }
    if (risk && risk !== 'ALL') {
      result = result.filter((w) => w.risk_level === risk);
    }
    return HttpResponse.json(result);
  }),

  // Ward Details
  http.get('*/api/v1/wards/:id', async ({ params }) => {
    await delay(150);
    const { id } = params;
    const ward = MOCK_MUNICIPAL_WARDS.find((w) => w.id === id);
    if (!ward) {
      return HttpResponse.json({ message: `Ward with ID ${id} not found.` }, { status: 404 });
    }
    return HttpResponse.json(ward);
  }),

  // SHAP Explainability
  http.get('*/api/v1/wards/:id/explain', async ({ params }) => {
    await delay(250);
    const { id } = params;
    const explanation = MOCK_WARD_EXPLANATIONS[id as string];
    if (explanation) {
      return HttpResponse.json(explanation);
    }
    // Generate generic explanation for other wards
    const ward = MOCK_MUNICIPAL_WARDS.find((w) => w.id === id) || MOCK_MUNICIPAL_WARDS[0];
    return HttpResponse.json({
      ward_id: ward.id,
      ward_name: ward.name,
      risk_level: ward.risk_level,
      base_score: 52.0,
      final_score: ward.vulnerability_score,
      primary_driver: `Built-up Density (${ward.built_up_pct}%) & Vegetative Cover (NDVI ${ward.vegetation_ndvi})`,
      summary: `${ward.name} displays a vulnerability score of ${ward.vulnerability_score}/100. Key factors include ${ward.built_up_pct}% impervious surface cover and ${ward.tree_canopy_pct}% tree canopy shade.`,
      features: [
        {
          feature_key: 'built_up',
          display_name: 'Built-up Surface (%)',
          feature_value: `${ward.built_up_pct}%`,
          shap_value: (ward.built_up_pct - 60) * 0.3,
          contribution_direction: ward.built_up_pct > 65 ? 'increases_risk' : 'decreases_risk',
          description: 'Reflective and thermal storage properties of building structures and road surfaces.'
        },
        {
          feature_key: 'canopy',
          display_name: 'Tree Canopy Cover (%)',
          feature_value: `${ward.tree_canopy_pct}%`,
          shap_value: -(ward.tree_canopy_pct - 15) * 0.4,
          contribution_direction: ward.tree_canopy_pct < 15 ? 'increases_risk' : 'decreases_risk',
          description: 'Vegetative shading and evapotranspiration cooling buffer.'
        },
        {
          feature_key: 'elderly',
          display_name: 'Elderly Demographic Ratio (%)',
          feature_value: `${ward.elderly_ratio_pct}%`,
          shap_value: (ward.elderly_ratio_pct - 12) * 0.5,
          contribution_direction: 'increases_risk',
          description: 'Age-related thermal vulnerability and physiological heat intolerance.'
        }
      ],
      timestamp: new Date().toISOString()
    });
  }),

  // Forecast for Ward
  http.get('*/api/v1/forecast/:id', async ({ params }) => {
    await delay(150);
    const { id } = params;
    const ward = MOCK_MUNICIPAL_WARDS.find((w) => w.id === id) || MOCK_MUNICIPAL_WARDS[0];
    return HttpResponse.json({
      ward_id: ward.id,
      ward_name: ward.name,
      date: new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' }),
      max_temp: Math.round(ward.current_heat_index),
      min_temp: 26,
      daily_advisory: `High solar radiation peak forecasted between 12:00 PM and 3:30 PM. Current heat index: ${ward.current_heat_index}°C.`,
      hourly: [
        { time: '06:00', temp_celsius: 26, heat_index_celsius: 27, risk_level: 'LOW', is_safe: true },
        { time: '08:00', temp_celsius: 30, heat_index_celsius: 32, risk_level: 'LOW', is_safe: true },
        { time: '10:00', temp_celsius: 36, heat_index_celsius: 39, risk_level: 'MODERATE', is_safe: true },
        { time: '12:00', temp_celsius: Math.round(ward.current_heat_index - 1), heat_index_celsius: Math.round(ward.current_heat_index), risk_level: ward.risk_level, is_safe: false },
        { time: '14:00', temp_celsius: Math.round(ward.current_heat_index), heat_index_celsius: Math.round(ward.current_heat_index + 2), risk_level: ward.risk_level, is_safe: false },
        { time: '16:00', temp_celsius: Math.round(ward.current_heat_index - 1), heat_index_celsius: Math.round(ward.current_heat_index + 1), risk_level: ward.risk_level, is_safe: false },
        { time: '18:00', temp_celsius: 36, heat_index_celsius: 38, risk_level: 'MODERATE', is_safe: true },
        { time: '20:00', temp_celsius: 32, heat_index_celsius: 34, risk_level: 'LOW', is_safe: true }
      ]
    });
  }),

  // Heatmap GeoJSON
  http.get('*/api/v1/heatmap', async () => {
    return HttpResponse.json(PUNE_MUNICIPAL_GEOJSON);
  }),

  // Rankings
  http.get('*/api/v1/rankings', async () => {
    await delay(200);
    return HttpResponse.json(MOCK_RANKINGS);
  }),

  // Telemetry & Sensors
  http.get('*/api/v1/telemetry/live', async () => {
    await delay(150);
    return HttpResponse.json({
      sensors: MOCK_SENSORS,
      summary: {
        total: MOCK_SENSORS.length,
        online: MOCK_SENSORS.filter((s) => s.status === 'online').length,
        warning: MOCK_SENSORS.filter((s) => s.status === 'warning').length,
        offline: MOCK_SENSORS.filter((s) => s.status === 'offline').length,
      },
      last_poll_at: new Date().toISOString(),
    });
  }),

  // Citizen Reports
  http.get('*/api/v1/reports', async ({ request }) => {
    await delay(200);
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const wardId = url.searchParams.get('ward_id');

    let result = [...currentReports];
    if (status && status !== 'ALL') {
      result = result.filter((r) => r.status === status);
    }
    if (wardId && wardId !== 'ALL') {
      result = result.filter((r) => r.ward_id === wardId);
    }
    return HttpResponse.json({
      reports: result,
      total: result.length,
    });
  }),

  http.patch('*/api/v1/reports/:id/status', async ({ params, request }) => {
    await delay(300);
    const { id } = params;
    const body = (await request.json()) as any;
    const idx = currentReports.findIndex((r) => r.id === id);
    if (idx === -1) {
      return HttpResponse.json({ message: 'Report not found' }, { status: 404 });
    }
    currentReports[idx] = {
      ...currentReports[idx],
      status: body.status,
      officer_notes: body.notes || currentReports[idx].officer_notes,
      updated_at: new Date().toISOString(),
    };
    return HttpResponse.json(currentReports[idx]);
  }),

  // Alert Queue
  http.get('*/api/v1/alerts', async () => {
    await delay(200);
    return HttpResponse.json({
      alerts: currentAlerts,
      summary: {
        total: currentAlerts.length,
        pending: currentAlerts.filter((a) => a.status === 'PENDING_APPROVAL').length,
        approved: currentAlerts.filter((a) => a.status === 'APPROVED').length,
        rejected: currentAlerts.filter((a) => a.status === 'REJECTED').length,
      },
    });
  }),

  http.post('*/api/v1/alerts/:id/approve', async ({ params, request }) => {
    await delay(350);
    const { id } = params;
    const body = (await request.json().catch(() => ({}))) as any;
    const alert = currentAlerts.find((a) => a.id === id);
    if (!alert) {
      return HttpResponse.json({ message: 'Alert not found' }, { status: 404 });
    }
    alert.status = 'APPROVED';
    alert.reviewed_by = MOCK_OFFICER.name;
    alert.reviewed_at = new Date().toISOString();
    alert.review_notes = body?.notes || 'Approved by municipal disaster health officer for public distribution.';
    return HttpResponse.json(alert);
  }),

  http.post('*/api/v1/alerts/:id/reject', async ({ params, request }) => {
    await delay(350);
    const { id } = params;
    const body = (await request.json().catch(() => ({}))) as any;
    const alert = currentAlerts.find((a) => a.id === id);
    if (!alert) {
      return HttpResponse.json({ message: 'Alert not found' }, { status: 404 });
    }
    alert.status = 'REJECTED';
    alert.reviewed_by = MOCK_OFFICER.name;
    alert.reviewed_at = new Date().toISOString();
    alert.review_notes = body?.notes || 'Rejected by officer. Threshold criteria not met.';
    return HttpResponse.json(alert);
  }),

  // Simulation
  http.post('*/api/v1/simulate', async ({ request }) => {
    await delay(600);
    const body = (await request.json()) as any;
    const simId = 'sim-' + Date.now();
    
    const targetWards = MOCK_MUNICIPAL_WARDS.filter((w) =>
      body.target_ward_ids?.includes(w.id)
    );
    const activeWards = targetWards.length > 0 ? targetWards : [MOCK_MUNICIPAL_WARDS[2]]; // default Kasba Peth

    const tempReduction = Number((0.8 + (body.intensity_pct || 25) * 0.05).toFixed(1));
    const hviReduction = Math.round(5 + (body.intensity_pct || 25) * 0.35);

    const simulationResult: SimulationResult = {
      id: simId,
      scenario_name: body.scenario_name || 'Pune Urban Heat Mitigation Scenario',
      created_at: new Date().toISOString(),
      status: 'completed',
      intervention_type: body.intervention_type || 'tree_canopy',
      intensity_pct: body.intensity_pct || 25,
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
        `Deploy ${body.intensity_pct}% intervention along central pedestrian arterials for highest cooling efficacy.`,
        `Prioritize high albedo materials (SRI >= 104) on industrial sheet metal roofs.`,
        `Complement with 3 mobile chilled hydration points during peak 12:00-15:30 window.`
      ],
      computation_time_ms: 540,
    };

    simulationsStore[simId] = simulationResult;
    return HttpResponse.json(simulationResult);
  }),

  http.get('*/api/v1/simulations/:id', async ({ params }) => {
    const { id } = params;
    const sim = simulationsStore[id as string];
    if (sim) {
      return HttpResponse.json(sim);
    }
    return HttpResponse.json({ message: 'Simulation not found' }, { status: 404 });
  }),

  // Heat Action Plans
  http.get('*/api/v1/plans', async () => {
    await delay(200);
    return HttpResponse.json(currentPlans);
  }),

  http.get('*/api/v1/plans/:id', async ({ params }) => {
    await delay(150);
    const { id } = params;
    const plan = currentPlans.find((p) => p.id === id);
    if (!plan) {
      return HttpResponse.json({ message: 'Plan not found' }, { status: 404 });
    }
    return HttpResponse.json(plan);
  }),

  http.post('*/api/v1/plans', async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as any;
    const newPlan: HeatActionPlan = {
      id: 'plan-pmc-' + Date.now(),
      title: body.title || 'Pune Municipal Heat Action Plan (HAP)',
      year: body.year || 2026,
      planning_cycle: body.planning_cycle || 'Annual Action Plan',
      city: 'Pune',
      status: 'DRAFT',
      target_wards: body.target_wards || ['Kasba Peth', 'Swargate'],
      vulnerability_focus: body.vulnerability_focus || 'High-density unshaded wards',
      budget_lakhs: Number(body.budget_lakhs) || 250,
      key_pillars: body.key_pillars || [
        'Early Warning Systems & Color-Coded Public Alerts',
        'Cool Roofs & White Solar Reflective Paint',
        'Emergency Hydration & Chilled Water Stations'
      ],
      summary: body.summary || 'Empirical heat mitigation plan generated via GarmiQ Control Centre.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author: MOCK_OFFICER.name,
      download_url: `/api/v1/plans/plan-pmc-${Date.now()}/pdf`,
    };
    currentPlans.unshift(newPlan);
    return HttpResponse.json(newPlan, { status: 201 });
  }),

  http.get('*/api/v1/plans/:id/pdf', async ({ params }) => {
    await delay(400);
    const { id } = params;
    const plan = currentPlans.find((p) => p.id === id);
    if (!plan) {
      return HttpResponse.json({ message: 'Plan not found' }, { status: 404 });
    }
    // Return mock PDF download response
    return HttpResponse.json({
      success: true,
      message: `PDF generated successfully for plan ${plan.title}`,
      plan_id: plan.id,
      generated_at: new Date().toISOString(),
      download_url: `/download/${plan.id}.pdf`
    });
  }),

  // Policy & Guidelines RAG
  http.post('*/api/v1/policy/search', async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as any;
    const query = (body?.query || '').toLowerCase();

    // Check exact matches in mock documents
    const match = MOCK_POLICY_DOCUMENTS.find(
      (doc) =>
        doc.query.toLowerCase().includes(query) ||
        query.includes('action') && doc.query.includes('actions') ||
        query.includes('prepared') && doc.query.includes('preparedness') ||
        query.includes('vulnerable') && doc.query.includes('vulnerable')
    );

    if (match) {
      return HttpResponse.json(match);
    }

    // Dynamic grounded fallback for other heat-related questions
    return HttpResponse.json({
      query: body?.query || '',
      answer: `According to the Pune Municipal Corporation Heat Action Plan (2024-2026) and NDMA Guidelines, proactive measures for query "${body?.query}" require inter-departmental mobilization across Health, Engineering, and Water Works. Key standard directives mandate maintaining emergency hydration kiosks, conducting shaded transit inspections, and enforcing mandatory labor resting hours during peak thermal periods.`,
      confidence_score: 0.88,
      citations: [
        {
          document: 'PMC Pune Heat Action Plan 2024-2026',
          section: 'Chapter 3: Citywide Climate Adaptation & Resilience Protocols',
          page: 15,
          url: 'https://pmc.gov.in/heat-action-plan-2024.pdf',
          excerpt: 'All municipal departments shall align emergency response schedules with GarmiQ heat risk forecasts to protect vulnerable urban populations.'
        },
        {
          document: 'National Disaster Management Authority (NDMA) National Guidelines on Heatwave Management',
          section: 'Annexure B: Municipal Heat Contingency Checklist',
          page: 51,
          url: 'https://ndma.gov.in/guidelines/heatwave-2023.pdf',
          excerpt: 'Standard municipal contingency reserves must allocate rapid-deployment drinking water tankers and shade canopies for public assembly areas.'
        }
      ],
      official_framework: 'PMC Civic Disaster Management Framework & NDMA Protocol',
      applicable_triggers: ['Heat Index >= 40°C', 'Civic Heat Alert']
    });
  }),
];
