import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CoolingPoint } from '@garmiq/types';
import {
  Building2,
  Droplet,
  Trees,
  Stethoscope,
  Navigation2,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';

interface CoolingCentreCardProps {
  point: CoolingPoint;
  onSelectOnMap?: (point: CoolingPoint) => void;
}

export const CoolingCentreCard: React.FC<CoolingCentreCardProps> = ({
  point,
  onSelectOnMap
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const typeConfig = {
    shelter: {
      icon: Building2,
      label: t('map.shelters', 'Cooling Shelter'),
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    water_point: {
      icon: Droplet,
      label: t('map.water', 'Water Station'),
      color: 'bg-cyan-50 text-cyan-700 border-cyan-200'
    },
    park: {
      icon: Trees,
      label: t('map.parks', 'Shaded Park'),
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    clinic: {
      icon: Stethoscope,
      label: t('map.clinics', 'Heat Clinic'),
      color: 'bg-rose-50 text-rose-700 border-rose-200'
    }
  }[point.type] || {
    icon: Building2,
    label: point.type,
    color: 'bg-slate-50 text-slate-700 border-slate-200'
  };

  const IconComponent = typeConfig.icon;

  const handleDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Open Google Maps directions in new tab
    const url = `https://www.google.com/maps/dir/?api=1&destination=${point.lat},${point.lon}`;
    window.open(url, '_blank');
  };

  const handleViewOnMap = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelectOnMap) {
      onSelectOnMap(point);
    } else {
      navigate(`/map?point=${point.id}&lat=${point.lat}&lon=${point.lon}`);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-[#E2EDF9] shadow-soft hover:border-[#B5D6FF] transition-all">
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#EDF5FF] text-[#0866D9] flex items-center justify-center shrink-0">
            <IconComponent className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${typeConfig.color}`}>
                {typeConfig.label}
              </span>
              {point.capacity_status && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {point.capacity_status}
                </span>
              )}
            </div>
            <h4 className="text-sm font-bold text-[#102A4C] leading-snug line-clamp-1">
              {point.name}
            </h4>
            <p className="text-xs text-[#5B708B] truncate mt-0.5">
              {point.address}
            </p>
          </div>
        </div>

        {/* Distance pill */}
        <div className="text-right shrink-0">
          <span className="text-xs font-bold text-[#0866D9] bg-[#EDF5FF] px-2 py-1 rounded-lg inline-block">
            {point.distance_km < 1
              ? `${point.distance_meters}m`
              : `${point.distance_km} ${t('common.km', 'km')}`}
          </span>
        </div>
      </div>

      {/* Operating hours & Amenities */}
      <div className="flex items-center gap-3 text-[11px] text-[#5B708B] mb-3">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-[#5B708B]" />
          {point.operating_hours}
        </span>
        {point.amenities?.length > 0 && (
          <span className="flex items-center gap-1 truncate">
            <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
            <span className="truncate">{point.amenities.slice(0, 2).join(' • ')}</span>
          </span>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-[#F0F4F8]">
        <button
          onClick={handleDirections}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-[#0866D9] hover:bg-[#054EB0] text-white text-xs font-semibold rounded-xl transition-all active:scale-[0.98]"
        >
          <Navigation2 className="w-3.5 h-3.5 fill-current" />
          <span>{t('common.directions', 'Directions')}</span>
        </button>

        <button
          onClick={handleViewOnMap}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-[#EDF5FF] hover:bg-[#D6E8FF] text-[#0866D9] text-xs font-semibold rounded-xl transition-all active:scale-[0.98]"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>{t('nav.map', 'View on Map')}</span>
        </button>
      </div>
    </div>
  );
};
