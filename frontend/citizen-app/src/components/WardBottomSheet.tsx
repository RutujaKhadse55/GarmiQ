import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Ward, CoolingPoint } from '@garmiq/types';
import { RiskBadge } from './RiskBadge';
import {
  X,
  Navigation,
  Thermometer,
  ShieldAlert,
  Building2,
  Droplet,
  Trees,
  Stethoscope
} from 'lucide-react';

interface WardBottomSheetProps {
  ward: Ward | null;
  coolingPoints?: CoolingPoint[];
  onClose: () => void;
}

export const WardBottomSheet: React.FC<WardBottomSheetProps> = ({
  ward,
  coolingPoints = [],
  onClose
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!ward) return null;

  const relevantPoints = coolingPoints.filter(
    (p) => Math.abs(p.lat - ward.lat) < 0.05 && Math.abs(p.lon - ward.lon) < 0.05
  );

  return (
    <div className="fixed inset-x-0 bottom-16 z-50 max-w-md mx-auto px-3 animate-slide-up">
      <div className="bg-white rounded-3xl p-4.5 border border-[#B5D6FF] shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#F0F4F8] mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#0866D9] bg-[#EDF5FF] px-2 py-0.5 rounded-full">
                {ward.code}
              </span>
              <RiskBadge level={ward.risk_level} size="sm" />
            </div>
            <h3 className="text-base font-bold text-[#102A4C]">
              {ward.name}
            </h3>
            <p className="text-xs text-[#5B708B]">{ward.city}</p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F5F9FF] flex items-center justify-center text-[#5B708B] hover:bg-[#EDF5FF] shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-[#FFF4ED] p-2.5 rounded-xl border border-[#FED7AA]">
            <span className="text-[10px] uppercase font-bold text-[#EA580C] block">
              {t('home.heatIndex', 'Heat Index')}
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-black text-[#9A3412]">
                {ward.current_heat_index}
              </span>
              <span className="text-xs font-bold text-[#EA580C]">°C</span>
            </div>
            <span className="text-[10px] text-[#C2410C]">Wet-Bulb: {ward.wet_bulb_celsius}°C</span>
          </div>

          <div className="bg-[#EDF5FF] p-2.5 rounded-xl border border-[#BFDBFE]">
            <span className="text-[10px] uppercase font-bold text-[#0866D9] block">
              {t('map.vulnerabilityScore', 'Vulnerability')}
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-black text-[#043E8F]">
                {ward.vulnerability_score}
              </span>
              <span className="text-xs font-bold text-[#0866D9]">/100</span>
            </div>
            <span className="text-[10px] text-[#054EB0]">{ward.cooling_points_count} Relief Centers</span>
          </div>
        </div>

        {/* Nearby relief centers list */}
        {relevantPoints.length > 0 && (
          <div className="mb-3">
            <span className="text-[11px] font-bold text-[#5B708B] block mb-1.5">
              {t('home.coolingCentresTitle', 'Nearby Cooling Points')}
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {relevantPoints.slice(0, 3).map((pt) => (
                <div
                  key={pt.id}
                  className="bg-[#F8FAFD] border border-[#E2EDF9] p-2 rounded-xl shrink-0 text-left min-w-[130px]"
                >
                  <span className="text-[10px] font-semibold text-[#0866D9] block truncate">
                    {pt.name}
                  </span>
                  <span className="text-[10px] text-[#5B708B]">
                    {pt.distance_km} km away
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => {
            onClose();
            navigate(`/route?destLat=${ward.lat}&destLon=${ward.lon}&destName=${encodeURIComponent(ward.name)}`);
          }}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#0866D9] hover:bg-[#054EB0] text-white text-xs font-bold rounded-2xl shadow-sm transition-all active:scale-[0.98]"
        >
          <Navigation className="w-4 h-4 fill-current" />
          <span>{t('map.getSafeRouteBtn', 'Find Shaded Route Here')}</span>
        </button>
      </div>
    </div>
  );
};
