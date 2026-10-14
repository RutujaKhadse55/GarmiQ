import { create } from 'zustand';
import i18n from '../i18n';

interface UserLocation {
  lat: number;
  lon: number;
  address?: string;
  ward_id?: string;
}

interface SubscriberInfo {
  phone: string;
  channel: 'whatsapp' | 'sms';
  active: boolean;
}

interface UserState {
  language: 'en' | 'hi' | 'mr';
  setLanguage: (lang: 'en' | 'hi' | 'mr') => void;

  selectedWardId: string;
  setSelectedWardId: (wardId: string) => void;

  userLocation: UserLocation;
  setUserLocation: (loc: UserLocation) => void;

  hasLocationPermission: boolean;
  setHasLocationPermission: (allowed: boolean) => void;

  onboardingCompleted: boolean;
  setOnboardingCompleted: (completed: boolean) => void;

  subscriber: SubscriberInfo;
  setSubscriber: (sub: SubscriberInfo) => void;

  lowBandwidthMode: boolean;
  setLowBandwidthMode: (low: boolean) => void;

  isOnline: boolean;
  setIsOnline: (online: boolean) => void;

  readAlertIds: string[];
  markAlertRead: (alertId: string) => void;
}

export const useUserStore = create<UserState>((set) => {
  // Read initial stored values safely
  const storedLang = (localStorage.getItem('garmiq_language') as 'en' | 'hi' | 'mr') || 'en';
  const storedOnboarding = localStorage.getItem('garmiq_onboarding_completed') === 'true';
  const storedLowBandwidth = localStorage.getItem('garmiq_low_bandwidth') === 'true';
  const storedWard = localStorage.getItem('garmiq_selected_ward') || 'ward-cp-01';
  const storedSubscriber = localStorage.getItem('garmiq_subscriber');

  return {
    language: storedLang,
    setLanguage: (lang) => {
      localStorage.setItem('garmiq_language', lang);
      i18n.changeLanguage(lang);
      set({ language: lang });
    },

    selectedWardId: storedWard,
    setSelectedWardId: (wardId) => {
      localStorage.setItem('garmiq_selected_ward', wardId);
      set({ selectedWardId: wardId });
    },

    userLocation: {
      lat: 28.6304,
      lon: 77.2177,
      address: 'Connaught Place Outer Ring, New Delhi',
      ward_id: 'ward-cp-01'
    },
    setUserLocation: (loc) => set({ userLocation: loc }),

    hasLocationPermission: false,
    setHasLocationPermission: (allowed) => set({ hasLocationPermission: allowed }),

    onboardingCompleted: storedOnboarding,
    setOnboardingCompleted: (completed) => {
      localStorage.setItem('garmiq_onboarding_completed', completed ? 'true' : 'false');
      set({ onboardingCompleted: completed });
    },

    subscriber: storedSubscriber
      ? JSON.parse(storedSubscriber)
      : { phone: '', channel: 'whatsapp', active: false },
    setSubscriber: (sub) => {
      localStorage.setItem('garmiq_subscriber', JSON.stringify(sub));
      set({ subscriber: sub });
    },

    lowBandwidthMode: storedLowBandwidth,
    setLowBandwidthMode: (low) => {
      localStorage.setItem('garmiq_low_bandwidth', low ? 'true' : 'false');
      set({ lowBandwidthMode: low });
    },

    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    setIsOnline: (online) => set({ isOnline: online }),

    readAlertIds: [],
    markAlertRead: (id) => set((s) => ({ readAlertIds: [...new Set([...s.readAlertIds, id])] }))
  };
});
