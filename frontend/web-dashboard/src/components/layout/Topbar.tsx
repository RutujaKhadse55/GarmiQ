import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  MapPin,
  Calendar,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Radio,
  FileText,
  User,
  Settings as SettingsIcon,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { authService } from '../../services/authService';
import { useWards } from '../../hooks/useQueries';

export const Topbar: React.FC = () => {
  const navigate = useNavigate();
  const {
    selectedCity,
    setSelectedCity,
    selectedPeriod,
    setSelectedPeriod,
    isLivePollingActive,
    lastTelemetryRefresh,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    setMobileDrawerOpen,
  } = useDashboardStore();

  const [searchVal, setSearchVal] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const officer = authService.getCurrentUser();
  const { data: wards = [] } = useWards();

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Filter wards for global search
  const filteredWards = searchVal.trim()
    ? wards.filter(
        (w) =>
          w.name.toLowerCase().includes(searchVal.toLowerCase()) ||
          w.code.toLowerCase().includes(searchVal.toLowerCase())
      )
    : [];

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectWard = (wardId: string) => {
    setSearchVal('');
    setIsSearchOpen(false);
    navigate(`/wards/${wardId}`);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-[#DFEAF7] px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 select-none shadow-soft">
      {/* Left: Mobile Toggle & Selectors */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="p-2 rounded-lg text-[#7186A3] hover:text-[#102442] hover:bg-slate-50 md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* City Selector */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#DFEAF7] bg-slate-50 text-xs font-semibold text-[#102442]">
          <MapPin className="w-3.5 h-3.5 text-[#0866D9]" />
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-transparent border-none outline-none font-semibold cursor-pointer text-xs"
          >
            <option value="Pune (PMC)">Pune Municipal Corporation (PMC)</option>
            <option value="Pimpri-Chinchwad (PCMC)">Pimpri-Chinchwad (PCMC)</option>
          </select>
        </div>

        {/* Date / Period Selector */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#DFEAF7] bg-slate-50 text-xs font-semibold text-[#102442]">
          <Calendar className="w-3.5 h-3.5 text-[#7186A3]" />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-transparent border-none outline-none font-semibold cursor-pointer text-xs text-[#132D50]"
          >
            <option value="Today (15 Jun)">Today (15 Jun 2026)</option>
            <option value="Tomorrow (16 Jun)">Tomorrow (16 Jun Fcst)</option>
            <option value="7-Day Horizon">7-Day Heatwave Horizon</option>
          </select>
        </div>
      </div>

      {/* Middle: Global Search */}
      <div ref={searchRef} className="relative flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-[#7186A3] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => {
              setSearchVal(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Search Pune wards, cooling centres, sensors..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-[#DFEAF7] bg-[#F4F8FD] text-xs text-[#102442] placeholder:text-[#7186A3] focus:bg-white focus:outline-none focus:border-[#0866D9] focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>

        {/* Search Results Dropdown */}
        {isSearchOpen && searchVal.trim() && (
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-card border border-[#DFEAF7] shadow-elevated max-h-80 overflow-y-auto p-2 z-50 animate-fadeIn">
            <div className="px-3 py-1.5 text-[11px] font-bold text-[#7186A3] uppercase">
              Wards matching &ldquo;{searchVal}&rdquo;
            </div>
            {filteredWards.length > 0 ? (
              filteredWards.map((w) => (
                <button
                  key={w.id}
                  onClick={() => handleSelectWard(w.id)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between text-xs transition-colors"
                >
                  <div>
                    <span className="font-semibold text-[#102442]">{w.name}</span>
                    <span className="text-[#7186A3] ml-2 text-[11px] font-mono">({w.code})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#7186A3]">{w.current_heat_index}°C</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        w.risk_level === 'VERY_HIGH'
                          ? 'bg-red-50 text-red-700'
                          : w.risk_level === 'HIGH'
                          ? 'bg-orange-50 text-orange-700'
                          : w.risk_level === 'MODERATE'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {w.risk_level}
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-3 py-4 text-center text-xs text-[#7186A3]">
                No matching wards found for &ldquo;{searchVal}&rdquo;.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Freshness, Notification Bell, Officer Profile */}
      <div className="flex items-center gap-3">
        {/* Data Freshness Indicator */}
        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
          <span className={`w-2 h-2 rounded-full ${isLivePollingActive ? 'bg-emerald-500 sensor-active-dot' : 'bg-slate-400'}`} />
          <span>Live Telemetry Active</span>
          <span className="text-emerald-600 text-[11px] font-normal">• {lastTelemetryRefresh}</span>
        </div>

        {/* Notification Bell */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 rounded-xl border border-[#DFEAF7] hover:bg-slate-50 text-[#7186A3] hover:text-[#102442] relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-card border border-[#DFEAF7] shadow-modal z-50 p-3 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-[#DFEAF7] mb-2">
                <span className="text-xs font-bold text-[#102442]">Municipal Alerts & Updates</span>
                {unreadCount > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-[11px] text-[#0866D9] hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      markNotificationRead(notif.id);
                      if (notif.link) {
                        setIsNotifOpen(false);
                        navigate(notif.link);
                      }
                    }}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                      notif.unread
                        ? 'bg-blue-50/60 border-blue-100 hover:bg-blue-50'
                        : 'bg-white border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[#102442] flex items-center gap-1.5">
                        {notif.type === 'alert' && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
                        {notif.type === 'sensor' && <Radio className="w-3.5 h-3.5 text-amber-500" />}
                        {notif.type === 'report' && <FileText className="w-3.5 h-3.5 text-[#0866D9]" />}
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-[#7186A3]">{notif.time}</span>
                    </div>
                    <p className="text-[11px] text-[#7186A3] leading-relaxed">{notif.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Officer Profile Menu */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-xl border border-[#DFEAF7] hover:bg-slate-50 transition-colors"
          >
            <img
              src={officer?.avatar_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'}
              alt={officer?.name}
              className="w-7 h-7 rounded-full object-cover border border-[#0866D9]"
            />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-[#102442] leading-tight">
                {officer?.name || 'Dr. Aarti Deshmukh'}
              </span>
              <span className="text-[10px] text-[#7186A3]">Chief Officer, PMC</span>
            </div>
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-card border border-[#DFEAF7] shadow-modal z-50 p-2 animate-fadeIn">
              <div className="px-3 py-2 border-b border-[#DFEAF7] mb-1">
                <p className="text-xs font-bold text-[#102442]">{officer?.name}</p>
                <p className="text-[11px] text-[#7186A3] truncate">{officer?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded bg-blue-50 text-[#0866D9] text-[10px] font-semibold">
                  Badge: {officer?.badge_id || 'PMC-DM-049'}
                </span>
              </div>

              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate('/settings');
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-xs text-[#132D50]"
              >
                <SettingsIcon className="w-3.5 h-3.5 text-[#7186A3]" />
                Dashboard Settings
              </button>

              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate('/policy');
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-xs text-[#132D50]"
              >
                <FileText className="w-3.5 h-3.5 text-[#7186A3]" />
                Official Guidelines
              </button>

              <div className="border-t border-[#DFEAF7] mt-1 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 flex items-center gap-2 text-xs font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-500" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
