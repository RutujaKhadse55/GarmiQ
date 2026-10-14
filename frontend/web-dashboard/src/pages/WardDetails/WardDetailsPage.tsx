import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Building2,
  TreePine,
  Thermometer,
  Layers,
  Users,
  AlertTriangle,
  MapPin,
  Cpu,
  Share2,
  ShieldAlert,
  Calendar,
  Clock,
  Sparkles,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { RiskBadge } from '../../components/common/RiskBadge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { RiskMap } from '../../components/maps/RiskMap';
import { ShapContributionChart } from '../../components/charts/ShapContributionChart';
import { ForecastChart } from '../../components/charts/ForecastChart';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { ErrorState } from '../../components/common/ErrorState';
import {
  useWard,
  useWardExplanation,
  useWardForecast,
  useMunicipalReports,
} from '../../hooks/useQueries';
import { MOCK_COOLING_POINTS } from '@garmiq/api-client';

export const WardDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: ward, isLoading: isLoadingWard, isError: isErrorWard, refetch: refetchWard } = useWard(id);
  const { data: explanation, isLoading: isLoadingExplain } = useWardExplanation(id);
  const { data: forecast, isLoading: isLoadingForecast } = useWardForecast(id);
  const { data: reportsData } = useMunicipalReports({ ward_id: id });

  if (isLoadingWard) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="card" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <LoadingSkeleton variant="card" />
          <LoadingSkeleton variant="card" />
          <LoadingSkeleton variant="card" />
        </div>
        <LoadingSkeleton variant="chart" />
      </div>
    );
  }

  if (isErrorWard || !ward) {
    return (
      <ErrorState
        title="Ward Not Found"
        message={`We could not locate municipal records for ward ID "${id}".`}
        onRetry={refetchWard}
      />
    );
  }

  const wardReports = reportsData?.reports || [];
  const nearbyCoolingPoints = MOCK_COOLING_POINTS.slice(0, 3);

  return (
    <div className="space-y-6 select-none animate-fadeIn pb-12">
      <PageHeader
        title={`${ward.name} (${ward.code})`}
        subtitle="Granular microclimate indicators, machine learning explainability & diurnal forecasts"
        backUrl="/wards"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Ward Explorer', href: '/wards' },
          { label: ward.name },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/map?ward=${ward.id}`)}
              className="px-3 py-1.5 rounded-xl border border-[#DFEAF7] bg-white text-xs font-semibold text-[#102442] hover:bg-slate-50 transition-colors shadow-soft"
            >
              Locate on Map
            </button>
            <button
              onClick={() => navigate(`/simulator?ward=${ward.id}`)}
              className="px-3.5 py-1.5 rounded-xl bg-[#0866D9] text-white text-xs font-bold hover:bg-[#0756B8] transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Cpu className="w-3.5 h-3.5" />
              Simulate Interventions
            </button>
          </div>
        }
      />

      {/* Ward Status Bar */}
      <div className="bg-white rounded-card border border-[#DFEAF7] p-4 shadow-soft flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <RiskBadge level={ward.risk_level} size="lg" />
          <span className="text-[#7186A3]">|</span>
          <span className="text-[#102442] font-semibold flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#0866D9]" />
            Coordinates: {ward.lat.toFixed(4)}° N, {ward.lon.toFixed(4)}° E
          </span>
        </div>

        <div className="flex items-center gap-4 text-[#7186A3]">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Last telemetry sync: 2 mins ago
          </span>
          <span className="px-2 py-0.5 rounded bg-blue-50 text-[#0866D9] font-bold text-[11px]">
            PMC Zonal Unit 1
          </span>
        </div>
      </div>

      {/* Section A: Key Microclimate & Demographic Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white rounded-card border border-[#DFEAF7] p-4 shadow-soft">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7186A3] block">
            HVI Score
          </span>
          <div className="text-2xl font-black text-[#102442] mt-1">
            {ward.hvi || ward.vulnerability_score}
            <span className="text-xs font-normal text-[#7186A3]">/100</span>
          </div>
          <span className="text-[10px] text-red-600 font-semibold block mt-1">
            Extreme Vulnerability
          </span>
        </div>

        <div className="bg-white rounded-card border border-[#DFEAF7] p-4 shadow-soft">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7186A3] block">
            Heat Index
          </span>
          <div className="text-2xl font-black text-red-600 mt-1">
            {ward.current_heat_index}°C
          </div>
          <span className="text-[10px] text-[#7186A3] block mt-1">
            Wet-Bulb: {ward.wet_bulb_celsius}°C
          </span>
        </div>

        <div className="bg-white rounded-card border border-[#DFEAF7] p-4 shadow-soft">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7186A3] block">
            Land Surface Temp
          </span>
          <div className="text-2xl font-black text-[#102442] mt-1">
            {ward.lst_celsius || '43.2'}°C
          </div>
          <span className="text-[10px] text-[#7186A3] block mt-1">
            Satellite IR radiometric
          </span>
        </div>

        <div className="bg-white rounded-card border border-[#DFEAF7] p-4 shadow-soft">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7186A3] block">
            Built-Up Area
          </span>
          <div className="text-2xl font-black text-slate-800 mt-1">
            {ward.built_up_pct || 78}%
          </div>
          <span className="text-[10px] text-amber-600 font-semibold block mt-1">
            Impervious surface
          </span>
        </div>

        <div className="bg-white rounded-card border border-[#DFEAF7] p-4 shadow-soft">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7186A3] block">
            Tree Canopy
          </span>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            {ward.tree_canopy_pct || 12.4}%
          </div>
          <span className="text-[10px] text-[#7186A3] block mt-1">
            NDVI: {ward.vegetation_ndvi || 0.18}
          </span>
        </div>

        <div className="bg-white rounded-card border border-[#DFEAF7] p-4 shadow-soft">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7186A3] block">
            Population Exposure
          </span>
          <div className="text-2xl font-black text-[#102442] mt-1">
            {((ward.total_population || 140000) / 1000).toFixed(0)}k
          </div>
          <span className="text-[10px] text-[#7186A3] block mt-1">
            {ward.elderly_ratio_pct || 14}% elderly
          </span>
        </div>
      </div>

      {/* Section B & C: Ward Map & SHAP Explainability side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ward Geographic Map */}
        <div className="bg-white rounded-card border border-[#DFEAF7] p-5 shadow-soft flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-[#102442]">Ward Perimeter & Microclimate Layer</h3>
              <p className="text-xs text-[#7186A3]">Municipal boundary overlay with sensor nodes</p>
            </div>
            <span className="text-[11px] font-semibold text-[#0866D9]">
              {ward.sensor_count || 4} IoT Nodes Active
            </span>
          </div>

          <div className="flex-1 min-h-[340px]">
            <RiskMap height="340px" selectedWardId={ward.id} showControls={true} />
          </div>
        </div>

        {/* Section C: Risk Explainability & SHAP Values */}
        {isLoadingExplain || !explanation ? (
          <LoadingSkeleton variant="chart" />
        ) : (
          <div className="space-y-4">
            <ShapContributionChart
              features={explanation.features}
              baseScore={explanation.base_score}
              finalScore={explanation.final_score}
            />

            <div className="bg-blue-50/70 border border-blue-200 rounded-card p-4 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-blue-900 mb-1">
                <Sparkles className="w-4 h-4 text-[#0866D9]" />
                Primary Vulnerability Factor
              </div>
              <p className="text-blue-950 font-semibold mb-1">{explanation.primary_driver}</p>
              <p className="text-[#132D50] text-[11px] leading-relaxed">{explanation.summary}</p>
            </div>
          </div>
        )}
      </div>

      {/* Section D: Diurnal Forecast Curve */}
      {isLoadingForecast || !forecast ? (
        <LoadingSkeleton variant="chart" />
      ) : (
        <ForecastChart hourly={forecast.hourly} />
      )}

      {/* Section E: Citizen Reports and Cooling Resources for this Ward */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reports for this ward */}
        <div className="bg-white rounded-card border border-[#DFEAF7] p-5 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-[#102442]">Citizen Reports in {ward.name}</h3>
              <p className="text-xs text-[#7186A3]">Realtime thermal distress submissions</p>
            </div>
            <button
              onClick={() => navigate(`/reports?ward_id=${ward.id}`)}
              className="text-xs font-bold text-[#0866D9] hover:underline"
            >
              View Filtered ({wardReports.length}) →
            </button>
          </div>

          {wardReports.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#7186A3]">
              No active citizen distress reports for this ward currently.
            </div>
          ) : (
            <div className="space-y-2">
              {wardReports.slice(0, 3).map((r) => (
                <div
                  key={r.id}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 flex items-start justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-[#102442]">{r.location_name}</div>
                    <p className="text-[11px] text-[#7186A3] mt-0.5">{r.description}</p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <StatusBadge status={r.status} />
                    <span className="block text-[10px] text-red-600 font-bold mt-1">
                      Felt heat: {r.felt_heat}/5
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Nearby Cooling Centers */}
        <div className="bg-white rounded-card border border-[#DFEAF7] p-5 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-[#102442]">Civic Cooling Centres & Hydration</h3>
              <p className="text-xs text-[#7186A3]">PMC designated shelters in & around this ward</p>
            </div>
            <span className="text-xs font-bold text-emerald-700">
              {ward.cooling_points_count || 5} Verified Shelters
            </span>
          </div>

          <div className="space-y-2.5">
            {nearbyCoolingPoints.map((cp) => (
              <div
                key={cp.id}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-[#102442]">{cp.name}</div>
                  <div className="text-[11px] text-[#7186A3]">{cp.address}</div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Open
                  </span>
                  <div className="text-[10px] text-[#7186A3] mt-1">{cp.distance_km} km away</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
