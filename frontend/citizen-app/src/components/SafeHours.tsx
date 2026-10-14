import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

interface SafeHoursProps {
  safeHours: string[];
  avoidHours: string[];
}

export const SafeHours: React.FC<SafeHoursProps> = ({
  safeHours,
  avoidHours
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-3xl p-4.5 border border-[#E2EDF9] shadow-soft">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-[#102A4C]">
          {t('home.safeHoursTitle', 'Safe & Avoid Commute Hours')}
        </h3>
      </div>

      {/* Safe hours row */}
      <div className="mb-3">
        <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1.5 mb-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          {t('home.safeHoursBadge', 'Safe Outdoor Hours')}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {safeHours.map((hour, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-semibold shadow-2xs"
            >
              {hour}
            </span>
          ))}
        </div>
      </div>

      {/* Avoid hours row */}
      <div className="mb-3">
        <span className="text-[11px] font-semibold text-rose-700 flex items-center gap-1.5 mb-1.5">
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          {t('home.avoidHoursBadge', 'Avoid Outdoor Sun')}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {avoidHours.map((hour, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-rose-50 text-rose-800 border border-rose-200 rounded-full text-xs font-semibold shadow-2xs"
            >
              {hour}
            </span>
          ))}
        </div>
      </div>

      {/* Explanation text */}
      <div className="flex items-start gap-2 p-2.5 bg-[#F8FAFD] rounded-xl text-[11px] text-[#5B708B] leading-relaxed">
        <Info className="w-3.5 h-3.5 text-[#0866D9] shrink-0 mt-0.5" />
        <span>
          {t(
            'home.safeHoursExplanation',
            'Direct solar radiation is highest between avoid hours. Reschedule outdoor physical exertion.'
          )}
        </span>
      </div>
    </div>
  );
};
