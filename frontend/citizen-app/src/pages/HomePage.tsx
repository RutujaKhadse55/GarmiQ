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
import { HeatMetricCard } from '../components/HeatMetricCard';
import { SafeHours } from '../components/SafeHours';
import { CoolingCentreCard } from '../components/CoolingCentreCard';
import { OfflineBanner } from '../components/OfflineBanner';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import {
  Flame,
  Droplets,
  AlertTriangle,
  HeartHandshake,
  ArrowRight,
  PlusCircle,
  Clock,
  Sparkles,
  ChevronRight,
  Sun
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { selectedWardId, userLocation } = useUserStore();

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

  return (
    <div className="min-h-screen bg-[#F5F9FF] pb-24">
      {/* Offline sync banner */}
      <OfflineBanner />

      {/* Main Header */}
      <AppHeader
        temperature={riskInfo?.air_temp_celsius || 41.5}
        unreadAlertsCount={1}
      />

      {/* Main Container constrained to mobile phone width */}
      <main className="max-w-md mx-auto px-4 pt-3.5 space-y-4">
        {/* Welcome Greeting */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-[#102A4C] tracking-tight">
              {t('home.greeting', 'Hello, Citizen')} 👋
            </h2>
            <p className="text-xs text-[#5B708B]">
              {currentWard.name} • {t('home.heatRiskCardTitle', 'Current Heat Risk')}
            </p>
          </div>
          <button
            onClick={() => navigate('/tips')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#EDF5FF] hover:bg-[#D6E8FF] text-[#0866D9] text-xs font-bold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Safety Tips</span>
          </button>
        </div>

        {/* 1. Large Prominent Heat Risk Card */}
        {isRiskLoading || !riskInfo ? (
          <LoadingSkeleton rows={1} />
        ) : (
          <RiskCard riskInfo={riskInfo} />
        )}

        {/* 2. Three Compact Safety Metric Cards */}
        {riskInfo && (
          <div className="grid grid-cols-3 gap-2">
            <HeatMetricCard
              label={t('home.heatIndex', 'Heat Index')}
              value={riskInfo.heat_index_celsius}
              unit="°C"
              subtext="Felt air temp"
              icon={Flame}
              iconBgColor="bg-[#FFF4ED]"
              iconColor="text-[#F97316]"
            />
            <HeatMetricCard
              label={t('home.wetBulb', 'Wet-Bulb')}
              value={riskInfo.wet_bulb_celsius}
              unit="°C"
              subtext="Evap limit"
              icon={Droplets}
              iconBgColor="bg-[#EDF5FF]"
              iconColor="text-[#0866D9]"
            />
            <HeatMetricCard
              label={t('home.alertLevel', 'Alert Level')}
              value={riskInfo.alert_level.split(' ')[0]}
              subtext="IMD Warning"
              icon={AlertTriangle}
              iconBgColor="bg-[#FEF3EE]"
              iconColor="text-[#EA580C]"
            />
          </div>
        )}

        {/* 3. Safe & Avoid Hours */}
        {riskInfo && (
          <SafeHours
            safeHours={riskInfo.safe_hours}
            avoidHours={riskInfo.avoid_hours}
          />
        )}

        {/* 4. Prominent "Report a Heat Issue" Action Banner */}
        <div className="bg-linear-to-r from-[#0866D9] to-[#043E8F] rounded-3xl p-4.5 text-white shadow-elevated flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200 block mb-0.5">
              Civic Response
            </span>
            <h3 className="text-sm font-bold text-white leading-tight">
              {t('home.reportBannerTitle', 'Felt dangerous heat or lack of water?')}
            </h3>
            <p className="text-[11px] text-blue-100 mt-1 line-clamp-1">
              Help deploy cooling tankers & shade by reporting hotspots.
            </p>
          </div>

          <button
            onClick={() => navigate('/report')}
            className="px-3.5 py-2.5 bg-white text-[#0866D9] hover:bg-blue-50 text-xs font-bold rounded-2xl shadow-sm shrink-0 flex items-center gap-1.5 transition-all active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report</span>
          </button>
        </div>

        {/* 5. Nearest Cooling Centers (3 items + View All) */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <h3 className="text-sm font-bold text-[#102A4C]">
                {t('home.coolingCentresTitle', 'Nearby Cooling Centers')}
              </h3>
              <p className="text-[11px] text-[#5B708B]">
                {t('home.coolingCentresSubtitle', 'Air-conditioned public shelters & drinking water')}
              </p>
            </div>
            <button
              onClick={() => navigate('/map')}
              className="text-xs font-bold text-[#0866D9] hover:underline flex items-center gap-0.5 shrink-0"
            >
              <span>{t('common.viewAll', 'View All')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {isCoolingLoading ? (
            <LoadingSkeleton rows={2} />
          ) : (
            <div className="space-y-2.5">
              {coolingPoints.slice(0, 3).map((point) => (
                <CoolingCentreCard key={point.id} point={point} />
              ))}
            </div>
          )}
        </div>

        {/* 6. Hourly Forecast Preview */}
        {forecast && (
          <div className="bg-white rounded-3xl p-4 border border-[#E2EDF9] shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#102A4C] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#0866D9]" />
                <span>{t('home.forecastPreviewTitle', 'Hourly Risk Forecast')}</span>
              </span>
              <span className="text-[11px] text-[#5B708B] font-medium">
                Max: {forecast.max_temp}°C
              </span>
            </div>

            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
              {forecast.hourly.map((h, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center justify-between p-2.5 rounded-2xl min-w-[62px] text-center border shrink-0 ${
                    h.is_safe
                      ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                      : 'bg-orange-50/60 border-orange-200 text-orange-900'
                  }`}
                >
                  <span className="text-[10px] font-semibold text-[#5B708B]">
                    {h.time}
                  </span>
                  <Sun className={`w-4 h-4 my-1.5 ${h.is_safe ? 'text-amber-500' : 'text-orange-600 animate-pulse'}`} />
                  <span className="text-xs font-bold">
                    {h.temp_celsius}°C
                  </span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full mt-1 ${
                    h.is_safe ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'
                  }`}>
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
