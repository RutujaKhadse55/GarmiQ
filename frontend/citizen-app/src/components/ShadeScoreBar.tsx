import React from 'react';
import { useTranslation } from 'react-i18next';
import { Trees, ShieldCheck, Sun, Info } from 'lucide-react';

interface ShadeScoreBarProps {
  score: number; // 0 to 100
  distanceKm: number;
  durationMins: number;
  mode: 'walk' | 'bike';
  routeName?: string;
}

export const ShadeScoreBar: React.FC<ShadeScoreBarProps> = ({
  score,
  distanceKm,
  durationMins,
  mode,
  routeName = 'Recommended Shaded Corridor'
}) => {
  const { t } = useTranslation();

  const exposedScore = Math.max(0, 100 - score);

  return (
    <div className="bg-white rounded-3xl p-4.5 border border-[#E2EAF4] shadow-soft space-y-3">
      {/* Route header & duration */}
      <div className="flex items-center justify-between pb-3 border-b border-[#F5F8FC]">
        <div>
          <span className="text-[10px] uppercase font-bold text-[#71829A] tracking-wider block">
            {mode === 'bike' ? 'Cycling Route' : 'Pedestrian Route'} • {routeName}
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-black text-[#173153]">
              {durationMins} mins
            </span>
            <span className="text-xs font-semibold text-[#71829A]">
              ({distanceKm} km)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EBFBF3] border border-[#B7EDCE]">
          <Trees className="w-4 h-4 text-[#36B878]" />
          <span className="text-xs font-bold text-[#1E7E4D]">
            {score}% Shaded
          </span>
        </div>
      </div>

      {/* Visual Shade Comparison Bar */}
      <div>
        <div className="flex justify-between text-xs font-bold text-[#173153] mb-1.5">
          <span className="flex items-center gap-1 text-[11px] text-[#1E7E4D] font-bold">
            <Trees className="w-3.5 h-3.5 text-[#36B878]" />
            Tree Canopy ({score}%)
          </span>
          <span className="flex items-center gap-1 text-[11px] text-[#9A6B0A] font-medium">
            <Sun className="w-3.5 h-3.5 text-[#F3B43F]" />
            Direct Sun ({exposedScore}%)
          </span>
        </div>

        {/* Dual colored bar */}
        <div className="w-full h-3 bg-[#FEF9EE] rounded-full overflow-hidden p-0.5 border border-[#E2EAF4] flex">
          <div
            className="h-full rounded-l-full bg-[#36B878] transition-all duration-500"
            style={{ width: `${score}%` }}
          />
          <div
            className="h-full rounded-r-full bg-[#F3B43F] transition-all duration-500"
            style={{ width: `${exposedScore}%` }}
          />
        </div>
      </div>

      {/* Informative distinction text */}
      <div className="flex items-start gap-2 p-2.5 bg-[#F5F8FC] rounded-2xl border border-[#E2EAF4] text-[11px] text-[#71829A] leading-relaxed">
        <Info className="w-3.5 h-3.5 text-[#1769E0] shrink-0 mt-0.5" />
        <span>
          This route follows tree-covered avenues with lower radiating asphalt heat. Tree canopy is estimated from municipal satellite data and does not guarantee shadow at all solar angles.
        </span>
      </div>
    </div>
  );
};
