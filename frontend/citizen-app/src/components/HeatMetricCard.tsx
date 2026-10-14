import React from 'react';
import { LucideIcon } from 'lucide-react';

interface HeatMetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
}

export const HeatMetricCard: React.FC<HeatMetricCardProps> = ({
  label,
  value,
  unit,
  subtext,
  icon: Icon,
  iconBgColor = 'bg-[#EDF5FF]',
  iconColor = 'text-[#0866D9]'
}) => {
  return (
    <div className="bg-white rounded-2xl p-3.5 border border-[#E2EDF9] shadow-soft flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-medium text-[#5B708B] truncate max-w-[80px]">
          {label}
        </span>
        <div className={`w-7 h-7 rounded-lg ${iconBgColor} flex items-center justify-center shrink-0`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
      </div>
      <div>
        <div className="flex items-baseline gap-0.5">
          <span className="text-lg font-bold text-[#102A4C]">
            {value}
          </span>
          {unit && <span className="text-xs font-semibold text-[#5B708B]">{unit}</span>}
        </div>
        {subtext && (
          <span className="text-[10px] text-[#5B708B] truncate block mt-0.5">
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
};
