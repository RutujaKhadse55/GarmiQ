import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUserStore } from './stores/useUserStore';
import { BottomNavigation } from './components/BottomNavigation';

// Pages
import { OnboardingPage } from './pages/OnboardingPage';
import { HomePage } from './pages/HomePage';
import { MapPage } from './pages/MapPage';
import { ReportPage } from './pages/ReportPage';
import { RoutePage } from './pages/RoutePage';
import { ChatPage } from './pages/ChatPage';
import { AlertsPage } from './pages/AlertsPage';
import { TipsPage } from './pages/TipsPage';
import { SettingsPage } from './pages/SettingsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 mins
      retry: 1
    }
  }
});

function RouteWrapper() {
  const { onboardingCompleted } = useUserStore();
  const location = useLocation();

  // If first launch and onboarding not completed, route to /onboarding
  if (!onboardingCompleted && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="relative min-h-screen bg-[#F5F9FF] flex flex-col justify-between">
      <Routes>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/route" element={<RoutePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/tips" element={<TipsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNavigation />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <RouteWrapper />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
