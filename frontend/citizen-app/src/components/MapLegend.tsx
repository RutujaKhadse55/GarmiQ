import React from 'react';
import { useTranslation } from 'react-i18next';

export const MapLegend: React.FC = () => {
  const { t } = useTranslation();

  const items = [
    { label: t('risk.LOW', 'Low'), color: '#84CC16' },
    { label: t('risk.MODERATE', 'Moderate'), color: '#F59E0B' },
    { label: t('risk.HIGH', 'High'), color: '#F97316' },
    { label: t('risk.VERY_HIGH', 'Very High'), color: '#EF4444' },
    { label: t('risk.EXTREME', 'Extreme'), color: '#991B1B' }
  ];

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 border border-[#E2EDF9] shadow-soft text-[10px]">
      <span className="font-bold text-[#102A4C] block mb-1.5 uppercase tracking-wider text-[9px]">
        {t('map.riskLegend', 'Risk Level')}
      </span>
      <div className="flex items-center gap-1.5">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-1">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[#5B708B] font-medium hidden sm:inline">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
