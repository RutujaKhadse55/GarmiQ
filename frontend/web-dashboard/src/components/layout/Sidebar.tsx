import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Sun,
  LayoutDashboard,
  Building2,
  Map as MapIcon,
  Cpu,
  BarChart3,
  Radio,
  FileSpreadsheet,
  BellRing,
  ScrollText,
  BookOpen,
  Settings as SettingsIcon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { authService } from '../../services/authService';
import { useMunicipalAlerts, useMunicipalReports } from '../../hooks/useQueries';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const isCollapsed = useDashboardStore((s) => s.isSidebarCollapsed);
  const toggleSidebar = useDashboardStore((s) => s.toggleSidebar);
  const setMobileDrawerOpen = useDashboardStore((s) => s.setMobileDrawerOpen);

  const officer = authService.getCurrentUser();
  const { data: alertsData } = useMunicipalAlerts();
  const { data: reportsData } = useMunicipalReports();

  const pendingAlerts = alertsData?.summary.pending || 0;
  const pendingReports = reportsData?.reports.filter((r) => r.status === 'submitted').length || 0;

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Overview', to: '/', icon: LayoutDashboard },
    { label: 'Ward Explorer', to: '/wards', icon: Building2 },
    { label: 'Heat-Risk Map', to: '/map', icon: MapIcon },
    { label: 'Forecast & Simulation', to: '/simulator', icon: Cpu },
    { label: 'Risk Rankings', to: '/rankings', icon: BarChart3 },
    { label: 'Live Sensors', to: '/sensors', icon: Radio, pulse: true },
    {
      label: 'Reports',
      to: '/reports',
      icon: FileSpreadsheet,
      badge: pendingReports > 0 ? pendingReports : undefined,
      badgeColor: 'bg-blue-500',
    },
    {
      label: 'Alerts',
      to: '/alerts',
      icon: BellRing,
      badge: pendingAlerts > 0 ? pendingAlerts : undefined,
      badgeColor: 'bg-red-500',
    },
    { label: 'Heat Action Plans', to: '/plans', icon: ScrollText },
    { label: 'Policy & Guidelines', to: '/policy', icon: BookOpen },
    { label: 'Settings', to: '/settings', icon: SettingsIcon },
  ];

  return (
    <aside
      className={`bg-navy-sidebar text-white flex flex-col h-screen shrink-0 transition-all duration-300 border-r border-[#152846] select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#1A3154]">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
            <Sun className="w-5 h-5 text-white animate-spin-slow" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-wide text-white leading-tight">
                Garmi<span className="text-amber-400">Q</span>
              </span>
              <span className="text-[10px] uppercase font-semibold text-sky-300 tracking-wider">
                Beat the Heat
              </span>
            </div>
          )}
        </div>

        <button
          onClick={toggleSidebar}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#1A3154] transition-colors hidden md:block"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-2.5 space-y-1">
        <div className={`px-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 ${isCollapsed ? 'text-center' : ''}`}>
          {isCollapsed ? '•••' : 'Municipal Control'}
        </div>

        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={() => setMobileDrawerOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group relative ${
                isActive
                  ? 'bg-[#0866D9] text-white shadow-md shadow-blue-600/30 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-[#132746]'
              } ${isCollapsed ? 'justify-center px-0' : ''}`
            }
            title={isCollapsed ? item.label : undefined}
          >
            <item.icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />

            {!isCollapsed && (
              <span className="flex-1 truncate tracking-tight">{item.label}</span>
            )}

            {!isCollapsed && item.pulse && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 sensor-active-dot" />
            )}

            {!isCollapsed && item.badge !== undefined && (
              <span
                className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-600'}`}
              >
                {item.badge}
              </span>
            )}

            {isCollapsed && item.badge !== undefined && (
              <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-red-500" />
            )}
          </NavLink>
        ))}
      </div>

      {/* Officer Profile & Municipal Authority Footer */}
      <div className="p-3 border-t border-[#1A3154] bg-[#091529]/60">
        <div
          className={`flex items-center gap-3 ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="relative shrink-0">
              <img
                src={officer?.avatar_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'}
                alt={officer?.name || 'Officer'}
                className="w-8 h-8 rounded-full object-cover border border-sky-400/40"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-navy-sidebar" />
            </div>

            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold text-slate-100 truncate leading-tight flex items-center gap-1">
                  {officer?.name || 'Dr. Aarti Deshmukh'}
                  <ShieldCheck className="w-3 h-3 text-sky-400 shrink-0" />
                </span>
                <span className="text-[10px] text-slate-400 truncate">
                  PMC Disaster Health
                </span>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-[#132746] transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
