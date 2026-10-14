import React from 'react';
import { useUserStore } from '../stores/useUserStore';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'pills' | 'select' | 'grid';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ variant = 'pills' }) => {
  const { language, setLanguage } = useUserStore();

  const languages = [
    { code: 'en' as const, label: 'English', native: 'English' },
    { code: 'hi' as const, label: 'Hindi', native: 'हिंदी' },
    { code: 'mr' as const, label: 'Marathi', native: 'मराठी' }
  ];

  if (variant === 'grid') {
    return (
      <div className="grid grid-cols-3 gap-2.5">
        {languages.map((l) => {
          const isSelected = language === l.code;
          return (
            <button
              key={l.code}
              type="button"
              onClick={() => setLanguage(l.code)}
              className={`p-3 rounded-2xl border text-center transition-all ${
                isSelected
                  ? 'bg-[#EDF5FF] border-[#0866D9] text-[#0866D9] font-bold shadow-soft ring-1 ring-[#0866D9]'
                  : 'bg-white border-[#E2EDF9] text-[#102A4C] hover:bg-[#F8FAFD]'
              }`}
            >
              <div className="text-sm font-semibold">{l.native}</div>
              <div className="text-[10px] text-[#5B708B]">{l.label}</div>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 p-1 bg-[#EDF5FF] rounded-2xl border border-[#D6E8FF] inline-flex">
      <Globe className="w-4 h-4 text-[#0866D9] ml-1.5 mr-0.5 shrink-0" />
      {languages.map((l) => {
        const isSelected = language === l.code;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => setLanguage(l.code)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isSelected
                ? 'bg-white text-[#0866D9] shadow-xs'
                : 'text-[#5B708B] hover:text-[#102A4C]'
            }`}
          >
            {l.native}
          </button>
        );
      })}
    </div>
  );
};
