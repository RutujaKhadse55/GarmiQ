import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Ward, CoolingPoint } from '@garmiq/types';
import { RiskBadge } from './RiskBadge';
import {
  X,
  Navigation,
  ExternalLink,
  MapPin,
  Clock,
  Sparkles,
  Phone,
  ShieldCheck,
  Building2,
  Droplet,
  Trees,
  Stethoscope,
  ChevronRight
} from 'lucide-react';

interface SelectedLocationSheetProps {
  ward: Ward | null;
  coolingPoint: CoolingPoint | null;
  onClose: () => void;
}

export const SelectedLocationSheet: React.FC<SelectedLocationSheetProps> = ({
  ward,
  coolingPoint,
  onClose
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!ward && !coolingPoint) return null;

  // Selected Cooling Point view
  if (coolingPoint) {
    const typeMeta = {
      shelter: {
        label: t('map.shelters', 'Cooling Shelter'),
        icon: Building2,
        badge: 'bg-[#EEF5FE] text-[#1769E0] border-[#D7E7FD]'
      },
      water_point: {
        label: t('map.water', 'Water Station'),
        icon: Droplet,
        badge: 'bg-cyan-50 text-cyan-700 border-cyan-200'
      },
      park: {
        label: t('map.parks', 'Shaded Park'),
        icon: Trees,
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
      },
      clinic: {
        label: t('map.clinics', 'Heat Clinic'),
        icon: Stethoscope,
        badge: 'bg-rose-50 text-rose-700 border-rose-200'
      }
    }[coolingPoint.type] || {
      label: 'Cooling Resource',
      icon: Building2,
      badge: 'bg-slate-50 text-slate-700 border-slate-200'
    };

    const TypeIcon = typeMeta.icon;

    const handleDirections = () => {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${coolingPoint.lat},${coolingPoint.lon}`;
      window.open(url, '_blank');
    };

    return (
      <div className="fixed inset-x-0 bottom-[70px] z-50 max-w-md mx-auto px-3 animate-slide-up">
        <div className="bg-white rounded-3xl p-4.5 border border-[#E2EAF4] shadow-floating">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#F5F8FC] mb-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-[#EEF5FE] text-[#1769E0] flex items-center justify-center shrink-0">
                <TypeIcon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap mb-1">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${typeMeta.badge}`}>
                    {typeMeta.label}
                  </span>
                  {coolingPoint.capacity_status && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EBFBF3] text-[#1E7E4D] border border-[#B7EDCE]">
                      {coolingPoint.capacity_status}
                    </span>
                  )}
                  {coolingPoint.distance_km !== undefined && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF5FE] text-[#1769E0] border border-[#D7E7FD]">
                      {coolingPoint.distance_km < 1
                        ? `${coolingPoint.distance_meters}m`
                        : `${coolingPoint.distance_km} km`}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-[#173153] leading-snug line-clamp-1">
                  {coolingPoint.name}
                </h3>
                <p className="text-xs text-[#71829A] truncate mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 shrink-0 text-[#71829A]" />
                  <span>{coolingPoint.address}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#F5F8FC] flex items-center justify-center text-[#71829A] hover:bg-[#EEF5FE] shrink-0 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Operating hours & phone */}
          <div className="flex items-center justify-between text-xs text-[#71829A] mb-3 px-1">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#1769E0]" />
              <span className="font-medium text-[#173153]">{coolingPoint.operating_hours || 'Open during daylight'}</span>
            </div>
            {coolingPoint.phone && (
              <a
                href={`tel:${coolingPoint.phone}`}
                className="flex items-center gap-1 text-[#1769E0] font-semibold hover:underline"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Help</span>
              </a>
            )}
          </div>

          {/* Amenities tags */}
          {coolingPoint.amenities && coolingPoint.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3.5">
              {coolingPoint.amenities.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-[#F5F8FC] border border-[#E2EAF4] rounded-lg text-[10px] font-medium text-[#173153] flex items-center gap-1"
                >
                  <Sparkles className="w-2.5 h-2.5 text-[#F3B43F]" />
                  <span>{item}</span>
                </span>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleDirections}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#1769E0] hover:bg-[#0E52BE] text-white text-xs font-bold rounded-2xl shadow-soft transition-all active:scale-[0.98]"
            >
              <Navigation className="w-3.5 h-3.5 fill-current" />
              <span>Get Directions</span>
            </button>

            <button
              onClick={() => {
                onClose();
                navigate(
                  `/route?destLat=${coolingPoint.lat}&destLon=${coolingPoint.lon}&destName=${encodeURIComponent(
                    coolingPoint.name
                  )}`
                );
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#EEF5FE] hover:bg-[#D7E7FD] text-[#1769E0] text-xs font-bold rounded-2xl border border-[#D7E7FD] transition-all active:scale-[0.98]"
            >
              <span>Shaded Route</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Selected Ward view
  return (
    <div className="fixed inset-x-0 bottom-[70px] z-50 max-w-md mx-auto px-3 animate-slide-up">
      <div className="bg-white rounded-3xl p-4.5 border border-[#E2EAF4] shadow-floating">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#F5F8FC] mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#1769E0] bg-[#EEF5FE] px-2 py-0.5 rounded-full border border-[#D7E7FD]">
                {ward.code}
              </span>
              <RiskBadge level={ward.risk_level} size="sm" />
            </div>
            <h3 className="text-sm font-bold text-[#173153]">
              {ward.name}
            </h3>
            <p className="text-xs text-[#71829A]">{ward.city} Municipal Corporation</p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F5F8FC] flex items-center justify-center text-[#71829A] hover:bg-[#EEF5FE] shrink-0 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-[#FEF3ED] p-2.5 rounded-2xl border border-[#FCD2BE]">
            <span className="text-[10px] uppercase font-bold text-[#9E4010] block">
              {t('home.heatIndex', 'Heat Index')}
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-[#173153]">
                {ward.current_heat_index}
              </span>
              <span className="text-xs font-bold text-[#F47738]">°C</span>
            </div>
            <span className="text-[10px] text-[#71829A]">Wet-Bulb: {ward.wet_bulb_celsius}°C</span>
          </div>

          <div className="bg-[#EEF5FE] p-2.5 rounded-2xl border border-[#D7E7FD]">
            <span className="text-[10px] uppercase font-bold text-[#1769E0] block">
              Vulnerability
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-[#173153]">
                {ward.vulnerability_score}
              </span>
              <span className="text-xs font-bold text-[#1769E0]">/100</span>
            </div>
            <span className="text-[10px] text-[#71829A]">{ward.cooling_points_count} Relief Points</span>
          </div>
        </div>

        {/* Safe commute hours */}
        {ward.safe_hours && ward.safe_hours.length > 0 && (
          <div className="mb-3 p-2.5 bg-[#F5F8FC] rounded-2xl border border-[#E2EAF4]">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="font-semibold text-[#1E7E4D]">Safer hours:</span>
              <span className="font-bold text-[#173153]">{ward.safe_hours.join(', ')}</span>
            </div>
            {ward.avoid_hours && ward.avoid_hours.length > 0 && (
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-[#E5484D]">Avoid midday:</span>
                <span className="font-bold text-[#173153]">{ward.avoid_hours.join(', ')}</span>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => {
            onClose();
            navigate(
              `/route?destLat=${ward.lat}&destLon=${ward.lon}&destName=${encodeURIComponent(
                ward.name
              )}`
            );
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#1769E0] hover:bg-[#0E52BE] text-white text-xs font-bold rounded-2xl shadow-soft transition-all active:scale-[0.98]"
        >
          <Navigation className="w-4 h-4 fill-current" />
          <span>Find Shaded Route to {ward.code}</span>
        </button>
      </div>
    </div>
  );
};
