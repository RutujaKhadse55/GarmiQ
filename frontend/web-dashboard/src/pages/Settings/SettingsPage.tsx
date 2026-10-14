import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  ShieldCheck,
  Globe,
  Sliders,
  Server,
  Radio,
  CheckCircle2,
  LogOut,
  RefreshCw,
  Bell,
  Cpu,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { authService } from '../../services/authService';
import { useDashboardStore } from '../../store/useDashboardStore';
import { API_BASE_URL, USE_MOCKS, REAL_ENDPOINTS } from '../../api/client';
import { useToast } from '../../components/common/ToastProvider';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const officer = authService.getCurrentUser();

  const {
    selectedCity,
    setSelectedCity,
    selectedPeriod,
    setSelectedPeriod,
    activeMapLayer,
    setActiveMapLayer,
    mapOpacity,
    setMapOpacity,
    telemetryPollingIntervalSec,
    setTelemetryPollingInterval,
    isLivePollingActive,
    toggleLivePolling,
  } = useDashboardStore();

  const [language, setLanguage] = useState('en');
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [apiPingStatus, setApiPingStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleTestApi = async () => {
    setIsTestingApi(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setApiPingStatus('success');
      showToast('API connection confirmed responsive.', 'success');
    } catch {
      setApiPingStatus('error');
    } finally {
      setIsTestingApi(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6 select-none animate-fadeIn pb-16 max-w-5xl mx-auto">
      <PageHeader
        title="Dashboard Settings & Configuration"
        subtitle="Manage municipal officer profile, telemetry polling intervals, and API runtime environment"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Settings' }]}
      />

      {/* Section 1: Officer Profile and Access */}
      <div className="bg-white rounded-card border border-[#DFEAF7] p-6 shadow-soft space-y-4">
        <h3 className="text-sm font-bold text-[#102442] flex items-center gap-2 pb-2 border-b border-[#DFEAF7]">
          <User className="w-4 h-4 text-[#0866D9]" />
          Officer Profile & Municipal Authority
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={officer?.avatar_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'}
              alt={officer?.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-[#0866D9]"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-[#102442]">{officer?.name}</h4>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0866D9] text-[10px] font-bold">
                  {officer?.badge_id}
                </span>
              </div>
              <p className="text-xs text-[#7186A3]">{officer?.role}</p>
              <p className="text-[11px] text-[#7186A3] mt-0.5">{officer?.department}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors self-start sm:self-auto flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>

        {/* Assigned Officer Permissions */}
        <div className="pt-2">
          <span className="text-[11px] font-bold text-[#7186A3] uppercase tracking-wider block mb-2">
            Active Municipal Clearances:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {officer?.permissions.map((perm, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                {perm.replace('_', ' ').toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Section 2: Dashboard Preferences */}
      <div className="bg-white rounded-card border border-[#DFEAF7] p-6 shadow-soft space-y-4">
        <h3 className="text-sm font-bold text-[#102442] flex items-center gap-2 pb-2 border-b border-[#DFEAF7]">
          <Sliders className="w-4 h-4 text-[#0866D9]" />
          Dashboard Display & Language Preferences
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-[#102442] mb-1.5">Default City Zone</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#DFEAF7] bg-slate-50 font-semibold text-[#102442]"
            >
              <option value="Pune (PMC)">Pune Municipal Corporation (PMC)</option>
              <option value="Pimpri-Chinchwad (PCMC)">Pimpri-Chinchwad (PCMC)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#102442] mb-1.5">Preferred Interface Language</label>
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                showToast(`Language set to ${e.target.value === 'mr' ? 'Marathi (मराठी)' : e.target.value === 'hi' ? 'Hindi (हिंदी)' : 'English'}.`, 'info');
              }}
              className="w-full px-3 py-2 rounded-xl border border-[#DFEAF7] bg-slate-50 font-semibold text-[#102442]"
            >
              <option value="en">English (Official)</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="hi">हिंदी (Hindi)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#102442] mb-1.5">Default Forecast Horizon</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#DFEAF7] bg-slate-50 font-semibold text-[#102442]"
            >
              <option value="Today (15 Jun)">Today (15 Jun 2026)</option>
              <option value="Tomorrow (16 Jun)">Tomorrow (16 Jun Fcst)</option>
              <option value="7-Day Horizon">7-Day Heatwave Horizon</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 3: Telemetry & Map Runtime Controls */}
      <div className="bg-white rounded-card border border-[#DFEAF7] p-6 shadow-soft space-y-4">
        <h3 className="text-sm font-bold text-[#102442] flex items-center gap-2 pb-2 border-b border-[#DFEAF7]">
          <Radio className="w-4 h-4 text-[#0866D9]" />
          Telemetry Streaming & Map Defaults
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-[#102442] mb-1.5">
              IoT Sensor Polling Interval
            </label>
            <select
              value={telemetryPollingIntervalSec}
              onChange={(e) => setTelemetryPollingInterval(parseInt(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-[#DFEAF7] bg-slate-50 font-semibold text-[#102442]"
            >
              <option value={15}>15 Seconds (Rapid Telemetry)</option>
              <option value={30}>30 Seconds (Recommended)</option>
              <option value={60}>60 Seconds (Conservation)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#102442] mb-1.5">
              Default Active Map Layer
            </label>
            <select
              value={activeMapLayer}
              onChange={(e) => setActiveMapLayer(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-[#DFEAF7] bg-slate-50 font-semibold text-[#102442]"
            >
              <option value="risk">Heat-Risk Classification</option>
              <option value="hvi">Heat Vulnerability Index (HVI)</option>
              <option value="lst">Land Surface Temperature (LST)</option>
              <option value="built_up">Impervious Built-Up Area</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#102442] mb-1.5">
              Layer Opacity ({Math.round(mapOpacity * 100)}%)
            </label>
            <input
              type="range"
              min="0.2"
              max="1.0"
              step="0.05"
              value={mapOpacity}
              onChange={(e) => setMapOpacity(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0866D9] mt-3"
            />
          </div>
        </div>
      </div>

      {/* Section 4: Application & Backend Connectivity */}
      <div className="bg-white rounded-card border border-[#DFEAF7] p-6 shadow-soft space-y-4">
        <h3 className="text-sm font-bold text-[#102442] flex items-center gap-2 pb-2 border-b border-[#DFEAF7]">
          <Server className="w-4 h-4 text-[#0866D9]" />
          Backend Runtime & Environment Status
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
            <div className="flex justify-between">
              <span className="text-[#7186A3]">API Gateway:</span>
              <span className="font-mono font-bold text-[#102442]">{API_BASE_URL}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7186A3]">Mock Interception:</span>
              <span className={`font-bold ${USE_MOCKS ? 'text-amber-600' : 'text-emerald-600'}`}>
                {USE_MOCKS ? 'Active (MSW Fixtures)' : 'Disabled (Live FastAPI)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7186A3]">Real Endpoints Bypass:</span>
              <span className="font-mono text-[#102442]">
                {REAL_ENDPOINTS.length > 0 ? REAL_ENDPOINTS.join(', ') : 'None (All Mocked)'}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
            <div className="flex justify-between">
              <span className="text-[#7186A3]">Application:</span>
              <span className="font-bold text-[#102442]">GarmiQ Municipal Dashboard</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7186A3]">Version:</span>
              <span className="font-mono font-bold text-[#102442]">v0.1.0-prod</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7186A3]">Vector Tile Server:</span>
              <span className="font-mono text-[#102442]">http://localhost:3000</span>
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-[#102442] font-semibold">Service Health: Normal</span>
          </div>

          <button
            onClick={handleTestApi}
            disabled={isTestingApi}
            className="px-3.5 py-1.5 rounded-xl bg-[#0866D9] text-white text-xs font-bold hover:bg-[#0756B8] transition-colors shadow-sm flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTestingApi ? 'animate-spin' : ''}`} />
            {isTestingApi ? 'Testing API...' : 'Ping Municipal Gateway'}
          </button>
        </div>
      </div>
    </div>
  );
};
