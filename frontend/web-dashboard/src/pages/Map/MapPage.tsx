import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Layers,
  MapPin,
  Flame,
  ChevronRight,
  Cpu,
  BarChart2,
  Sliders,
  Filter,
  X,
  ExternalLink,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { RiskBadge } from '../../components/common/RiskBadge';
import { RiskMap } from '../../components/maps/RiskMap';
import { useWards } from '../../hooks/useQueries';

export const MapPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialWard = searchParams.get('ward');

  const [selectedWardId, setSelectedWardId] = useState<string | null>(initialWard);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const { data: wards = [] } = useWards();
  const selectedWard = wards.find((w) => w.id === selectedWardId) || wards[0];

  return (
    <div className="space-y-4 select-none animate-fadeIn">
      <PageHeader
        title="City Heat-Risk Map"
        subtitle="High-resolution spatial thermal risk mapping across Pune municipal wards"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Heat-Risk Map' }]}
        actions={
          <div className="flex items-center gap-2">
            <select
              value={selectedWardId || ''}
              onChange={(e) => setSelectedWardId(e.target.value || null)}
              className="px-3 py-1.5 rounded-xl border border-[#DFEAF7] bg-white text-xs font-semibold text-[#102442] focus:outline-none cursor-pointer"
            >
              <option value="">Select Ward to Focus...</option>
              {wards.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.current_heat_index}°C - {w.risk_level})
                </option>
              ))}
            </select>
          </div>
        }
      />

      {/* Main Map Container with Side Inspector */}
      <div className="relative rounded-card overflow-hidden border border-[#DFEAF7] bg-white shadow-soft">
        <RiskMap
          height="calc(100vh - 220px)"
          selectedWardId={selectedWardId}
          onSelectWard={(id) => {
            setSelectedWardId(id);
            setIsDrawerOpen(true);
          }}
          showControls={true}
        />

        {/* Collapsible Ward Details Drawer */}
        {selectedWard && isDrawerOpen && (
          <div className="absolute top-4 right-4 z-20 w-80 max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-md rounded-2xl border border-[#DFEAF7] shadow-modal p-5 animate-fadeIn">
            <div className="flex items-start justify-between pb-3 border-b border-[#DFEAF7]">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#0866D9] uppercase">
                  {selectedWard.code}
                </span>
                <h3 className="text-base font-bold text-[#102442] leading-tight">
                  {selectedWard.name}
                </h3>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-[#7186A3] hover:text-[#102442] p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3 flex items-center justify-between">
              <RiskBadge level={selectedWard.risk_level} size="md" />
              <div className="text-right">
                <span className="text-[10px] text-[#7186A3] block">Heat Index</span>
                <span className="text-lg font-black text-red-600">
                  {selectedWard.current_heat_index}°C
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <span className="text-[10px] text-[#7186A3] block">HVI Score</span>
                <span className="font-extrabold text-[#102442]">
                  {selectedWard.hvi || selectedWard.vulnerability_score}/100
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#7186A3] block">Wet Bulb</span>
                <span className="font-semibold text-slate-700">
                  {selectedWard.wet_bulb_celsius}°C
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#7186A3] block">Tree Canopy</span>
                <span className="font-semibold text-emerald-700">
                  {selectedWard.tree_canopy_pct || 12.4}%
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#7186A3] block">Cooling Points</span>
                <span className="font-semibold text-[#0866D9]">
                  {selectedWard.cooling_points_count || 6} Centres
                </span>
              </div>
            </div>

            <div className="mt-3 text-[11px] text-[#7186A3]">
              <span className="font-semibold text-[#102442]">Safe Outdoor Hours: </span>
              {selectedWard.safe_hours?.join(', ') || '06:00 - 10:00, 18:00 - 21:00'}
            </div>

            <div className="mt-4 pt-3 border-t border-[#DFEAF7] flex flex-col gap-2">
              <button
                onClick={() => navigate(`/wards/${selectedWard.id}`)}
                className="w-full py-2 rounded-xl bg-[#0866D9] hover:bg-[#0756B8] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>View Full Ward Analysis</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => navigate(`/simulator?ward=${selectedWard.id}`)}
                className="w-full py-2 rounded-xl border border-[#DFEAF7] bg-white hover:bg-slate-50 text-[#102442] text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
              >
                <Cpu className="w-3.5 h-3.5 text-[#0866D9]" />
                <span>Simulate Cooling Interventions</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
