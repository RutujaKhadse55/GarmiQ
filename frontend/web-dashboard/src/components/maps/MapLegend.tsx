import React from 'react';

interface MapLegendProps {
  layer: 'risk' | 'hvi' | 'lst' | 'built_up';
}

export const MapLegend: React.FC<MapLegendProps> = ({ layer }) => {
  if (layer === 'hvi') {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-[#DFEAF7] shadow-card text-xs">
        <div className="font-bold text-[#102442] mb-1.5 text-[11px] uppercase tracking-wider">
          Heat Vulnerability Index (HVI)
        </div>
        <div className="flex items-center gap-1.5 mb-1">
          <div className="h-2.5 w-full rounded-sm bg-gradient-to-r from-emerald-500 via-amber-400 to-red-600" />
        </div>
        <div className="flex justify-between text-[10px] text-[#7186A3] font-mono">
          <span>0 (Low)</span>
          <span>50</span>
          <span>100 (Critical)</span>
        </div>
      </div>
    );
  }

  if (layer === 'lst') {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-[#DFEAF7] shadow-card text-xs">
        <div className="font-bold text-[#102442] mb-1.5 text-[11px] uppercase tracking-wider">
          Land Surface Temp (°C)
        </div>
        <div className="flex items-center gap-1.5 mb-1">
          <div className="h-2.5 w-full rounded-sm bg-gradient-to-r from-yellow-300 via-orange-500 to-rose-700" />
        </div>
        <div className="flex justify-between text-[10px] text-[#7186A3] font-mono">
          <span>&lt; 37°C</span>
          <span>41°C</span>
          <span>&gt; 45°C</span>
        </div>
      </div>
    );
  }

  if (layer === 'built_up') {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-[#DFEAF7] shadow-card text-xs">
        <div className="font-bold text-[#102442] mb-1.5 text-[11px] uppercase tracking-wider">
          Impervious Built-Up Area (%)
        </div>
        <div className="flex items-center gap-1.5 mb-1">
          <div className="h-2.5 w-full rounded-sm bg-gradient-to-r from-emerald-400 via-amber-300 to-slate-800" />
        </div>
        <div className="flex justify-between text-[10px] text-[#7186A3] font-mono">
          <span>&lt; 40%</span>
          <span>70%</span>
          <span>&gt; 90%</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-[#DFEAF7] shadow-card text-xs">
      <div className="font-bold text-[#102442] mb-2 text-[11px] uppercase tracking-wider">
        Heat-Risk Classification
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-[#EF4444]" />
          <span className="text-[#132D50] text-[11px] font-semibold">Very High / Extreme (&gt; 43°C)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-[#F97316]" />
          <span className="text-[#132D50] text-[11px] font-semibold">High Risk (41° - 43°C)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-[#F59E0B]" />
          <span className="text-[#132D50] text-[11px] font-semibold">Moderate Risk (39° - 41°C)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-[#10B981]" />
          <span className="text-[#132D50] text-[11px] font-semibold">Low Risk (&lt; 39°C)</span>
        </div>
      </div>
    </div>
  );
};
