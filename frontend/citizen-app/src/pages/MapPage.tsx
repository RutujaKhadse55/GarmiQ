import React, { useState } from 'react';
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
import { WardBottomSheet } from '../components/WardBottomSheet';
import {
  Search,
  Building2,
  Droplet,
  Trees,
  Stethoscope,
  Layers,
  ChevronDown,
  Compass
} from 'lucide-react';

export const MapPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { selectedWardId, setSelectedWardId, lowBandwidthMode } = useUserStore();

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedWardForSheet, setSelectedWardForSheet] = useState<Ward | null>(null);

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

  const filterOptions = [
    { id: 'all', label: t('map.allTypes', 'All Places'), icon: Compass },
    { id: 'shelter', label: t('map.shelters', 'Shelters'), icon: Building2 },
    { id: 'water_point', label: t('map.water', 'Water Points'), icon: Droplet },
    { id: 'park', label: t('map.parks', 'Shaded Parks'), icon: Trees },
    { id: 'clinic', label: t('map.clinics', 'Heat Clinics'), icon: Stethoscope }
  ];

  return (
    <div className="min-h-screen bg-[#F5F9FF] pb-20">
      <main className="max-w-md mx-auto px-4 pt-3.5 space-y-3">
        {/* Top Search & Ward Selector Header */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#5B708B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={selectedWardId}
              onChange={(e) => {
                setSelectedWardId(e.target.value);
                const w = wards.find((item) => item.id === e.target.value);
                if (w) setSelectedWardForSheet(w);
              }}
              className="w-full pl-9 pr-8 py-2.5 bg-white border border-[#E2EDF9] rounded-2xl text-xs font-bold text-[#102A4C] shadow-soft focus:ring-2 focus:ring-[#0866D9] focus:outline-none cursor-pointer truncate appearance-none"
            >
              {wards.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} — {w.risk_level} ({w.current_heat_index}°C)
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-[#5B708B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Category Filter Chips */}
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
                    ? 'bg-[#0866D9] text-white border-[#0866D9] shadow-xs'
                    : 'bg-white text-[#5B708B] border-[#E2EDF9] hover:bg-[#F5F9FF]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Low bandwidth warning if active */}
        {lowBandwidthMode && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 font-medium">
            Low-Bandwidth Mode is active. Vector map tiles are optimized.
          </div>
        )}

        {/* Interactive Map Canvas */}
        <MapView
          wards={wards}
          coolingPoints={coolingPoints}
          selectedWard={selectedWardForSheet || currentWard}
          onSelectWard={(w) => {
            setSelectedWardId(w.id);
            setSelectedWardForSheet(w);
          }}
          onSelectCoolingPoint={(pt) => {
            // Find parent ward or create temporary container
            const w = wards.find((item) => item.id === selectedWardId) || wards[0];
            setSelectedWardForSheet(w);
          }}
          activeFilter={activeFilter}
        />

        {/* Ward Info Bottom Sheet */}
        <WardBottomSheet
          ward={selectedWardForSheet}
          coolingPoints={coolingPoints}
          onClose={() => setSelectedWardForSheet(null)}
        />
      </main>
    </div>
  );
};
