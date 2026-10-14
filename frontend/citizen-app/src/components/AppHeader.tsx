import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../stores/useUserStore';
import { Bell, MapPin, Settings as SettingsIcon, SunMedium } from 'lucide-react';
import { MOCK_WARDS } from '@garmiq/api-client';

interface AppHeaderProps {
  temperature?: number;
  unreadAlertsCount?: number;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  temperature = 41.5,
  unreadAlertsCount = 1
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { selectedWardId, setSelectedWardId, userLocation } = useUserStore();

  const currentWard = MOCK_WARDS.find((w) => w.id === selectedWardId) || MOCK_WARDS[0];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E2EDF9] px-4 py-3 shadow-xs">
      <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
        {/* Left: Location & Ward Selector */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#EDF5FF] text-[#0866D9] flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-[#0866D9]" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-medium text-[#5B708B] uppercase tracking-wider block">
              {t('home.currentArea', 'Current Area')}
            </span>
            <select
              value={selectedWardId}
              onChange={(e) => setSelectedWardId(e.target.value)}
              className="text-xs font-semibold text-[#102A4C] bg-transparent border-none p-0 focus:ring-0 cursor-pointer truncate max-w-[170px]"
            >
              {MOCK_WARDS.map((ward) => (
                <option key={ward.id} value={ward.id}>
                  {ward.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Weather Pill & Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Temperature indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FFF4ED] border border-[#FED7AA] rounded-full text-xs font-semibold text-[#EA580C]">
            <SunMedium className="w-3.5 h-3.5 text-[#F97316] animate-spin-slow" />
            <span>{temperature}°C</span>
          </div>

          {/* Alert button */}
          <button
            onClick={() => navigate('/alerts')}
            className="relative w-9 h-9 rounded-xl bg-[#F5F9FF] border border-[#E2EDF9] flex items-center justify-center text-[#102A4C] hover:bg-[#EDF5FF] transition-colors"
            aria-label="Alerts"
          >
            <Bell className="w-4 h-4 text-[#102A4C]" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#EF4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* Settings button */}
          <button
            onClick={() => navigate('/settings')}
            className="w-9 h-9 rounded-xl bg-[#F5F9FF] border border-[#E2EDF9] flex items-center justify-center text-[#102A4C] hover:bg-[#EDF5FF] transition-colors"
            aria-label="Settings"
          >
            <SettingsIcon className="w-4 h-4 text-[#5B708B]" />
          </button>
        </div>
      </div>
    </header>
  );
};
