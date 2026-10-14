import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Pages
import { LoginPage } from '../pages/Login/LoginPage';
import { OverviewPage } from '../pages/Overview/OverviewPage';
import { WardsPage } from '../pages/Wards/WardsPage';
import { WardDetailsPage } from '../pages/WardDetails/WardDetailsPage';
import { MapPage } from '../pages/Map/MapPage';
import { SimulatorPage } from '../pages/Simulator/SimulatorPage';
import { RankingsPage } from '../pages/Rankings/RankingsPage';
import { SensorsPage } from '../pages/Sensors/SensorsPage';
import { ReportsPage } from '../pages/Reports/ReportsPage';
import { AlertsPage } from '../pages/Alerts/AlertsPage';
import { PlansPage } from '../pages/Plans/PlansPage';
import { PlanDetailPage } from '../pages/Plans/PlanDetailPage';
import { PolicyPage } from '../pages/Policy/PolicyPage';
import { SettingsPage } from '../pages/Settings/SettingsPage';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Municipal Dashboard Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<OverviewPage />} />
        <Route path="wards" element={<WardsPage />} />
        <Route path="wards/:id" element={<WardDetailsPage />} />
        <Route path="map" element={<MapPage />} />
        <Route path="simulator" element={<SimulatorPage />} />
        <Route path="rankings" element={<RankingsPage />} />
        <Route path="sensors" element={<SensorsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="alerts" element={<AlertsPage />} />
        <Route path="plans" element={<PlansPage />} />
        <Route path="plans/:id" element={<PlanDetailPage />} />
        <Route path="policy" element={<PolicyPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
