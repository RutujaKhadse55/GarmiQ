import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Home,
  Map as MapIcon,
  Bell,
  Menu,
  Navigation,
  Bot,
  Settings,
  HeartHandshake,
  AlertTriangle,
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
      title: 'Report a Heat Hazard',
      desc: 'Report water shortage, extreme heat, or vulnerable citizen',
      path: '/report',
      icon: AlertTriangle,
      color: 'bg-[#FEF3ED] text-[#F47738]'
    },
    {
      title: t('nav.route', 'Shaded Safe Route'),
      desc: 'Find cool, shaded pedestrian and cycling paths in Pune',
      path: '/route',
      icon: Navigation,
      color: 'bg-[#EBFBF3] text-[#36B878]'
    },
    {
      title: t('nav.tips', 'Heat Safety Tips'),
      desc: 'Beat the heat health recommendations & first aid',
      path: '/tips',
      icon: HeartHandshake,
      color: 'bg-[#FEF9EE] text-[#F3B43F]'
    },
    {
      title: t('nav.chat', 'AI Heat Assistant'),
      desc: 'Ask thermal safety, hydration, and medical questions',
      path: '/chat',
      icon: Bot,
      color: 'bg-[#EEF5FE] text-[#1769E0]'
    },
    {
      title: t('nav.settings', 'Settings'),
      desc: 'Language, low-bandwidth mode & offline storage',
      path: '/settings',
      icon: Settings,
      color: 'bg-slate-100 text-slate-700'
    }
  ];

  const isMoreActive = ['/route', '/chat', '/tips', '/settings', '/report'].includes(location.pathname);

  return (
    <>
      {/* More Services Bottom Sheet */}
      {showMoreMenu && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setShowMoreMenu(false)}
          />
          <div className="relative z-10 w-full max-w-md mx-auto bg-white rounded-t-3xl p-5 shadow-2xl border-t border-[#E2EAF4]">
            <div className="flex items-center justify-between pb-3 border-b border-[#F5F8FC] mb-3">
              <div>
                <h3 className="text-base font-bold text-[#173153]">
                  More Services
                </h3>
                <p className="text-xs text-[#71829A]">
                  GarmiQ Heat Resilience Platform • Pune
                </p>
              </div>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="w-8 h-8 rounded-full bg-[#F5F8FC] flex items-center justify-center text-[#71829A] hover:bg-[#EEF5FE] transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 py-1 max-h-[60vh] overflow-y-auto">
              {moreItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      setShowMoreMenu(false);
                      navigate(item.path);
                    }}
                    className="w-full flex items-center gap-3.5 p-3 rounded-2xl bg-[#F5F8FC] hover:bg-[#EEF5FE] border border-[#E2EAF4] text-left transition-all active:scale-[0.98]"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-[#173153]">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-[#71829A] truncate mt-0.5">
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

      {/* Main Bottom Navigation Bar: Exactly 4 Items (Home, Map, Alerts, More) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2EAF4] pb-[env(safe-area-inset-bottom)] shadow-soft">
        <div className="flex items-center justify-around max-w-md mx-auto px-3 py-1.5 h-16">
          {/* 1. Home */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 min-h-[44px] rounded-2xl transition-all ${
                isActive
                  ? 'text-[#1769E0] font-bold'
                  : 'text-[#71829A] hover:text-[#173153]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`p-1.5 rounded-xl transition-colors ${
                    isActive ? 'bg-[#EEF5FE]' : ''
                  }`}
                >
                  <Home className="w-5 h-5" />
                </div>
                <span className="text-[10px] mt-0.5">{t('nav.home', 'Home')}</span>
              </>
            )}
          </NavLink>

          {/* 2. Map */}
          <NavLink
            to="/map"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 min-h-[44px] rounded-2xl transition-all ${
                isActive
                  ? 'text-[#1769E0] font-bold'
                  : 'text-[#71829A] hover:text-[#173153]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`p-1.5 rounded-xl transition-colors ${
                    isActive ? 'bg-[#EEF5FE]' : ''
                  }`}
                >
                  <MapIcon className="w-5 h-5" />
                </div>
                <span className="text-[10px] mt-0.5">{t('nav.map', 'Map')}</span>
              </>
            )}
          </NavLink>

          {/* 3. Alerts */}
          <NavLink
            to="/alerts"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 min-h-[44px] rounded-2xl transition-all ${
                isActive
                  ? 'text-[#1769E0] font-bold'
                  : 'text-[#71829A] hover:text-[#173153]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`p-1.5 rounded-xl transition-colors ${
                    isActive ? 'bg-[#EEF5FE]' : ''
                  }`}
                >
                  <Bell className="w-5 h-5" />
                </div>
                <span className="text-[10px] mt-0.5">{t('nav.alerts', 'Alerts')}</span>
              </>
            )}
          </NavLink>

          {/* 4. More */}
          <button
            onClick={() => setShowMoreMenu(true)}
            className={`flex flex-col items-center justify-center flex-1 min-h-[44px] rounded-2xl transition-all ${
              isMoreActive
                ? 'text-[#1769E0] font-bold'
                : 'text-[#71829A] hover:text-[#173153]'
            }`}
          >
            <div
              className={`p-1.5 rounded-xl transition-colors ${
                isMoreActive ? 'bg-[#EEF5FE]' : ''
              }`}
            >
              <Menu className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5">{t('nav.more', 'More')}</span>
          </button>
        </div>
      </nav>
    </>
  );
};
