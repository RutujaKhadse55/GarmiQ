import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '../stores/useUserStore';
import {
  getHeatRiskAt,
  getCoolingPoints,
  getForecastForWard,
  MOCK_WARDS
} from '@garmiq/api-client';
import { AppHeader } from '../components/AppHeader';
import { RiskCard } from '../components/RiskCard';
import { SafeHours } from '../components/SafeHours';
import { CoolingCentreCard } from '../components/CoolingCentreCard';
import { OfflineBanner } from '../components/OfflineBanner';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import {
  MapPin,
  Droplet,
  HeartHandshake,
  AlertTriangle,
  ChevronRight,
  Sun,
  Clock,
  Compass
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { selectedWardId } = useUserStore();

  const currentWard = MOCK_WARDS.find((w) => w.id === selectedWardId) || MOCK_WARDS[0];

  // Fetch heat risk for coordinates
  const { data: riskInfo, isLoading: isRiskLoading } = useQuery({
    queryKey: ['heat-risk', currentWard.lat, currentWard.lon],
    queryFn: () => getHeatRiskAt(currentWard.lat, currentWard.lon)
  });

  // Fetch nearest cooling centres
  const { data: coolingPoints = [], isLoading: isCoolingLoading } = useQuery({
    queryKey: ['cooling-points', currentWard.lat, currentWard.lon],
    queryFn: () => getCoolingPoints(currentWard.lat, currentWard.lon)
  });

  // Fetch forecast
  const { data: forecast } = useQuery({
    queryKey: ['forecast', currentWard.id],
    queryFn: () => getForecastForWard(currentWard.id)
  });

  const quickActions = [
    {
      title: 'Heat Map',
      subtitle: 'Pune Wards',
      icon: Compass,
      path: '/map',
      bg: 'bg-[#EEF5FE]',
      textColor: 'text-[#1769E0]'
    },
    {
      title: 'Find Water',
      subtitle: 'Chilled Pyaao',
      icon: Droplet,
      path: '/map?filter=water_point',
      bg: 'bg-cyan-50',
      textColor: 'text-cyan-700'
    },
    {
      title: 'Safety Tips',
      subtitle: 'Health Guide',
      icon: HeartHandshake,
      path: '/tips',
      bg: 'bg-[#EBFBF3]',
      textColor: 'text-[#1E7E4D]'
    },
    {
      title: 'Report Hazard',
      subtitle: 'Civic Help',
      icon: AlertTriangle,
      path: '/report',
      bg: 'bg-[#FEF3ED]',
      textColor: 'text-[#F47738]'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F8FC] pb-24">
      {/* Offline sync banner if offline */}
      <OfflineBanner />

      {/* Modern Compact Header */}
      <AppHeader
        temperature={riskInfo?.air_temp_celsius || 41.5}
        unreadAlertsCount={1}
      />

      {/* Main Container constrained to mobile phone width */}
      <main className="max-w-md mx-auto px-4 pt-3 space-y-4">
        {/* 1. Prominent Current Heat-Risk Card */}
        {isRiskLoading || !riskInfo ? (
          <LoadingSkeleton rows={1} />
        ) : (
          <RiskCard riskInfo={riskInfo} />
        )}

        {/* 2. Quick Safety Actions: Compact Grid */}
        <div className="grid grid-cols-4 gap-2">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                onClick={() => navigate(action.path)}
                className="flex flex-col items-center justify-center p-2.5 bg-white border border-[#E2EAF4] rounded-2xl shadow-soft hover:border-[#B6D6FC] transition-all active:scale-95"
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 ${action.bg} ${action.textColor}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-[#173153] leading-tight text-center">
                  {action.title}
                </span>
                <span className="text-[9px] text-[#71829A] text-center mt-0.5">
                  {action.subtitle}
                </span>
              </button>
            );
          })}
        </div>

        {/* 3. Safe & Avoid Commute Hours */}
        <SafeHours
          safeHours={riskInfo?.safe_hours || currentWard.safe_hours}
          avoidHours={riskInfo?.avoid_hours || currentWard.avoid_hours}
        />

        {/* 4. Civic Response Card (Fixed: White surface, high contrast, clean typography) */}
        <div className="bg-white rounded-3xl p-4.5 border border-[#E2EAF4] shadow-soft flex items-center justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#FEF3ED] text-[#F47738] flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-[#173153] uppercase tracking-wider">
                Need help or found a heat hazard?
              </h3>
              <p className="text-xs text-[#71829A] mt-0.5 line-clamp-2">
                Report unsafe conditions or missing water facilities to Pune Municipal Corporation.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/report')}
            className="px-3.5 py-2.5 bg-[#1769E0] hover:bg-[#0E52BE] text-white text-xs font-bold rounded-2xl shadow-soft shrink-0 transition-all active:scale-95"
          >
            Report
          </button>
        </div>

        {/* 5. Nearby Cooling Centres */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <h3 className="text-xs font-bold text-[#173153] uppercase tracking-wider">
                Nearby Cooling Centres
              </h3>
              <p className="text-[11px] text-[#71829A]">
                Public shaded shelters and purified drinking water in Pune
              </p>
            </div>
            <button
              onClick={() => navigate('/map')}
              className="text-xs font-bold text-[#1769E0] hover:underline flex items-center gap-0.5 shrink-0"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {isCoolingLoading ? (
            <LoadingSkeleton rows={2} />
          ) : coolingPoints.length === 0 ? (
            <div className="p-6 bg-white rounded-3xl border border-[#E2EAF4] text-center text-xs text-[#71829A]">
              No cooling centres found in this ward. Use the map to locate citywide points.
            </div>
          ) : (
            <div className="space-y-2.5">
              {coolingPoints.slice(0, 3).map((point) => (
                <CoolingCentreCard key={point.id} point={point} />
              ))}
            </div>
          )}
        </div>

        {/* 6. Hourly Heat Forecast Preview */}
        {forecast && (
          <div className="bg-white rounded-3xl p-4 border border-[#E2EAF4] shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#173153] uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#1769E0]" />
                <span>Hourly Risk Forecast</span>
              </span>
              <span className="text-[11px] text-[#71829A] font-medium">
                Peak: <strong className="text-[#173153]">{forecast.max_temp}°C</strong>
              </span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {forecast.hourly.map((h, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center justify-between p-2.5 rounded-2xl min-w-[62px] text-center border shrink-0 ${
                    h.is_safe
                      ? 'bg-[#EBFBF3] border-[#B7EDCE] text-[#1E7E4D]'
                      : 'bg-[#FEF3ED] border-[#FCD2BE] text-[#9E4010]'
                  }`}
                >
                  <span className="text-[10px] font-bold text-[#71829A]">
                    {h.time}
                  </span>
                  <Sun
                    className={`w-4 h-4 my-1.5 ${
                      h.is_safe ? 'text-[#36B878]' : 'text-[#F47738] animate-pulse'
                    }`}
                  />
                  <span className="text-xs font-black text-[#173153]">
                    {h.temp_celsius}°C
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-1 ${
                      h.is_safe
                        ? 'bg-white text-[#1E7E4D] border border-[#B7EDCE]'
                        : 'bg-white text-[#9E4010] border border-[#FCD2BE]'
                    }`}
                  >
                    {h.heat_index_celsius}°
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
