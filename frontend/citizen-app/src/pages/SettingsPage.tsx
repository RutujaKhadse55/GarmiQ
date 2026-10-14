import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../stores/useUserStore';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { MOCK_WARDS } from '@garmiq/api-client';
import {
  Globe,
  MapPin,
  Bell,
  Wifi,
  Database,
  PhoneCall,
  Info,
  ChevronLeft,
  CheckCircle2,
  Trash2,
  ExternalLink
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    selectedWardId,
    setSelectedWardId,
    lowBandwidthMode,
    setLowBandwidthMode,
    subscriber,
    setSubscriber
  } = useUserStore();

  const [cacheCleared, setCacheCleared] = useState(false);

  const handleClearCache = () => {
    try {
      localStorage.removeItem('garmiq_queued_reports');
      setCacheCleared(true);
      setTimeout(() => setCacheCleared(false), 2500);
    } catch {
      // Ignored
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F9FF] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E2EDF9] px-4 py-3 shadow-xs">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl bg-[#F5F9FF] border border-[#E2EDF9] flex items-center justify-center text-[#102A4C]"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-[#102A4C]">
              {t('settings.title', 'Settings & Preferences')}
            </h1>
            <p className="text-[11px] text-[#5B708B]">
              Customise language, alerts & bandwidth
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Language Selection Card */}
        <div className="bg-white rounded-3xl p-4.5 border border-[#E2EDF9] shadow-soft space-y-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#0866D9]" />
            <h3 className="text-xs font-bold text-[#102A4C] uppercase tracking-wider">
              {t('settings.languageSection', 'Language')}
            </h3>
          </div>
          <LanguageSwitcher variant="grid" />
        </div>

        {/* Default Ward Location Card */}
        <div className="bg-white rounded-3xl p-4.5 border border-[#E2EDF9] shadow-soft space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#0866D9]" />
            <h3 className="text-xs font-bold text-[#102A4C] uppercase tracking-wider">
              {t('settings.locationSection', 'Default Ward Location')}
            </h3>
          </div>
          <select
            value={selectedWardId}
            onChange={(e) => setSelectedWardId(e.target.value)}
            className="w-full p-3 bg-[#F8FAFD] border border-[#D6E8FF] rounded-2xl text-xs font-bold text-[#102A4C] focus:ring-2 focus:ring-[#0866D9] focus:outline-none cursor-pointer"
          >
            {MOCK_WARDS.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name} ({w.city})
              </option>
            ))}
          </select>
        </div>

        {/* Low Bandwidth Mode Toggle */}
        <div className="bg-white rounded-3xl p-4.5 border border-[#E2EDF9] shadow-soft">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Wifi className="w-4 h-4 text-[#0866D9]" />
                <h3 className="text-xs font-bold text-[#102A4C]">
                  {t('settings.lowBandwidthTitle', 'Low-Bandwidth Mode')}
                </h3>
              </div>
              <p className="text-[11px] text-[#5B708B] leading-relaxed">
                {t('settings.lowBandwidthDesc', 'Disables map vector tiles and graphics to save mobile data and work reliably on 2G/3G networks.')}
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={lowBandwidthMode}
                onChange={(e) => setLowBandwidthMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0866D9]" />
            </label>
          </div>
        </div>

        {/* Offline Cache Management */}
        <div className="bg-white rounded-3xl p-4.5 border border-[#E2EDF9] shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#0866D9]" />
              <h3 className="text-xs font-bold text-[#102A4C] uppercase tracking-wider">
                {t('settings.cacheSection', 'Offline Storage')}
              </h3>
            </div>
            {cacheCleared && (
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Cache cleared
              </span>
            )}
          </div>

          <p className="text-[11px] text-[#5B708B] leading-relaxed">
            {t('settings.cachedStatus', 'Cached heat risk and cooling points are available offline.')}
          </p>

          <button
            type="button"
            onClick={handleClearCache}
            className="w-full py-2.5 px-3 bg-[#F8FAFD] hover:bg-rose-50 text-rose-600 border border-[#E2EDF9] hover:border-rose-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t('settings.clearCacheBtn', 'Clear Offline Cache')}</span>
          </button>
        </div>

        {/* Emergency Heat Helplines */}
        <div className="bg-[#FFF8F5] rounded-3xl p-4.5 border border-[#FED7AA] space-y-3">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-[#EA580C]" />
            <h3 className="text-xs font-bold text-[#9A3412] uppercase tracking-wider">
              {t('settings.emergencyTitle', 'Emergency Heat Helplines')}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <a
              href="tel:108"
              className="p-3 bg-white rounded-2xl border border-[#FDBA74] text-center hover:bg-orange-50 transition-colors"
            >
              <span className="text-[10px] font-bold text-[#EA580C] block">Ambulance</span>
              <span className="text-base font-black text-[#9A3412]">108</span>
            </a>

            <a
              href="tel:112"
              className="p-3 bg-white rounded-2xl border border-[#FDBA74] text-center hover:bg-orange-50 transition-colors"
            >
              <span className="text-[10px] font-bold text-[#EA580C] block">Disaster Relief</span>
              <span className="text-base font-black text-[#9A3412]">112</span>
            </a>
          </div>
        </div>

        {/* App Info Footer */}
        <div className="text-center pt-2 pb-4 text-xs text-[#5B708B]">
          <p className="font-semibold">{t('settings.appInfo', 'GarmiQ v0.1.0 • Beat the Heat Civic Initiative')}</p>
          <p className="text-[10px] mt-0.5">Municipal Heat Risk Resilience & Early Warning System</p>
        </div>
      </main>
    </div>
  );
};
