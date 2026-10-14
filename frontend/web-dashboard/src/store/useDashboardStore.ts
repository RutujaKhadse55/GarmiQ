import { create } from 'zustand';

export interface DashboardNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'alert' | 'sensor' | 'report' | 'system';
  unread: boolean;
  link?: string;
}

interface DashboardState {
  // Navigation & Shell
  selectedCity: string;
  selectedPeriod: string;
  searchQuery: string;
  selectedWardId: string | null;
  isSidebarCollapsed: boolean;
  isMobileDrawerOpen: boolean;

  // Map settings
  activeMapLayer: 'risk' | 'hvi' | 'lst' | 'built_up';
  mapOpacity: number;

  // Live Telemetry
  telemetryPollingIntervalSec: number;
  isLivePollingActive: boolean;
  lastTelemetryRefresh: string;

  // Notifications
  notifications: DashboardNotification[];

  // Actions
  setSelectedCity: (city: string) => void;
  setSelectedPeriod: (period: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedWardId: (id: string | null) => void;
  toggleSidebar: () => void;
  setMobileDrawerOpen: (open: boolean) => void;
  setActiveMapLayer: (layer: 'risk' | 'hvi' | 'lst' | 'built_up') => void;
  setMapOpacity: (opacity: number) => void;
  setTelemetryPollingInterval: (sec: number) => void;
  toggleLivePolling: () => void;
  recordTelemetryRefresh: () => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  selectedCity: 'Pune (PMC)',
  selectedPeriod: 'Today (15 Jun)',
  searchQuery: '',
  selectedWardId: null,
  isSidebarCollapsed: false,
  isMobileDrawerOpen: false,

  activeMapLayer: 'risk',
  mapOpacity: 0.8,

  telemetryPollingIntervalSec: 30,
  isLivePollingActive: true,
  lastTelemetryRefresh: 'Just now',

  notifications: [
    {
      id: 'notif-1',
      title: 'High Heat Index Warning (45.4°C)',
      message: 'Sensor ESP32-PMC-02 in Kasba Peth recorded extreme threshold at 12:01 PM.',
      time: '2 mins ago',
      type: 'sensor',
      unread: true,
      link: '/sensors',
    },
    {
      id: 'notif-2',
      title: 'Alert Pending Municipal Approval',
      message: 'Critical Red Alert for Kasba Peth & Bhavani Peth requires chief officer sign-off.',
      time: '12 mins ago',
      type: 'alert',
      unread: true,
      link: '/alerts',
    },
    {
      id: 'notif-3',
      title: 'New Hot-Spot Citizen Report',
      message: 'Citizen report PMC-GQ-882101 submitted from Phadke Haud Chowk.',
      time: '25 mins ago',
      type: 'report',
      unread: true,
      link: '/reports',
    },
    {
      id: 'notif-4',
      title: 'Sensor Offline Advisory',
      message: 'Sensor ESP32-PMC-06 (Timber Market) battery drained; flagged offline.',
      time: '1 hour ago',
      type: 'sensor',
      unread: false,
      link: '/sensors',
    },
  ],

  setSelectedCity: (selectedCity) => set({ selectedCity }),
  setSelectedPeriod: (selectedPeriod) => set({ selectedPeriod }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedWardId: (selectedWardId) => set({ selectedWardId }),
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setMobileDrawerOpen: (isMobileDrawerOpen) => set({ isMobileDrawerOpen }),
  setActiveMapLayer: (activeMapLayer) => set({ activeMapLayer }),
  setMapOpacity: (mapOpacity) => set({ mapOpacity }),
  setTelemetryPollingInterval: (telemetryPollingIntervalSec) => set({ telemetryPollingIntervalSec }),
  toggleLivePolling: () => set((state) => ({ isLivePollingActive: !state.isLivePollingActive })),
  recordTelemetryRefresh: () => set({ lastTelemetryRefresh: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }),
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    })),
  clearAllNotifications: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, unread: false })),
    })),
}));
