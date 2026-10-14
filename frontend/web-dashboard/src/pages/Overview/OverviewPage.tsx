import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flame,
  AlertTriangle,
  ShieldCheck,
  Building,
  ThermometerSun,
  Droplets,
  Wind,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  MapPin,
  Clock,
  Radio,
  FileSpreadsheet,
} from 'lucide-react';
import { KpiCard } from '../../components/common/KpiCard';
import { RiskBadge } from '../../components/common/RiskBadge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { RiskMap } from '../../components/maps/RiskMap';
import { RiskTrendChart } from '../../components/charts/RiskTrendChart';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { ErrorState } from '../../components/common/ErrorState';
import {
  useWards,
  useMunicipalReports,
  useMunicipalAlerts,
  useLiveTelemetry,
} from '../../hooks/useQueries';
import { useDashboardStore } from '../../store/useDashboardStore';
import { MOCK_COOLING_POINTS } from '@garmiq/api-client';

export const OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const selectedCity = useDashboardStore((s) => s.selectedCity);
  const selectedPeriod = useDashboardStore((s) => s.selectedPeriod);
  const [selectedWardId, setSelectedWardId] = useState<string | null>(null);

  const { data: wards = [], isLoading: isLoadingWards, isError: isErrorWards, refetch: refetchWards } = useWards();
  const { data: reportsData, isLoading: isLoadingReports } = useMunicipalReports();
  const { data: alertsData } = useMunicipalAlerts();
  const { data: telemetryData } = useLiveTelemetry();

  // Dynamic KPI calculations from API response
  const totalWards = wards.length;
  const highRiskWards = wards.filter(
    (w) => w.risk_level === 'HIGH' || w.risk_level === 'VERY_HIGH' || w.risk_level === 'EXTREME'
  ).length;
  const modRiskWards = wards.filter((w) => w.risk_level === 'MODERATE').length;
  const lowRiskWards = wards.filter((w) => w.risk_level === 'LOW' || w.risk_level === 'VERY_LOW').length;

  const totalCoolingPoints = wards.reduce((acc, w) => acc + (w.cooling_points_count || 0), 0) || 54;
  const openCoolingPoints = Math.round(totalCoolingPoints * 0.88);

  const activeAlert = alertsData?.alerts.find((a) => a.status === 'APPROVED' || a.status === 'PENDING_APPROVAL');
  const recentReports = reportsData?.reports.slice(0, 5) || [];
  const priorityCoolingPoint = MOCK_COOLING_POINTS[0];

  if (isLoadingWards) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <LoadingSkeleton key={i} variant="card" />
          ))}
        </div>
        <LoadingSkeleton variant="map" />
      </div>
    );
  }

  if (isErrorWards) {
    return <ErrorState onRetry={refetchWards} />;
  }

  return (
    <div className="space-y-6 animate-fadeIn select-none">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-[#102442] tracking-tight">Overview</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0866D9] text-[11px] font-bold">
              {selectedCity}
            </span>
          </div>
          <p className="text-xs text-[#7186A3] mt-0.5">
            Real-time heat-risk monitoring and community safety • {selectedPeriod}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/alerts')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#DFEAF7] bg-white text-xs font-semibold text-[#102442] hover:bg-slate-50 transition-colors shadow-soft"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            Alerts Queue ({alertsData?.summary.pending || 0})
          </button>
          <button
            onClick={() => navigate('/simulator')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0866D9] text-white text-xs font-bold hover:bg-[#0756B8] transition-colors shadow-sm"
          >
            Simulate Interventions →
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="High-Risk Wards"
          value={highRiskWards}
          subtitle={`${Math.round((highRiskWards / (totalWards || 1)) * 100)}% of total (${totalWards} wards)`}
          trendText="+2 wards"
          trendType="negative"
          icon={Flame}
          variant="danger"
          onClick={() => navigate('/wards?risk=HIGH')}
        />
        <KpiCard
          title="Moderate-Risk Wards"
          value={modRiskWards}
          subtitle={`${Math.round((modRiskWards / (totalWards || 1)) * 100)}% of city monitored`}
          trendText="Stable"
          trendType="warning"
          icon={AlertTriangle}
          variant="warning"
          onClick={() => navigate('/wards?risk=MODERATE')}
        />
        <KpiCard
          title="Low-Risk Wards"
          value={lowRiskWards}
          subtitle="Adequate vegetative & canopy buffer"
          trendText="No change"
          trendType="positive"
          icon={ShieldCheck}
          variant="success"
          onClick={() => navigate('/wards?risk=LOW')}
        />
        <KpiCard
          title="Cooling Centres Active"
          value={`${openCoolingPoints} / ${totalCoolingPoints}`}
          subtitle="PMC Shelters, clinics & hydration kiosks"
          trendText="88% operational"
          trendType="positive"
          icon={Building}
          variant="primary"
          onClick={() => navigate('/map')}
        />
      </div>

      {/* Main 2-Column or 3-Column Layout: Center Map & Charts + Right Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Heat Map + Risk Trend */}
        <div className="lg:col-span-2 space-y-6">
          {/* City Heat-Risk Map */}
          <div className="bg-white rounded-card border border-[#DFEAF7] p-5 shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-[#102442]">Pune City Heat-Risk Map</h3>
                <p className="text-xs text-[#7186A3]">
                  Interactive ward boundaries with real-time satellite LST and thermal vulnerability
                </p>
              </div>
              <button
                onClick={() => navigate('/map')}
                className="text-xs font-bold text-[#0866D9] hover:underline flex items-center gap-1"
              >
                Full Map View
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            <RiskMap
              height="440px"
              selectedWardId={selectedWardId}
              onSelectWard={setSelectedWardId}
            />
          </div>

          {/* Time Series Risk Trend Chart */}
          <RiskTrendChart />

          {/* Recent Citizen Reports Table */}
          <div className="bg-white rounded-card border border-[#DFEAF7] p-5 shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-[#102442]">Recent Citizen Reports</h3>
                <p className="text-xs text-[#7186A3]">Crowdsourced thermal hot spots and shade requests</p>
              </div>
              <button
                onClick={() => navigate('/reports')}
                className="text-xs font-bold text-[#0866D9] hover:underline flex items-center gap-1"
              >
                View All ({reportsData?.total || 0}) →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#DFEAF7] text-[#7186A3] font-semibold">
                    <th className="pb-2.5">Location / Ward</th>
                    <th className="pb-2.5">Issue Type</th>
                    <th className="pb-2.5">Felt Heat</th>
                    <th className="pb-2.5">Severity</th>
                    <th className="pb-2.5">Status</th>
                    <th className="pb-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentReports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 pr-2 font-medium text-[#102442]">
                        <div className="truncate max-w-[180px]">{report.location_name}</div>
                        <div className="text-[10px] text-[#7186A3]">{report.ward_name}</div>
                      </td>
                      <td className="py-2.5 pr-2 text-slate-600 capitalize">
                        {report.issue_type.replace('_', ' ')}
                      </td>
                      <td className="py-2.5 pr-2">
                        <span className="font-bold text-red-600">{report.felt_heat}/5</span>
                      </td>
                      <td className="py-2.5 pr-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            report.severity === 'CRITICAL'
                              ? 'bg-red-50 text-red-700'
                              : report.severity === 'HIGH'
                              ? 'bg-orange-50 text-orange-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {report.severity}
                        </span>
                      </td>
                      <td className="py-2.5 pr-2">
                        <StatusBadge status={report.status} />
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => navigate('/reports')}
                          className="text-[#0866D9] hover:underline font-semibold text-[11px]"
                        >
                          Inspect →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Forecast & Active Alerts + Priority Safe Places */}
        <div className="space-y-6">
          {/* Weather & Active Alert Card */}
          <div className="bg-white rounded-card border border-[#DFEAF7] p-5 shadow-soft">
            <div className="flex items-center justify-between pb-3 border-b border-[#DFEAF7] mb-4">
              <span className="text-xs font-bold text-[#102442] uppercase tracking-wider">
                Current Heat Index & Alerts
              </span>
              <span className="text-[10px] text-[#7186A3] font-mono">Pune Core</span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-4xl font-black text-[#102442] tracking-tight">41.8°C</div>
                <div className="text-xs font-semibold text-red-600 mt-0.5">High Thermal Stress</div>
              </div>
              <div className="text-right">
                <RiskBadge level="HIGH" size="lg" />
                <div className="text-[10px] text-[#7186A3] mt-1">Wet-bulb: 29.8°C</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs mb-4">
              <div className="flex items-center gap-2">
                <ThermometerSun className="w-4 h-4 text-orange-500" />
                <div>
                  <span className="text-[10px] text-[#7186A3] block">Air Temp</span>
                  <span className="font-bold text-[#102442]">39.4°C</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-500" />
                <div>
                  <span className="text-[10px] text-[#7186A3] block">Humidity</span>
                  <span className="font-bold text-[#102442]">46%</span>
                </div>
              </div>
            </div>

            {/* Active Alert Preview */}
            {activeAlert && (
              <div className="p-3.5 rounded-xl bg-orange-50/80 border border-orange-200">
                <div className="flex items-center gap-1.5 text-xs font-bold text-orange-900 mb-1">
                  <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0" />
                  <span>{activeAlert.title}</span>
                </div>
                <p className="text-[11px] text-orange-800 line-clamp-2 leading-relaxed">
                  {activeAlert.description}
                </p>
                <div className="mt-2.5 pt-2 border-t border-orange-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-orange-700 font-semibold">
                    Affects {activeAlert.affected_ward_names?.join(', ') || 'Core wards'}
                  </span>
                  <button
                    onClick={() => navigate('/alerts')}
                    className="font-bold text-[#0866D9] hover:underline"
                  >
                    Review Alert →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Priority Cooling Centre Card */}
          <div className="bg-white rounded-card border border-[#DFEAF7] p-5 shadow-soft">
            <div className="flex items-center justify-between pb-3 border-b border-[#DFEAF7] mb-3">
              <span className="text-xs font-bold text-[#102442] uppercase tracking-wider">
                Priority Civic Cooling Centre
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                Open Now
              </span>
            </div>

            <h4 className="text-sm font-bold text-[#102442] leading-snug">
              {priorityCoolingPoint.name}
            </h4>
            <p className="text-xs text-[#7186A3] mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-[#0866D9]" />
              {priorityCoolingPoint.address}
            </p>

            <div className="mt-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-[#7186A3]">
                <span>Operating Hours:</span>
                <span className="font-semibold text-[#102442]">{priorityCoolingPoint.operating_hours}</span>
              </div>
              <div className="flex justify-between text-[#7186A3]">
                <span>Emergency Contact:</span>
                <span className="font-semibold text-[#0866D9]">{priorityCoolingPoint.phone}</span>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1">
              {priorityCoolingPoint.amenities.map((amenity, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-medium text-slate-700"
                >
                  {amenity}
                </span>
              ))}
            </div>

            <button
              onClick={() => navigate('/map')}
              className="mt-4 w-full py-2 rounded-xl border border-[#DFEAF7] hover:bg-slate-50 text-xs font-bold text-[#0866D9] transition-colors text-center"
            >
              View All 54 Cooling Points on Map
            </button>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-gradient-to-br from-navy-primary to-navy-dark text-white rounded-card p-5 shadow-elevated">
            <h4 className="text-sm font-bold mb-1">Municipal Heat Action Plan 2026</h4>
            <p className="text-xs text-sky-200/80 mb-3 leading-relaxed">
              Targeted cool roof installations, shaded corridors, and hospital cold unit readiness.
            </p>
            <button
              onClick={() => navigate('/plans')}
              className="w-full py-2 rounded-xl bg-[#0866D9] hover:bg-[#0756B8] text-white text-xs font-bold transition-all shadow-md"
            >
              Inspect Active Heat Action Plans
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
