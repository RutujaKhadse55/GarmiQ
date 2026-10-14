import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Home,
  Map as MapIcon,
  AlertCircle,
  Menu,
  Navigation,
  Bot,
  Bell,
  Settings,
  HeartHandshake,
  X
} from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Hide on onboarding
  if (location.pathname === '/onboarding') {
    return null;
  }

  const moreItems = [
    {
      title: t('nav.route', 'Safe Route'),
      desc: 'Find shaded pedestrian & cycling paths',
      path: '/route',
      icon: Navigation,
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      title: t('nav.chat', 'AI Assistant'),
      desc: 'Ask thermal safety & hydration questions',
      path: '/chat',
      icon: Bot,
      color: 'bg-indigo-50 text-indigo-600'
    },
    {
      title: t('nav.tips', 'Heat Tips'),
      desc: 'Beat the heat safety guide & precautions',
      path: '/tips',
      icon: HeartHandshake,
      color: 'bg-amber-50 text-amber-600'
    },
    {
      title: t('nav.alerts', 'Alerts & Warnings'),
      desc: 'Official heatwave advisories',
      path: '/alerts',
      icon: Bell,
      color: 'bg-orange-50 text-orange-600'
    },
    {
      title: t('nav.settings', 'Settings'),
      desc: 'Language, low-bandwidth mode & offline storage',
      path: '/settings',
      icon: Settings,
      color: 'bg-slate-100 text-slate-700'
    }
  ];

  return (
    <>
      {/* More Modal / Sheet */}
      {showMoreMenu && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setShowMoreMenu(false)}
          />
          <div className="relative z-10 w-full max-w-md mx-auto bg-white rounded-t-3xl p-5 shadow-2xl border-t border-[#E2EDF9]">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F4F8] mb-3">
              <div>
                <h3 className="text-base font-bold text-[#102A4C]">
                  {t('nav.more', 'More Services')}
                </h3>
                <p className="text-xs text-[#5B708B]">
                  GarmiQ Heat Resilience Platform
                </p>
              </div>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="w-8 h-8 rounded-full bg-[#F5F9FF] flex items-center justify-center text-[#5B708B] hover:bg-[#EDF5FF]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5 py-1">
              {moreItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      setShowMoreMenu(false);
                      navigate(item.path);
                    }}
                    className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#F8FAFD] hover:bg-[#EDF5FF] border border-[#E2EDF9] text-left transition-all active:scale-[0.98]"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-[#102A4C]">
                        {item.title}
                      </div>
                      <div className="text-xs text-[#5B708B] truncate">
                        {item.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Persistent Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2EDF9] pb-[env(safe-area-inset-bottom)] shadow-elevated">
        <div className="flex items-center justify-around max-w-md mx-auto px-2 py-1.5 h-16">
          {/* Home */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[64px] min-h-[44px] rounded-xl transition-all ${
                isActive ? 'text-[#0866D9] font-semibold' : 'text-[#5B708B] hover:text-[#102A4C]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1 rounded-lg ${isActive ? 'bg-[#EDF5FF]' : ''}`}>
                  <Home className="w-5 h-5" />
                </div>
                <span className="text-[11px] mt-0.5">{t('nav.home', 'Home')}</span>
              </>
            )}
          </NavLink>

          {/* Map */}
          <NavLink
            to="/map"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[64px] min-h-[44px] rounded-xl transition-all ${
                isActive ? 'text-[#0866D9] font-semibold' : 'text-[#5B708B] hover:text-[#102A4C]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1 rounded-lg ${isActive ? 'bg-[#EDF5FF]' : ''}`}>
                  <MapIcon className="w-5 h-5" />
                </div>
                <span className="text-[11px] mt-0.5">{t('nav.map', 'Map')}</span>
              </>
            )}
          </NavLink>

          {/* Report */}
          <NavLink
            to="/report"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[64px] min-h-[44px] rounded-xl transition-all ${
                isActive ? 'text-[#0866D9] font-semibold' : 'text-[#5B708B] hover:text-[#102A4C]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1 rounded-lg ${isActive ? 'bg-[#EDF5FF]' : ''}`}>
                  <AlertCircle className="w-5 h-5" />
                </div>
                <span className="text-[11px] mt-0.5">{t('nav.report', 'Report')}</span>
              </>
            )}
          </NavLink>

          {/* More */}
          <button
            onClick={() => setShowMoreMenu(true)}
            className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] rounded-xl transition-all ${
              ['/route', '/chat', '/alerts', '/tips', '/settings'].includes(location.pathname)
                ? 'text-[#0866D9] font-semibold'
                : 'text-[#5B708B] hover:text-[#102A4C]'
            }`}
          >
            <div className={`p-1 rounded-lg ${['/route', '/chat', '/alerts', '/tips', '/settings'].includes(location.pathname) ? 'bg-[#EDF5FF]' : ''}`}>
              <Menu className="w-5 h-5" />
            </div>
            <span className="text-[11px] mt-0.5">{t('nav.more', 'More')}</span>
          </button>
        </div>
      </nav>
    </>
  );
};
