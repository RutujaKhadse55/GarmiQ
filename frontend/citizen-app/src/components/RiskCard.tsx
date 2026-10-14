import React from 'react';
import { useTranslation } from 'react-i18next';
import { HeatRiskInfo } from '@garmiq/types';
import { RiskBadge } from './RiskBadge';
import { Thermometer, Droplets, Clock, AlertTriangle, ShieldAlert } from 'lucide-react';

interface RiskCardProps {
  riskInfo: HeatRiskInfo;
}

export const RiskCard: React.FC<RiskCardProps> = ({ riskInfo }) => {
  const { t } = useTranslation();

  const isSevere = ['HIGH', 'VERY_HIGH', 'EXTREME'].includes(riskInfo.risk_level);

  // Background and styling based on severity
  const cardGradient = isSevere
    ? 'bg-linear-to-br from-white via-[#FFF8F5] to-[#FEF3EE] border-[#FED7AA]'
    : 'bg-linear-to-br from-white via-[#F5F9FF] to-[#EBF3FE] border-[#D6E8FF]';

  return (
    <div className={`relative overflow-hidden rounded-3xl p-5 border shadow-elevated ${cardGradient} transition-all`}>
      {/* Top row: Date & Live Badge */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-1.5 text-xs font-medium text-[#5B708B]">
          <Clock className="w-3.5 h-3.5 text-[#5B708B]" />
          <span>
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} • {riskInfo.last_updated}
          </span>
        </div>
        <RiskBadge level={riskInfo.risk_level} size="md" />
      </div>

      {/* Main Temperature & Heat Index Display */}
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-[#5B708B] block mb-1">
            {t('home.heatIndex', 'Heat Index')}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl sm:text-5xl font-extrabold text-[#102A4C] tracking-tight">
              {riskInfo.heat_index_celsius}
            </span>
            <span className="text-xl font-bold text-[#EA580C]">°C</span>
          </div>
          <span className="text-xs text-[#5B708B] mt-0.5 block">
            {riskInfo.alert_level}
          </span>
        </div>

        {/* Wet-Bulb Box */}
        <div className="bg-white/80 backdrop-blur-xs p-3 rounded-2xl border border-[#E2EDF9] text-right shadow-xs">
          <div className="flex items-center justify-end gap-1 text-[11px] font-semibold text-[#0866D9] mb-0.5">
            <Droplets className="w-3 h-3 text-[#0866D9]" />
            <span>{t('home.wetBulb', 'Wet-Bulb')}</span>
          </div>
          <span className="text-xl font-bold text-[#102A4C]">
            {riskInfo.wet_bulb_celsius}°C
          </span>
          <span className="text-[10px] text-[#5B708B] block">
            Humidity: {riskInfo.humidity_pct}%
          </span>
        </div>
      </div>

      {/* Actionable recommendation banner */}
      <div className={`rounded-2xl p-3.5 flex items-start gap-3 border ${
        isSevere
          ? 'bg-[#FFF1EC] text-[#9A3412] border-[#FDBA74]'
          : 'bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]'
      }`}>
        {isSevere ? (
          <AlertTriangle className="w-5 h-5 text-[#EA580C] shrink-0 mt-0.5" />
        ) : (
          <ShieldAlert className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
        )}
        <div className="text-xs leading-relaxed font-medium">
          {riskInfo.advisory}
        </div>
      </div>
    </div>
  );
};
