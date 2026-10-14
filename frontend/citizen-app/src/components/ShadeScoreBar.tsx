import React from 'react';
import { useTranslation } from 'react-i18next';
import { Trees, ShieldCheck, Sun } from 'lucide-react';

interface ShadeScoreBarProps {
  score: number; // 0 to 100
  distanceKm: number;
  durationMins: number;
  mode: 'walk' | 'bike';
}

export const ShadeScoreBar: React.FC<ShadeScoreBarProps> = ({
  score,
  distanceKm,
  durationMins,
  mode
}) => {
  const { t } = useTranslation();

  const getScoreColor = () => {
    if (score >= 70) return 'bg-emerald-500 text-emerald-800';
    if (score >= 40) return 'bg-amber-500 text-amber-800';
    return 'bg-rose-500 text-rose-800';
  };

  return (
    <div className="bg-white rounded-3xl p-4.5 border border-[#E2EDF9] shadow-soft">
      {/* Route quick stats */}
      <div className="flex items-center justify-between pb-3 border-b border-[#F0F4F8] mb-3">
        <div>
          <span className="text-[10px] uppercase font-bold text-[#5B708B] tracking-wider block">
            {mode === 'bike' ? 'Cycling Route' : 'Pedestrian Route'}
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl font-black text-[#102A4C]">
              {durationMins} mins
            </span>
            <span className="text-xs font-semibold text-[#5B708B]">
              ({distanceKm} km)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-50 border border-emerald-200">
          <Trees className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-emerald-800">
            {score}% Shaded
          </span>
        </div>
      </div>

      {/* Visual progress bar */}
      <div className="mb-2">
        <div className="flex justify-between text-xs font-bold text-[#102A4C] mb-1.5">
          <span className="flex items-center gap-1 text-[11px] text-[#5B708B]">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            Direct Sun
          </span>
          <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
            <Trees className="w-3.5 h-3.5 text-emerald-600" />
            Tree Canopy ({score}%)
          </span>
        </div>
        <div className="w-full h-3 bg-[#EDF5FF] rounded-full overflow-hidden p-0.5 border border-[#D6E8FF]">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getScoreColor()}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      <p className="text-[11px] text-[#5B708B] leading-relaxed mt-2 flex items-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-[#0866D9] shrink-0" />
        <span>
          {t(
            'safeRoute.shadeAdvice',
            'This route maximizes tree canopy and avoids open asphalt heat traps.'
          )}
        </span>
      </p>
    </div>
  );
};
