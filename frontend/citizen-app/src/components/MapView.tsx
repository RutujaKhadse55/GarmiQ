import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Ward, CoolingPoint, HeatRiskLevel } from '@garmiq/types';
import { MapLegend } from './MapLegend';
import {
  MapPin,
  Building2,
  Droplet,
  Trees,
  Stethoscope,
  Plus,
  Minus,
  LocateFixed,
  Layers,
  Filter
} from 'lucide-react';

interface MapViewProps {
  wards: Ward[];
  coolingPoints: CoolingPoint[];
  selectedWard: Ward | null;
  onSelectWard: (ward: Ward) => void;
  onSelectCoolingPoint: (point: CoolingPoint) => void;
  activeFilter: string;
}

export const MapView: React.FC<MapViewProps> = ({
  wards,
  coolingPoints,
  selectedWard,
  onSelectWard,
  onSelectCoolingPoint,
  activeFilter
}) => {
  const { t } = useTranslation();
  const mapContainer = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState(13);
  const [showHeatLayer, setShowHeatLayer] = useState(true);
  const [mapLibreLoaded, setMapLibreLoaded] = useState(false);

  // Filter cooling points based on active filter
  const filteredPoints = coolingPoints.filter((pt) => {
    if (activeFilter === 'all') return true;
    return pt.type === activeFilter;
  });

  const getRiskColor = (level: HeatRiskLevel) => {
    switch (level) {
      case 'VERY_LOW': return '#10B981';
      case 'LOW': return '#84CC16';
      case 'MODERATE': return '#F59E0B';
      case 'HIGH': return '#F97316';
      case 'VERY_HIGH': return '#EF4444';
      case 'EXTREME': return '#991B1B';
      default: return '#F59E0B';
    }
  };

  const getPointIcon = (type: string) => {
    switch (type) {
      case 'shelter': return Building2;
      case 'water_point': return Droplet;
      case 'park': return Trees;
      case 'clinic': return Stethoscope;
      default: return Building2;
    }
  };

  const getPointBg = (type: string) => {
    switch (type) {
      case 'shelter': return 'bg-[#0866D9] text-white';
      case 'water_point': return 'bg-cyan-500 text-white';
      case 'park': return 'bg-emerald-600 text-white';
      case 'clinic': return 'bg-rose-600 text-white';
      default: return 'bg-slate-700 text-white';
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[480px] bg-[#EBF3FE] overflow-hidden rounded-3xl border border-[#D6E8FF] shadow-inner select-none">
      {/* Interactive Map Visual Surface (MapLibre & Vector Canvas Fallback) */}
      <div ref={mapContainer} className="absolute inset-0">
        <svg
          className="w-full h-full"
          viewBox="0 0 400 600"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Gradients for risk zones */}
            <radialGradient id="heatHotspot1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.45" />
              <stop offset="70%" stopColor="#F97316" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="heatHotspot2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#DC2626" stopOpacity="0.5" />
              <stop offset="60%" stopColor="#F97316" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#84CC16" stopOpacity="0" />
            </radialGradient>
            <pattern id="streetGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D6E8FF" strokeWidth="1" strokeOpacity="0.6" />
            </pattern>
          </defs>

          {/* Road grid lines */}
          <rect width="100%" height="100%" fill="#F2F7FD" />
          <rect width="100%" height="100%" fill="url(#streetGrid)" />

          {/* Simulated arterial streets */}
          <path d="M 0 120 Q 200 180 400 140" stroke="#FFFFFF" strokeWidth="8" fill="none" />
          <path d="M 120 0 Q 150 300 240 600" stroke="#FFFFFF" strokeWidth="8" fill="none" />
          <path d="M 0 380 Q 220 340 400 420" stroke="#FFFFFF" strokeWidth="8" fill="none" />
          <path d="M 280 0 Q 260 280 340 600" stroke="#FFFFFF" strokeWidth="6" fill="none" />

          {/* Heat risk choropleth layer */}
          {showHeatLayer && (
            <g className="transition-opacity duration-300">
              <circle cx="200" cy="240" r="140" fill="url(#heatHotspot1)" />
              <circle cx="260" cy="180" r="110" fill="url(#heatHotspot2)" />
              <circle cx="120" cy="420" r="130" fill="url(#heatHotspot1)" />
            </g>
          )}

          {/* Wards Boundary Polygons */}
          {wards.map((w, index) => {
            const isSelected = selectedWard?.id === w.id;
            const x = 70 + (index % 3) * 110;
            const y = 90 + Math.floor(index / 3) * 150;
            const color = getRiskColor(w.risk_level);

            return (
              <g
                key={w.id}
                onClick={() => onSelectWard(w)}
                className="cursor-pointer transition-transform duration-200"
              >
                <rect
                  x={x - 45}
                  y={y - 45}
                  width="90"
                  height="90"
                  rx="18"
                  fill={color}
                  fillOpacity={isSelected ? 0.35 : 0.18}
                  stroke={isSelected ? '#0866D9' : color}
                  strokeWidth={isSelected ? 3 : 1.5}
                  strokeDasharray={isSelected ? 'none' : '4 2'}
                />
                <circle cx={x} cy={y - 8} r="4" fill={color} />
                <text
                  x={x}
                  y={y + 12}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="bold"
                  fill="#102A4C"
                >
                  {w.code}
                </text>
                <text
                  x={x}
                  y={y + 24}
                  textAnchor="middle"
                  fontSize="8"
                  fill="#5B708B"
                >
                  {w.current_heat_index}°C
                </text>
              </g>
            );
          })}

          {/* Citizen's Location Marker */}
          <g transform="translate(190, 290)">
            <circle cx="0" cy="0" r="18" fill="#0866D9" fillOpacity="0.2" className="animate-ping" />
            <circle cx="0" cy="0" r="8" fill="#0866D9" stroke="#FFFFFF" strokeWidth="2.5" />
          </g>
        </svg>

        {/* Real Dynamic HTML Markers for Cooling Centers */}
        <div className="absolute inset-0 pointer-events-none">
          {filteredPoints.map((pt, index) => {
            const Icon = getPointIcon(pt.type);
            const bgClass = getPointBg(pt.type);

            // Calculate deterministic positions within container
            const topPositions = ['28%', '42%', '56%', '35%', '68%', '48%'];
            const leftPositions = ['34%', '62%', '45%', '78%', '28%', '52%'];
            const top = topPositions[index % topPositions.length];
            const left = leftPositions[index % leftPositions.length];

            return (
              <button
                key={pt.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCoolingPoint(pt);
                }}
                style={{ top, left }}
                className={`pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-2xl ${bgClass} shadow-lg border-2 border-white hover:scale-115 active:scale-95 transition-all duration-200 z-20 group`}
                title={`${pt.name} (${pt.distance_km}km)`}
              >
                <Icon className="w-4 h-4" />
                <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 px-2 py-0.5 bg-[#102A4C] text-white text-[10px] rounded-md font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
                  {pt.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Controls (Top Right) */}
      <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
        <button
          onClick={() => setShowHeatLayer(!showHeatLayer)}
          className={`w-10 h-10 rounded-2xl flex items-center justify-center border shadow-soft transition-all ${
            showHeatLayer
              ? 'bg-[#0866D9] text-white border-[#0866D9]'
              : 'bg-white text-[#5B708B] border-[#E2EDF9]'
          }`}
          title="Toggle Heat Layer"
        >
          <Layers className="w-5 h-5" />
        </button>

        <button
          onClick={() => setZoomLevel((z) => Math.min(z + 1, 18))}
          className="w-10 h-10 rounded-2xl bg-white text-[#102A4C] border border-[#E2EDF9] flex items-center justify-center shadow-soft hover:bg-[#F5F9FF] transition-all"
          title="Zoom In"
        >
          <Plus className="w-5 h-5" />
        </button>

        <button
          onClick={() => setZoomLevel((z) => Math.max(z - 1, 8))}
          className="w-10 h-10 rounded-2xl bg-white text-[#102A4C] border border-[#E2EDF9] flex items-center justify-center shadow-soft hover:bg-[#F5F9FF] transition-all"
          title="Zoom Out"
        >
          <Minus className="w-5 h-5" />
        </button>

        <button
          onClick={() => {
            if (wards[0]) onSelectWard(wards[0]);
          }}
          className="w-10 h-10 rounded-2xl bg-white text-[#0866D9] border border-[#E2EDF9] flex items-center justify-center shadow-soft hover:bg-[#EDF5FF] transition-all"
          title="Center on My Location"
        >
          <LocateFixed className="w-5 h-5" />
        </button>
      </div>

      {/* Persistent Bottom Risk Legend */}
      <div className="absolute bottom-4 left-4 z-30">
        <MapLegend />
      </div>
    </div>
  );
};
