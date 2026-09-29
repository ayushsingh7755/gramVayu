import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  CloudSun,
  Thermometer,
  CloudRain,
  AlertTriangle,
  Sprout,
  GitCompare,
  ArrowRight,
} from 'lucide-react';
import { useLocationFilter } from '../../hooks/useLocationFilter';
import { analyticsService } from '../../services/analyticsService';
import { weatherService } from '../../services/weatherService';
import { advisoryService } from '../../services/advisoryService';
import { alertService } from '../../services/alertService';
import { locationService } from '../../services/locationService';

import { PrototypeDisclaimer } from '../../components/common/PrototypeDisclaimer';
import { LocationSelector } from '../../components/common/LocationSelector';
import { StatCard } from '../../components/common/StatCard';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { ErrorBanner } from '../../components/common/ErrorBanner';
import { EmptyState } from '../../components/common/EmptyState';
import { RiskBadge } from '../../components/common/RiskBadge';
import { CurrentWeatherCard } from '../../components/weather/CurrentWeatherCard';
import { ForecastTable } from '../../components/weather/ForecastTable';
import { WeatherTrendCharts } from '../../components/charts/WeatherTrendCharts';
import { PanchayatWeatherMap } from '../../components/map/PanchayatWeatherMap';
import { AdvisoryCard } from '../../components/advisory/AdvisoryCard';

export const FarmerDashboard = () => {
  const {
    selectedState,
    selectedDistrict,
    selectedBlock,
    selectedPanchayat,
    setSelectedPanchayat,
    currentPanchayatObj,
  } = useLocationFilter();

  const [stats, setStats] = useState(null);
  const [forecasts, setForecasts] = useState([]);
  const [advisories, setAdvisories] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [mapPanchayats, setMapPanchayats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = useCallback(async () => {
    if (!selectedBlock) return;
    try {
      setLoading(true);
      setError('');

      const [
        dashboardStats,
        panchayatWeatherList,
        advisoriesList,
        alertsList,
        allPanchayatsForMap,
      ] = await Promise.all([
        analyticsService.getDashboardStats({
          state: selectedState,
          district: selectedDistrict,
          block: selectedBlock,
        }),
        selectedPanchayat
          ? weatherService.getPanchayatWeather(selectedPanchayat)
          : Promise.resolve([]),
        advisoryService.getAdvisories({
          block: selectedBlock,
          panchayat: selectedPanchayat,
        }),
        alertService.getAlerts({
          block: selectedBlock,
          isActive: true,
        }),
        locationService.getAllPanchayats({ block: selectedBlock }),
      ]);

      setStats(dashboardStats);
      setForecasts(panchayatWeatherList);
      setAdvisories(advisoriesList.slice(0, 4));
      setAlerts(alertsList);
      setMapPanchayats(allPanchayatsForMap);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to load Panchayat weather dashboard.'
      );
    } finally {
      setLoading(false);
    }
  }, [selectedState, selectedDistrict, selectedBlock, selectedPanchayat]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const currentWeather = forecasts[0] || null;

  return (
    <div className="space-y-6">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Panchayat Weather & Agro-Advisory Dashboard
          </h1>
          <p className="text-sm text-slate-600">
            High-resolution downscaled Panchayat forecast, active risk alerts, and crop recommendations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/compare"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            <GitCompare className="h-4 w-4 text-blue-600" />
            Compare Block vs Panchayat
          </Link>
          {selectedPanchayat && (
            <Link
              to={`/panchayats/${selectedPanchayat}`}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-emerald-700 transition shadow-sm"
            >
              Panchayat Deep-Dive
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Prototype Simulated Downscaling Disclaimer */}
      <PrototypeDisclaimer />

      {/* Hierarchical Location Selector */}
      <LocationSelector showPanchayat={true} showDate={false} />

      {error && <ErrorBanner message={error} onRetry={fetchDashboardData} />}

      {loading ? (
        <LoadingSkeleton rows={5} />
      ) : (
        <>
          {/* 5 Summary Cards (Section 11) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard
              title="Total Panchayats"
              value={stats?.totalPanchayats ?? mapPanchayats.length}
              subtitle="In selected Block"
              icon={MapPin}
              color="green"
            />
            <StatCard
              title="Active Forecasts"
              value={stats?.forecastCount ?? forecasts.length}
              subtitle="7-day simulated horizon"
              icon={CloudSun}
              color="blue"
            />
            <StatCard
              title="Avg Temperature"
              value={`${currentWeather?.temperature ?? stats?.averageTemperature ?? 31.5}°C`}
              subtitle="Panchayat surface mean"
              icon={Thermometer}
              color="amber"
            />
            <StatCard
              title="Expected Rainfall"
              value={`${currentWeather?.rainfall ?? stats?.totalRainfall ?? 20} mm`}
              subtitle={`Rain Prob: ${currentWeather?.probabilityOfRain ?? 70}%`}
              icon={CloudRain}
              color="cyan"
            />
            <StatCard
              title="Rain / Weather Alerts"
              value={alerts.length || stats?.rainAlertCount || 0}
              subtitle="Active advisories & warnings"
              icon={AlertTriangle}
              color="red"
            />
          </div>

          {/* Active Weather Alerts Banner */}
          {alerts.length > 0 && (
            <div className="rounded-xl border border-red-200 bg-red-50/90 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm font-bold text-red-900">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span>Active Weather Warnings ({alerts.length})</span>
                </div>
                <Link
                  to="/alerts"
                  className="text-xs font-semibold text-red-700 hover:underline"
                >
                  View All Alerts →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {alerts.slice(0, 2).map((alert) => (
                  <div
                    key={alert._id}
                    className="rounded-lg bg-white border border-red-200 p-3 flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs sm:text-sm font-bold text-slate-900">
                        {alert.title}
                      </p>
                      <RiskBadge level={alert.severity} />
                    </div>
                    <p className="mt-1 text-xs text-slate-600">
                      {alert.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Current Panchayat Weather Hero Card */}
          {currentWeather ? (
            <CurrentWeatherCard
              weather={currentWeather}
              panchayat={currentPanchayatObj}
            />
          ) : (
            <EmptyState
              title="No Panchayat Weather Forecast Found"
              description="Select a Panchayat above or ask an Agriculture Officer / Admin to generate downscaled forecasts for this Block."
            />
          )}

          {/* 7-Day Forecast Table */}
          {forecasts.length > 0 && <ForecastTable forecasts={forecasts} />}

          {/* 4 Weather Trend Charts (Temp, Rainfall, Humidity, Wind Speed) */}
          {forecasts.length > 0 && <WeatherTrendCharts data={forecasts} />}

          {/* Interactive Leaflet Map */}
          <PanchayatWeatherMap
            panchayats={mapPanchayats}
            selectedPanchayatId={selectedPanchayat}
            onSelectPanchayat={(id) => setSelectedPanchayat(id)}
          />

          {/* Relevant Agricultural Advisories */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sprout className="h-5 w-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-slate-900">
                  Agro-Meteorological Advisories for Your Location
                </h2>
              </div>
              <Link
                to="/advisories"
                className="text-xs sm:text-sm font-semibold text-emerald-700 hover:underline"
              >
                Browse All Advisories →
              </Link>
            </div>

            {advisories.length === 0 ? (
              <EmptyState
                title="No Advisories Found for This Block"
                description="Advisories published by Agriculture Officers for this Block or Panchayat will appear here."
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {advisories.map((adv) => (
                  <AdvisoryCard key={adv._id} advisory={adv} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
