import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HeatRiskInfo } from '@garmiq/types';
import { RiskBadge } from './RiskBadge';
import {
  Thermometer,
  Droplets,
  Clock,
  AlertTriangle,
  ArrowRight,
  Map as MapIcon
} from 'lucide-react';

interface RiskCardProps {
  riskInfo: HeatRiskInfo;
}

export const RiskCard: React.FC<RiskCardProps> = ({ riskInfo }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isSevere = ['HIGH', 'VERY_HIGH', 'EXTREME'].includes(riskInfo.risk_level);

  return (
    <div className="bg-white rounded-3xl p-5 border border-[#E2EAF4] shadow-soft transition-all">
      {/* Top row: Section Title & Risk Badge */}
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <span className="text-xs font-bold text-[#173153] uppercase tracking-wider block">
            Current Heat Risk
          </span>
          <span className="text-[10px] text-[#71829A] flex items-center gap-1 mt-0.5">
            <Clock className="w-3 h-3 text-[#71829A]" />
            <span>Updated {riskInfo.last_updated}</span>
          </span>
        </div>
        <RiskBadge level={riskInfo.risk_level} size="md" />
      </div>

      {/* Main Metric Row: Temperature & Wet-Bulb */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <span className="text-[11px] font-semibold text-[#71829A] block mb-0.5">
            Air Temperature
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl sm:text-5xl font-black text-[#173153] tracking-tight">
              {riskInfo.air_temp_celsius || riskInfo.heat_index_celsius}
            </span>
            <span className="text-xl font-bold text-[#F47738]">°C</span>
          </div>
          <span className="text-xs text-[#71829A] font-medium mt-0.5 block">
            Heat Index: <strong className="text-[#173153]">{riskInfo.heat_index_celsius}°C</strong>
          </span>
        </div>

        {/* Wet-Bulb metric card */}
        {riskInfo.wet_bulb_celsius !== undefined && (
          <div className="bg-[#F5F8FC] p-3 rounded-2xl border border-[#E2EAF4] text-right">
            <div className="flex items-center justify-end gap-1 text-[11px] font-semibold text-[#1769E0] mb-0.5">
              <Droplets className="w-3 h-3 text-[#1769E0]" />
              <span>Wet-Bulb Temp</span>
            </div>
            <span className="text-xl font-bold text-[#173153]">
              {riskInfo.wet_bulb_celsius}°C
            </span>
            <span className="text-[10px] text-[#71829A] block">
              Humidity {riskInfo.humidity_pct}%
            </span>
          </div>
        )}
      </div>

      {/* Safety recommendation box */}
      <div
        className={`rounded-2xl p-3 mb-4 flex items-start gap-2.5 border ${
          isSevere
            ? 'bg-[#FEF3ED] text-[#9E4010] border-[#FCD2BE]'
            : 'bg-[#EEF5FE] text-[#0E52BE] border-[#D7E7FD]'
        }`}
      >
        <AlertTriangle
          className={`w-4 h-4 shrink-0 mt-0.5 ${
            isSevere ? 'text-[#F47738]' : 'text-[#1769E0]'
          }`}
        />
        <p className="text-xs leading-relaxed font-medium">
          {riskInfo.advisory || 'Extreme daytime heat. Reschedule strenuous outdoor activity.'}
        </p>
      </div>

      {/* Clear View Heat Map Action */}
      <button
        onClick={() => navigate('/map')}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#1769E0] hover:bg-[#0E52BE] text-white text-xs font-bold rounded-2xl shadow-soft transition-all active:scale-[0.98]"
      >
        <MapIcon className="w-4 h-4" />
        <span>View City Heat Map</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
