import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '../stores/useUserStore';
import {
  MOCK_WARDS,
  getCoolingPoints,
  getWards
} from '@garmiq/api-client';
import { Ward, CoolingPoint } from '@garmiq/types';
import { MapView } from '../components/MapView';
import { SelectedLocationSheet } from '../components/SelectedLocationSheet';
import {
  Search,
  Building2,
  Droplet,
  Trees,
  Stethoscope,
  Compass,
  ChevronDown,
  MapPin
} from 'lucide-react';

export const MapPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { selectedWardId, setSelectedWardId, lowBandwidthMode } = useUserStore();

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedWardForSheet, setSelectedWardForSheet] = useState<Ward | null>(null);
  const [selectedPointForSheet, setSelectedPointForSheet] = useState<CoolingPoint | null>(null);

  // Load wards
  const { data: wards = MOCK_WARDS } = useQuery({
    queryKey: ['wards'],
    queryFn: getWards
  });

  // Load cooling points
  const { data: coolingPoints = [] } = useQuery({
    queryKey: ['cooling-points'],
    queryFn: () => getCoolingPoints()
  });

  const currentWard = wards.find((w) => w.id === selectedWardId) || wards[0];

  // Sync query params (e.g. ?point=... or ?filter=...)
  useEffect(() => {
    const pointId = searchParams.get('point');
    const filter = searchParams.get('filter');

    if (filter) {
      setActiveFilter(filter);
    }
    if (pointId && coolingPoints.length > 0) {
      const pt = coolingPoints.find((p) => p.id === pointId);
      if (pt) {
        setSelectedPointForSheet(pt);
        setSelectedWardForSheet(null);
      }
    }
  }, [searchParams, coolingPoints]);

  const filterOptions = [
    { id: 'all', label: t('map.allTypes', 'All Places'), icon: Compass },
    { id: 'shelter', label: t('map.shelters', 'Cooling Shelters'), icon: Building2 },
    { id: 'water_point', label: t('map.water', 'Water Stations'), icon: Droplet },
    { id: 'park', label: t('map.parks', 'Shaded Parks'), icon: Trees },
    { id: 'clinic', label: t('map.clinics', 'Heat Clinics'), icon: Stethoscope }
  ];

  return (
    <div className="min-h-screen bg-[#F5F8FC] pb-24">
      <main className="max-w-md mx-auto px-4 pt-3 space-y-2.5">
        {/* Top Ward Selector Header */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <MapPin className="w-4 h-4 text-[#1769E0] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={selectedWardId}
              onChange={(e) => {
                setSelectedWardId(e.target.value);
                const w = wards.find((item) => item.id === e.target.value);
                if (w) {
                  setSelectedWardForSheet(w);
                  setSelectedPointForSheet(null);
                }
              }}
              className="w-full pl-9 pr-8 py-2.5 bg-white border border-[#E2EAF4] rounded-2xl text-xs font-bold text-[#173153] shadow-soft focus:ring-2 focus:ring-[#1769E0] focus:outline-none cursor-pointer truncate appearance-none"
            >
              {wards.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} • {w.risk_level} ({w.current_heat_index}°C)
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-[#71829A] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Compact Segmented Control / Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {filterOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = activeFilter === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setActiveFilter(opt.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border shrink-0 transition-all ${
                  isSelected
                    ? 'bg-[#1769E0] text-white border-[#1769E0] shadow-soft'
                    : 'bg-white text-[#71829A] border-[#E2EAF4] hover:bg-[#F5F8FC]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Low bandwidth notice if applicable */}
        {lowBandwidthMode && (
          <div className="p-2.5 bg-[#FEF9EE] border border-[#FCE3AA] rounded-2xl text-[11px] text-[#9A6B0A] font-medium">
            Low-Bandwidth Mode active. Tiles and relief markers are optimized.
          </div>
        )}

        {/* Interactive Pune Map */}
        <MapView
          wards={wards}
          coolingPoints={coolingPoints}
          selectedWard={selectedWardForSheet || currentWard}
          selectedCoolingPoint={selectedPointForSheet}
          onSelectWard={(w) => {
            setSelectedWardId(w.id);
            setSelectedWardForSheet(w);
            setSelectedPointForSheet(null);
          }}
          onSelectCoolingPoint={(pt) => {
            setSelectedPointForSheet(pt);
            setSelectedWardForSheet(null);
          }}
          activeFilter={activeFilter}
        />

        {/* Selected Marker or Ward Bottom Sheet */}
        <SelectedLocationSheet
          ward={selectedWardForSheet}
          coolingPoint={selectedPointForSheet}
          onClose={() => {
            setSelectedWardForSheet(null);
            setSelectedPointForSheet(null);
          }}
        />
      </main>
    </div>
  );
};
