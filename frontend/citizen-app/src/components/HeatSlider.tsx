import React from 'react';
import { useTranslation } from 'react-i18next';
import { Flame } from 'lucide-react';

interface HeatSliderProps {
  value: number; // 1 to 5
  onChange: (val: number) => void;
}

export const HeatSlider: React.FC<HeatSliderProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  const labels = [
    t('report.heatLevels.0', 'Bearable (Warm)'),
    t('report.heatLevels.1', 'Hot (Uncomfortable)'),
    t('report.heatLevels.2', 'Very Hot (Sweating heavily)'),
    t('report.heatLevels.3', 'Severe Burning (Dizziness risk)'),
    t('report.heatLevels.4', 'Life Threatening (Extreme heatwave)')
  ];

  const colors = [
    'text-lime-600 border-lime-300 bg-lime-50',
    'text-amber-600 border-amber-300 bg-amber-50',
    'text-orange-600 border-orange-300 bg-orange-50',
    'text-red-600 border-red-300 bg-red-50',
    'text-rose-700 border-rose-400 bg-rose-100 font-bold'
  ];

  return (
    <div className="bg-white rounded-3xl p-4 border border-[#E2EDF9] shadow-soft">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-bold text-[#102A4C] flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-[#F97316]" />
          <span>{t('report.heatRatingLabel', 'How intense is the felt heat?')}</span>
        </label>
        <span className="text-sm font-extrabold text-[#0866D9]">
          {value} / 5
        </span>
      </div>

      {/* Slider input */}
      <input
        type="range"
        min="1"
        max="5"
        step="1"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2.5 bg-[#EDF5FF] rounded-lg appearance-none cursor-pointer accent-[#0866D9]"
      />

      {/* Ticks & current label */}
      <div className="flex justify-between text-[10px] text-[#5B708B] font-semibold mt-1.5 px-1">
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
      </div>

      <div className={`mt-3 p-2.5 rounded-xl border text-xs text-center font-semibold transition-all ${colors[value - 1]}`}>
        {labels[value - 1]}
      </div>
    </div>
  );
};
