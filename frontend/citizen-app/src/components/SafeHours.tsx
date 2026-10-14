import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, AlertOctagon, Info } from 'lucide-react';

interface SafeHoursProps {
  safeHours?: string[];
  avoidHours?: string[];
}

export const SafeHours: React.FC<SafeHoursProps> = ({
  safeHours = ['06:00 - 10:00', '17:30 - 20:30'],
  avoidHours = ['11:30 - 16:30']
}) => {
  const { t } = useTranslation();

  const hasHours = (safeHours && safeHours.length > 0) || (avoidHours && avoidHours.length > 0);

  if (!hasHours) {
    return (
      <div className="bg-white rounded-3xl p-4 border border-[#E2EAF4] shadow-soft">
        <h3 className="text-xs font-bold text-[#173153] uppercase tracking-wider mb-2">
          Daily Commute Safety
        </h3>
        <p className="text-xs text-[#71829A]">
          Avoid peak midday solar hours between 11:30 AM and 04:30 PM. Drink water continuously.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-4.5 border border-[#E2EAF4] shadow-soft space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-[#173153] uppercase tracking-wider">
          Safe & Avoid Commute Hours
        </h3>
        <span className="text-[10px] text-[#71829A] font-medium">Pune PMC Advisory</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Safer outdoor periods */}
        <div className="p-3 bg-[#EBFBF3] rounded-2xl border border-[#B7EDCE]">
          <span className="text-[11px] font-bold text-[#1E7E4D] flex items-center gap-1.5 mb-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#36B878]" />
            <span>Safer outdoor periods</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {safeHours.map((hour, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 bg-white text-[#1E7E4D] border border-[#B7EDCE] rounded-full text-xs font-bold shadow-2xs"
              >
                {hour}
              </span>
            ))}
          </div>
        </div>

        {/* Avoid outdoor activity */}
        <div className="p-3 bg-[#FDF0F1] rounded-2xl border border-[#F9C3C6]">
          <span className="text-[11px] font-bold text-[#A81F26] flex items-center gap-1.5 mb-1.5">
            <AlertOctagon className="w-3.5 h-3.5 text-[#E5484D]" />
            <span>Avoid outdoor activity</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {avoidHours.map((hour, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 bg-white text-[#A81F26] border border-[#F9C3C6] rounded-full text-xs font-bold shadow-2xs"
              >
                {hour}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Short explanation */}
      <div className="flex items-center gap-2 pt-1 text-[11px] text-[#71829A]">
        <Info className="w-3.5 h-3.5 text-[#1769E0] shrink-0" />
        <span>Reduce strenuous outdoor activity during peak heat.</span>
      </div>
    </div>
  );
};
