import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../stores/useUserStore';
import { Bell, MapPin, ChevronDown, Sun } from 'lucide-react';
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
  const { selectedWardId, setSelectedWardId } = useUserStore();

  const currentWard = MOCK_WARDS.find((w) => w.id === selectedWardId) || MOCK_WARDS[0];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E2EAF4] px-4 py-2.5 shadow-soft">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        {/* Left: GarmiQ Sun Logo + Greeting & Locality */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-[#F47738] flex items-center justify-center shadow-soft shrink-0">
            <Sun className="w-5 h-5 text-white" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#173153] leading-tight">
                {getGreeting()}
              </span>
              <span className="text-[10px] text-[#71829A]">• {currentDate}</span>
            </div>

            {/* Ward selector */}
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-[#1769E0] shrink-0" />
              <div className="relative">
                <select
                  value={selectedWardId}
                  onChange={(e) => setSelectedWardId(e.target.value)}
                  className="text-xs font-bold text-[#1769E0] bg-transparent border-none p-0 pr-4 focus:ring-0 cursor-pointer appearance-none truncate max-w-[190px]"
                >
                  {MOCK_WARDS.map((ward) => (
                    <option key={ward.id} value={ward.id}>
                      Pune • {ward.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-[#1769E0] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Temp Pill + Notification Icon */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Live Temperature */}
          <div className="px-2.5 py-1 bg-[#FEF3ED] border border-[#FCD2BE] rounded-full text-xs font-bold text-[#9E4010] flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#F47738] animate-pulse" />
            <span>{temperature}°C</span>
          </div>

          {/* Notifications / Alerts Button */}
          <button
            onClick={() => navigate('/alerts')}
            className="relative w-9 h-9 rounded-2xl bg-white border border-[#E2EAF4] flex items-center justify-center text-[#173153] hover:bg-[#F5F8FC] transition-colors"
            aria-label="Alerts"
          >
            <Bell className="w-4 h-4 text-[#173153]" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E5484D] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {unreadAlertsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
