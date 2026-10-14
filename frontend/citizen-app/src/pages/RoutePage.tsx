import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../stores/useUserStore';
import { calculateSafeRoute, MOCK_WARDS } from '@garmiq/api-client';
import { SafeRouteResponse } from '@garmiq/types';
import { ShadeScoreBar } from '../components/ShadeScoreBar';
import {
  Navigation,
  MapPin,
  Footprints,
  Bike,
  Search,
  RotateCcw,
  ChevronLeft,
  Trees,
  Droplets,
  AlertCircle
} from 'lucide-react';

export const RoutePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { userLocation } = useUserStore();

  const destNameParam = searchParams.get('destName') || 'Central Cooling Shelter';
  const destLatParam = parseFloat(searchParams.get('destLat') || '28.6275');
  const destLonParam = parseFloat(searchParams.get('destLon') || '77.2140');

  const [originName, setOriginName] = useState(userLocation.address || 'My Current Location');
  const [destName, setDestName] = useState(destNameParam);
  const [mode, setMode] = useState<'walk' | 'bike'>('walk');
  const [isLoading, setIsLoading] = useState(false);
  const [routeResult, setRouteResult] = useState<SafeRouteResponse | null>(null);

  const handleFindRoute = async () => {
    setIsLoading(true);
    try {
      const result = await calculateSafeRoute({
        origin: { lat: userLocation.lat, lon: userLocation.lon, name: originName },
        destination: { lat: destLatParam, lon: destLonParam, name: destName },
        mode
      });
      setRouteResult(result);
    } catch {
      // Handled in client mock fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFindRoute();
  }, [mode]);

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
              {t('safeRoute.title', 'Safe Shaded Route Finder')}
            </h1>
            <p className="text-[11px] text-[#5B708B]">
              Pedestrian & cycling canopy paths
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-3.5 space-y-3.5">
        {/* Origin / Destination Search Form */}
        <div className="bg-white rounded-3xl p-4 border border-[#E2EDF9] shadow-soft space-y-3">
          {/* Origin */}
          <div className="flex items-center gap-2.5 p-2.5 bg-[#F8FAFD] rounded-2xl border border-[#D6E8FF]">
            <div className="w-6 h-6 rounded-full bg-[#0866D9] text-white flex items-center justify-center shrink-0">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-[#5B708B] font-semibold block">Origin</span>
              <input
                type="text"
                value={originName}
                onChange={(e) => setOriginName(e.target.value)}
                className="w-full bg-transparent border-none text-xs font-bold text-[#102A4C] p-0 focus:outline-none"
              />
            </div>
          </div>

          {/* Destination */}
          <div className="flex items-center gap-2.5 p-2.5 bg-[#F8FAFD] rounded-2xl border border-[#D6E8FF]">
            <div className="w-6 h-6 rounded-full bg-[#EF4444] text-white flex items-center justify-center shrink-0">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-[#5B708B] font-semibold block">Destination</span>
              <input
                type="text"
                value={destName}
                onChange={(e) => setDestName(e.target.value)}
                className="w-full bg-transparent border-none text-xs font-bold text-[#102A4C] p-0 focus:outline-none"
              />
            </div>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setMode('walk')}
              className={`flex-1 py-2.5 px-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                mode === 'walk'
                  ? 'bg-[#0866D9] text-white border-[#0866D9] shadow-xs'
                  : 'bg-[#F8FAFD] border-[#E2EDF9] text-[#5B708B] hover:bg-[#EDF5FF]'
              }`}
            >
              <Footprints className="w-4 h-4" />
              <span>{t('safeRoute.modeWalk', 'Walking')}</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('bike')}
              className={`flex-1 py-2.5 px-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                mode === 'bike'
                  ? 'bg-[#0866D9] text-white border-[#0866D9] shadow-xs'
                  : 'bg-[#F8FAFD] border-[#E2EDF9] text-[#5B708B] hover:bg-[#EDF5FF]'
              }`}
            >
              <Bike className="w-4 h-4" />
              <span>{t('safeRoute.modeBike', 'Cycling')}</span>
            </button>
          </div>
        </div>

        {/* Route Visualization Map Graphic */}
        <div className="relative w-full h-56 rounded-3xl bg-[#EBF3FE] overflow-hidden border border-[#D6E8FF] shadow-soft">
          <svg className="w-full h-full" viewBox="0 0 360 220">
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#0866D9" />
              </linearGradient>
            </defs>
            {/* Street network grid */}
            <path d="M 0 40 L 360 40 M 0 110 L 360 110 M 0 180 L 360 180" stroke="#FFFFFF" strokeWidth="6" />
            <path d="M 60 0 L 60 220 M 180 0 L 180 220 M 300 0 L 300 220" stroke="#FFFFFF" strokeWidth="6" />

            {/* Tree canopy shaded corridors */}
            <rect x="40" y="30" width="160" height="90" rx="12" fill="#10B981" fillOpacity="0.15" />
            <rect x="160" y="100" width="160" height="90" rx="12" fill="#10B981" fillOpacity="0.2" />

            {/* Calculated Green Route Line */}
            <path
              d="M 60 110 Q 120 70 180 110 T 300 180"
              fill="none"
              stroke="url(#routeGradient)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="6 2"
            />

            {/* Origin Pin */}
            <circle cx="60" cy="110" r="8" fill="#0866D9" stroke="#FFFFFF" strokeWidth="3" />

            {/* Destination Pin */}
            <circle cx="300" cy="180" r="9" fill="#EF4444" stroke="#FFFFFF" strokeWidth="3" />
          </svg>

          {/* Shaded Corridor Callout */}
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-xl border border-[#D6E8FF] text-[10px] font-bold text-emerald-700 flex items-center gap-1 shadow-xs">
            <Trees className="w-3.5 h-3.5 text-emerald-600" />
            <span>High Tree Canopy Corridor</span>
          </div>
        </div>

        {/* Results Card */}
        {isLoading ? (
          <div className="p-6 bg-white rounded-3xl border border-[#E2EDF9] text-center text-xs text-[#5B708B] animate-pulse">
            Calculating cooler shade-optimized route...
          </div>
        ) : routeResult ? (
          <div className="space-y-3">
            <ShadeScoreBar
              score={routeResult.shade_score}
              distanceKm={routeResult.distance_km}
              durationMins={routeResult.duration_mins}
              mode={mode}
            />

            {/* Summary details */}
            <div className="bg-white rounded-2xl p-4 border border-[#E2EDF9] shadow-soft space-y-2">
              <div className="text-xs font-bold text-[#102A4C]">
                {routeResult.summary}
              </div>
              <p className="text-[11px] text-[#5B708B] leading-relaxed">
                {routeResult.advisory}
              </p>

              <div className="pt-2 flex items-center gap-3 text-[11px] text-emerald-700 font-semibold border-t border-[#F0F4F8]">
                <span className="flex items-center gap-1">
                  <Trees className="w-3.5 h-3.5" /> 78% Continuous Shade
                </span>
                <span className="flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5" /> 2 Hydration Spots on Route
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
};
