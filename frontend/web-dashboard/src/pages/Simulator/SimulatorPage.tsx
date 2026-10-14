import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Cpu,
  TreePine,
  Home,
  CloudRain,
  Building,
  Droplets,
  Play,
  RotateCcw,
  Sparkles,
  TrendingDown,
  CheckCircle2,
  Users,
  ShieldAlert,
  ArrowRight,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { PageHeader } from '../../components/common/PageHeader';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { useWards, useRunSimulation } from '../../hooks/useQueries';
import { InterventionType, SimulationResult } from '../../types';
import { useToast } from '../../components/common/ToastProvider';

export const SimulatorPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedWard = searchParams.get('ward');
  const { showToast } = useToast();

  const { data: wards = [], isLoading: isLoadingWards } = useWards();
  const runSimulationMutation = useRunSimulation();

  // Form State
  const [scenarioName, setScenarioName] = useState('Peth Core Cool Roofs & Urban Canopy Scenario');
  const [targetWardIds, setTargetWardIds] = useState<string[]>(
    preselectedWard ? [preselectedWard] : ['ward-pune-03', 'ward-pune-07', 'ward-pune-08']
  );
  const [interventionType, setInterventionType] = useState<InterventionType>('cool_roofs');
  const [intensityPct, setIntensityPct] = useState(30);
  const [periodDays, setPeriodDays] = useState(14);
  const [budgetLakhs, setBudgetLakhs] = useState(120);

  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  // Sync preselected ward if url updates
  useEffect(() => {
    if (preselectedWard && !targetWardIds.includes(preselectedWard)) {
      setTargetWardIds([preselectedWard]);
    }
  }, [preselectedWard]);

  const handleToggleWard = (wardId: string) => {
    setTargetWardIds((prev) =>
      prev.includes(wardId) ? prev.filter((id) => id !== wardId) : [...prev, wardId]
    );
  };

  const handleSelectAllHighRisk = () => {
    const highRiskIds = wards
      .filter((w) => w.risk_level === 'HIGH' || w.risk_level === 'VERY_HIGH')
      .map((w) => w.id);
    setTargetWardIds(highRiskIds);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (targetWardIds.length === 0) {
      showToast('Please select at least one target ward for the simulation.', 'error');
      return;
    }

    try {
      const res = await runSimulationMutation.mutateAsync({
        scenario_name: scenarioName,
        target_ward_ids: targetWardIds,
        intervention_type: interventionType,
        intensity_pct: intensityPct,
        simulation_period_days: periodDays,
        budget_inr_lakhs: budgetLakhs,
      });
      setSimulationResult(res);
      showToast('Simulation completed successfully. Reviewing projected thermal deltas.', 'success');
    } catch {
      showToast('Simulation calculation failed. Please retry.', 'error');
    }
  };

  const handleReset = () => {
    setScenarioName('Pune Heat Mitigation Scenario');
    setTargetWardIds(['ward-pune-03']);
    setInterventionType('cool_roofs');
    setIntensityPct(25);
    setSimulationResult(null);
  };

  const interventionOptions = [
    {
      id: 'cool_roofs' as InterventionType,
      label: 'Cool Roofs (Solar Reflective White Coatings)',
      desc: 'High albedo paint on residential tin & concrete roofs',
      icon: Home,
      efficiency: 'High in dense settlements (-2.2°C)',
    },
    {
      id: 'tree_canopy' as InterventionType,
      label: 'Tree Canopy & Green Corridors',
      desc: 'Dense native tree planting along avenues & open spaces',
      icon: TreePine,
      efficiency: 'High long-term microclimate cooling (-1.8°C)',
    },
    {
      id: 'misting_shade' as InterventionType,
      label: 'Tensile Shading & Misting Systems',
      desc: 'Overhead shade cloth and high-pressure water misting in markets',
      icon: CloudRain,
      efficiency: 'Immediate pedestrian relief (-3.0°C felt)',
    },
    {
      id: 'cooling_shelters' as InterventionType,
      label: 'Emergency Cooling Centres',
      desc: 'Air-conditioned public halls with medical staff & ORS',
      icon: Building,
      efficiency: 'Vital for vulnerable senior citizens',
    },
    {
      id: 'water_kiosks' as InterventionType,
      label: 'Chilled Water Pyaao Kiosks',
      desc: 'Automated clean cold drinking water refill units',
      icon: Droplets,
      efficiency: 'Dehydration & heatstroke prevention',
    },
  ];

  const comparisonChartData = simulationResult?.ward_impacts.map((w) => ({
    name: w.ward_name.split(' ')[0],
    Baseline: w.baseline_temp,
    Simulated: w.simulated_temp,
    Delta: w.temp_delta,
  }));

  return (
    <div className="space-y-6 select-none animate-fadeIn pb-12">
      <PageHeader
        title="Forecast & Intervention Simulator"
        subtitle="Empirical decision-support: model cooling interventions and project thermal risk reductions"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Intervention Simulator' }]}
        actions={
          <button
            onClick={() => navigate('/rankings')}
            className="px-3.5 py-1.5 rounded-xl border border-[#DFEAF7] bg-white text-xs font-semibold text-[#102442] hover:bg-slate-50 transition-colors shadow-soft"
          >
            Inspect Ward Rankings →
          </button>
        }
      />

      {/* Notice Banner */}
      <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3 text-xs text-[#132D50]">
        <Info className="w-4 h-4 text-[#0866D9] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold text-[#102442]">Decision Support Notice: </span>
          Simulations leverage PMC satellite Land Surface Temperature (LST) and empirical microclimate models. Projections indicate estimated scenario improvements for municipal planning and do not represent guaranteed operational outcomes.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Simulation Configuration Form */}
        <div className="lg:col-span-5 bg-white rounded-card border border-[#DFEAF7] p-5 shadow-soft">
          <div className="flex items-center justify-between pb-3 border-b border-[#DFEAF7] mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#102442]">Configure Intervention Scenario</h3>
              <p className="text-xs text-[#7186A3]">Select target wards and parameters</p>
            </div>
            <button
              onClick={handleReset}
              className="text-[#7186A3] hover:text-[#102442] text-xs font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Scenario Title */}
            <div>
              <label className="block text-xs font-semibold text-[#102442] mb-1">
                Scenario Name
              </label>
              <input
                type="text"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-[#DFEAF7] bg-[#F4F8FD] text-xs font-medium text-[#102442] focus:bg-white focus:outline-none focus:border-[#0866D9]"
              />
            </div>

            {/* Intervention Type Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#102442] mb-1.5">
                Primary Intervention Type
              </label>
              <div className="space-y-1.5">
                {interventionOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = interventionType === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setInterventionType(opt.id)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                        isSelected
                          ? 'border-[#0866D9] bg-blue-50/60 shadow-sm'
                          : 'border-[#DFEAF7] hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected ? 'bg-[#0866D9] text-white' : 'bg-slate-100 text-[#7186A3]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-[#102442]">{opt.label}</div>
                        <div className="text-[11px] text-[#7186A3] leading-snug">{opt.desc}</div>
                        <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          {opt.efficiency}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Target Wards Multi-Select */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#102442]">
                  Target Wards ({targetWardIds.length} selected)
                </label>
                <button
                  type="button"
                  onClick={handleSelectAllHighRisk}
                  className="text-[11px] text-[#0866D9] hover:underline font-semibold"
                >
                  Select All High Risk
                </button>
              </div>

              <div className="max-h-36 overflow-y-auto p-2 rounded-xl border border-[#DFEAF7] bg-slate-50 space-y-1 text-xs">
                {wards.map((w) => {
                  const isChecked = targetWardIds.includes(w.id);
                  return (
                    <label
                      key={w.id}
                      className="flex items-center justify-between p-1.5 rounded-lg hover:bg-white cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleWard(w.id)}
                          className="rounded text-[#0866D9] focus:ring-0 cursor-pointer"
                        />
                        <span className="font-semibold text-[#102442]">{w.name}</span>
                      </div>
                      <span className="text-[10px] text-red-600 font-bold">
                        {w.current_heat_index}°C
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Sliders: Intensity & Budget */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <div className="flex justify-between text-xs text-[#7186A3] mb-1">
                  <span>Coverage / Intensity</span>
                  <span className="font-bold text-[#102442]">{intensityPct}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={intensityPct}
                  onChange={(e) => setIntensityPct(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0866D9]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-[#7186A3] mb-1">
                  <span>Est. Budget (₹ Lakhs)</span>
                  <span className="font-bold text-[#102442]">₹{budgetLakhs}L</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="500"
                  step="10"
                  value={budgetLakhs}
                  onChange={(e) => setBudgetLakhs(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0866D9]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={runSimulationMutation.isPending}
              className="w-full mt-3 py-2.5 rounded-xl bg-[#0866D9] hover:bg-[#0756B8] text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {runSimulationMutation.isPending ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Computing Microclimate Delta...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Run Thermal Simulation</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Simulation Results & Comparison */}
        <div className="lg:col-span-7 space-y-5">
          {!simulationResult ? (
            <div className="bg-white rounded-card border border-[#DFEAF7] p-12 text-center shadow-soft flex flex-col items-center justify-center min-h-[460px]">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#0866D9] flex items-center justify-center mb-4">
                <Cpu className="w-8 h-8 animate-pulse" />
              </div>
              <h3 className="text-base font-bold text-[#102442]">Simulation Model Ready</h3>
              <p className="text-xs text-[#7186A3] max-w-md mt-1 mb-6">
                Configure your target wards and cooling intervention parameters on the left, then click &ldquo;Run Thermal Simulation&rdquo; to calculate projected temperature drops.
              </p>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-xl bg-[#0866D9] text-white text-xs font-bold shadow-sm hover:bg-[#0756B8]"
              >
                Run Default Scenario Demo
              </button>
            </div>
          ) : (
            <>
              {/* Projected Improvement Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white rounded-card border border-emerald-100 p-4 shadow-soft">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7186A3] block">
                    Avg Temp Reduction
                  </span>
                  <div className="text-2xl font-black text-emerald-600 mt-1 flex items-baseline gap-1">
                    -{simulationResult.estimated_temp_reduction_celsius}°C
                    <TrendingDown className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-[10px] text-[#7186A3] block mt-0.5">
                    From {simulationResult.baseline_avg_heat_index}°C to {simulationResult.simulated_avg_heat_index}°C
                  </span>
                </div>

                <div className="bg-white rounded-card border border-blue-100 p-4 shadow-soft">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7186A3] block">
                    HVI Vulnerability Drop
                  </span>
                  <div className="text-2xl font-black text-[#0866D9] mt-1">
                    -{simulationResult.vulnerability_reduction_pct} pts
                  </div>
                  <span className="text-[10px] text-[#7186A3] block mt-0.5">
                    Significant mortality risk shielding
                  </span>
                </div>

                <div className="bg-white rounded-card border border-slate-100 p-4 shadow-soft">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7186A3] block">
                    Residents Shielded
                  </span>
                  <div className="text-2xl font-black text-[#102442] mt-1 flex items-center gap-1.5">
                    <Users className="w-5 h-5 text-slate-500" />
                    {(simulationResult.population_protected_count / 1000).toFixed(0)}k
                  </div>
                  <span className="text-[10px] text-[#7186A3] block mt-0.5">
                    Across {simulationResult.target_ward_ids.length} prioritized wards
                  </span>
                </div>
              </div>

              {/* Comparison Bar Chart: Baseline vs Simulated */}
              <div className="bg-white rounded-card border border-[#DFEAF7] p-5 shadow-soft">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-[#102442]">
                      Target Wards: Baseline vs Simulated Heat Index
                    </h4>
                    <p className="text-xs text-[#7186A3]">
                      Modeled cooling impact per ward (°C)
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                    Computation: {simulationResult.computation_time_ms}ms
                  </span>
                </div>

                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="name" tick={{ fill: '#7186A3', fontSize: 11 }} />
                      <YAxis domain={[34, 48]} tick={{ fill: '#7186A3', fontSize: 11 }} unit="°C" />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                      <Bar dataKey="Baseline" name="Current Baseline (°C)" fill="#EF4444" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Simulated" name="Post-Intervention (°C)" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recommendations and Next Action */}
              <div className="bg-white rounded-card border border-[#DFEAF7] p-5 shadow-soft">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-[#102442]">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Model Optimization Findings
                  </div>
                  <button
                    onClick={() => navigate('/plans')}
                    className="px-3 py-1.5 rounded-xl bg-[#0866D9] text-white text-xs font-bold hover:bg-[#0756B8] transition-colors flex items-center gap-1"
                  >
                    Convert to Action Plan
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <ul className="space-y-1.5 text-xs text-slate-700">
                  {simulationResult.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
