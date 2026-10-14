import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CoolingPoint } from '@garmiq/types';
import {
  Building2,
  Droplet,
  Trees,
  Stethoscope,
  Navigation,
  MapPin,
  Clock,
  ExternalLink
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
      label: 'Cooling Shelter',
      color: 'bg-[#EEF5FE] text-[#1769E0] border-[#D7E7FD]'
    },
    water_point: {
      icon: Droplet,
      label: 'Water Station',
      color: 'bg-cyan-50 text-cyan-700 border-cyan-200'
    },
    park: {
      icon: Trees,
      label: 'Shaded Park',
      color: 'bg-[#EBFBF3] text-[#1E7E4D] border-[#B7EDCE]'
    },
    clinic: {
      icon: Stethoscope,
      label: 'Heat Clinic',
      color: 'bg-[#FDF0F1] text-[#A81F26] border-[#F9C3C6]'
    }
  }[point.type] || {
    icon: Building2,
    label: point.type,
    color: 'bg-slate-50 text-slate-700 border-slate-200'
  };

  const IconComponent = typeConfig.icon;

  const handleDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
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
    <div className="bg-white rounded-3xl p-4 border border-[#E2EAF4] shadow-soft hover:border-[#B6D6FC] transition-all">
      {/* Top Header: Icon + Info & Distance */}
      <div className="flex items-start justify-between gap-2.5 mb-2.5">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-[#EEF5FE] text-[#1769E0] flex items-center justify-center shrink-0">
            <IconComponent className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            {/* Badges */}
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${typeConfig.color}`}>
                {typeConfig.label}
              </span>
              {point.capacity_status && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EBFBF3] text-[#1E7E4D] border border-[#B7EDCE]">
                  {point.capacity_status}
                </span>
              )}
            </div>

            {/* Title & Address 2-line hierarchy */}
            <h4 className="text-sm font-bold text-[#173153] leading-snug line-clamp-1">
              {point.name}
            </h4>
            <p className="text-xs text-[#71829A] truncate mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#71829A] shrink-0" />
              <span>{point.address}</span>
            </p>
          </div>
        </div>

        {/* Distance Badge */}
        {point.distance_km !== undefined && (
          <div className="shrink-0 text-right">
            <span className="text-xs font-bold text-[#1769E0] bg-[#EEF5FE] border border-[#D7E7FD] px-2.5 py-1 rounded-full inline-block">
              {point.distance_km < 1
                ? `${point.distance_meters}m`
                : `${point.distance_km} km`}
            </span>
          </div>
        )}
      </div>

      {/* Operating Hours */}
      {point.operating_hours && (
        <div className="flex items-center gap-1.5 text-[11px] text-[#71829A] mb-3 px-1">
          <Clock className="w-3 h-3 text-[#71829A]" />
          <span>{point.operating_hours}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-[#F5F8FC]">
        <button
          onClick={handleDirections}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-[#1769E0] hover:bg-[#0E52BE] text-white text-xs font-bold rounded-2xl shadow-soft transition-all active:scale-[0.98]"
        >
          <Navigation className="w-3.5 h-3.5 fill-current" />
          <span>Directions</span>
        </button>

        <button
          onClick={handleViewOnMap}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-[#EEF5FE] hover:bg-[#D7E7FD] text-[#1769E0] text-xs font-bold rounded-2xl border border-[#D7E7FD] transition-all active:scale-[0.98]"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>View on Map</span>
        </button>
      </div>
    </div>
  );
};
