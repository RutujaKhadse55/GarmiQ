import React from 'react';
import { useTranslation } from 'react-i18next';

export const MapLegend: React.FC = () => {
  const { t } = useTranslation();

  const levels = [
    { label: t('risk.VERY_LOW', 'V. Low'), color: '#36B878' },
    { label: t('risk.LOW', 'Low'), color: '#72D28F' },
    { label: t('risk.MODERATE', 'Mod'), color: '#F3B43F' },
    { label: t('risk.HIGH', 'High'), color: '#F47738' },
    { label: t('risk.VERY_HIGH', 'V. High'), color: '#E5484D' }
  ];

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl px-3 py-2 border border-[#E2EAF4] shadow-soft max-w-[240px]">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-[10px] font-bold text-[#173153] uppercase tracking-wider">
          Heat Risk
        </span>
        <span className="text-[9px] text-[#71829A] font-medium">PMC Wards</span>
      </div>
      <div className="flex items-center justify-between gap-1">
        {levels.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center gap-0.5">
            <span
              className="w-3.5 h-2 rounded-sm shadow-2xs"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[9px] font-semibold text-[#173153]">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
