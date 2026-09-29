import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { MainLayout } from './layouts/MainLayout';

import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';

import { FarmerDashboard } from './pages/farmer/FarmerDashboard';
import { WeatherPage } from './pages/farmer/WeatherPage';
import { PanchayatsPage } from './pages/farmer/PanchayatsPage';
import { PanchayatDetailPage } from './pages/farmer/PanchayatDetailPage';
import { AdvisoriesPage } from './pages/farmer/AdvisoriesPage';
import { AlertsPage } from './pages/farmer/AlertsPage';
import { MapPage } from './pages/farmer/MapPage';
import { ComparePage } from './pages/farmer/ComparePage';
import { AnalyticsPage } from './pages/farmer/AnalyticsPage';
import { ProfilePage } from './pages/farmer/ProfilePage';

import { OfficerDashboard } from './pages/officer/OfficerDashboard';
import { OfficerWeatherPage } from './pages/officer/OfficerWeatherPage';
import { OfficerPanchayatsPage } from './pages/officer/OfficerPanchayatsPage';
import { OfficerAdvisoriesPage } from './pages/officer/OfficerAdvisoriesPage';
import { OfficerComparePage } from './pages/officer/OfficerComparePage';
import { OfficerAlertsPage } from './pages/officer/OfficerAlertsPage';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminLocationsPage } from './pages/admin/AdminLocationsPage';
import { AdminWeatherPage } from './pages/admin/AdminWeatherPage';
import { AdminAdvisoriesPage } from './pages/admin/AdminAdvisoriesPage';
import { AdminAlertsPage } from './pages/admin/AdminAlertsPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';

export default function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes inside MainLayout */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* Farmer & General User Routes */}
            <Route path="/dashboard" element={<FarmerDashboard />} />
            <Route path="/weather" element={<WeatherPage />} />
            <Route path="/panchayats" element={<PanchayatsPage />} />
            <Route path="/panchayats/:id" element={<PanchayatDetailPage />} />
            <Route path="/advisories" element={<AdvisoriesPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* Agriculture Officer Routes */}
            <Route
              path="/officer/dashboard"
              element={
                <ProtectedRoute allowedRoles={['officer', 'admin']}>
                  <OfficerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/officer/weather"
              element={
                <ProtectedRoute allowedRoles={['officer', 'admin']}>
                  <OfficerWeatherPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/officer/panchayats"
              element={
                <ProtectedRoute allowedRoles={['officer', 'admin']}>
                  <OfficerPanchayatsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/officer/advisories"
              element={
                <ProtectedRoute allowedRoles={['officer', 'admin']}>
                  <OfficerAdvisoriesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/officer/compare"
              element={
                <ProtectedRoute allowedRoles={['officer', 'admin']}>
                  <OfficerComparePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/officer/alerts"
              element={
                <ProtectedRoute allowedRoles={['officer', 'admin']}>
                  <OfficerAlertsPage />
                </ProtectedRoute>
              }
            />

            {/* System Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminUsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/locations"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLocationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/weather"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminWeatherPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/advisories"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminAdvisoriesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/alerts"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminAlertsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminAnalyticsPage />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </LocationProvider>
    </AuthProvider>
  );
}
