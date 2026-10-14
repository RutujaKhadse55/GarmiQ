import React from 'react';
import { Layers, Flame, Thermometer, Building, Sliders } from 'lucide-react';

interface MapLayerSelectorProps {
  activeLayer: 'risk' | 'hvi' | 'lst' | 'built_up';
  onLayerChange: (layer: 'risk' | 'hvi' | 'lst' | 'built_up') => void;
  opacity: number;
  onOpacityChange?: (opacity: number) => void;
}

export const MapLayerSelector: React.FC<MapLayerSelectorProps> = ({
  activeLayer,
  onLayerChange,
  opacity,
  onOpacityChange,
}) => {
  const layers = [
    { id: 'risk', label: 'Heat-Risk Class', icon: Flame },
    { id: 'hvi', label: 'Vulnerability (HVI)', icon: Layers },
    { id: 'lst', label: 'Surface Temp (LST)', icon: Thermometer },
    { id: 'built_up', label: 'Built-up Landcover', icon: Building },
  ] as const;

  return (
    <div className="bg-white/95 backdrop-blur-sm p-2.5 rounded-xl border border-[#DFEAF7] shadow-card text-xs flex flex-col gap-2">
      <div className="font-bold text-[#102442] text-[11px] uppercase tracking-wider flex items-center gap-1.5 px-1">
        <Layers className="w-3.5 h-3.5 text-[#0866D9]" />
        Map Layers
      </div>

      <div className="flex flex-wrap sm:flex-col gap-1">
        {layers.map((layer) => {
          const Icon = layer.icon;
          const isActive = activeLayer === layer.id;
          return (
            <button
              key={layer.id}
              onClick={() => onLayerChange(layer.id)}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-all ${
                isActive
                  ? 'bg-[#0866D9] text-white font-bold shadow-sm'
                  : 'text-[#132D50] hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="text-[11px] whitespace-nowrap">{layer.label}</span>
            </button>
          );
        })}
      </div>

      {onOpacityChange && (
        <div className="pt-2 border-t border-[#DFEAF7] px-1">
          <div className="flex items-center justify-between text-[10px] text-[#7186A3] mb-1">
            <span className="flex items-center gap-1">
              <Sliders className="w-3 h-3" />
              Layer Opacity
            </span>
            <span>{Math.round(opacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="1.0"
            step="0.05"
            value={opacity}
            onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
            className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0866D9]"
          />
        </div>
      )}
    </div>
  );
};
