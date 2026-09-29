import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Layers,
  MapPin,
  CloudSun,
  Sprout,
  AlertTriangle,
  Cpu,
  CheckCircle2,
} from 'lucide-react';
import { useLocationFilter } from '../../hooks/useLocationFilter';
import { analyticsService } from '../../services/analyticsService';
import { locationService } from '../../services/locationService';
import { weatherService } from '../../services/weatherService';
import { PrototypeDisclaimer } from '../../components/common/PrototypeDisclaimer';
import { LocationSelector } from '../../components/common/LocationSelector';
import { StatCard } from '../../components/common/StatCard';
import { PanchayatWeatherMap } from '../../components/map/PanchayatWeatherMap';
import { WeatherTrendCharts } from '../../components/charts/WeatherTrendCharts';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';

export const AdminDashboard = () => {
  const {
    selectedBlock,
    selectedPanchayat,
    setSelectedPanchayat,
    selectedDate,
    currentBlockObj,
  } = useLocationFilter();

  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [panchayats, setPanchayats] = useState([]);
  const [downscaleMsg, setDownscaleMsg] = useState('');
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadAdminOverview = useCallback(async () => {
    try {
      setLoading(true);
      const [dashStats, trendRes, pList] = await Promise.all([
        analyticsService.getDashboardStats(),
        analyticsService.getWeatherTrends({ block: selectedBlock }),
        locationService.getAllPanchayats({ date: selectedDate }),
      ]);
      setStats(dashStats);
      setTrends(trendRes.dailyTrends || []);
      setPanchayats(pList);
    } catch (err) {
      console.error('Admin overview error:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedBlock, selectedDate]);

  useEffect(() => {
    loadAdminOverview();
  }, [loadAdminOverview]);

  const handleRunDownscaling = async () => {
    if (!selectedBlock) return;
    try {
      setGenerating(true);
      const res = await weatherService.generateDownscaledForecast({
        blockId: selectedBlock,
        date: selectedDate,
      });
      setDownscaleMsg(
        `Generated ${res.panchayatForecasts?.length} simulated Panchayat forecasts for ${currentBlockObj?.name} Block (${selectedDate}).`
      );
      await loadAdminOverview();
    } catch (err) {
      alert(err.response?.data?.message || 'Downscaling failed.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            System Administration & Downscaling Control Center
          </h1>
          <p className="text-sm text-slate-600">
            Manage geographic hierarchy, users, Block weather bulletins, and Panchayat downscaling simulations
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            <Users className="h-4 w-4 text-purple-600" />
            Manage Users
          </Link>
          <Link
            to="/admin/locations"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            <Layers className="h-4 w-4 text-blue-600" />
            Manage Locations
          </Link>
          <button
            onClick={handleRunDownscaling}
            disabled={generating}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm"
          >
            <Cpu className="h-4 w-4" />
            {generating
              ? 'Generating...'
              : `Generate Panchayat Forecast (${currentBlockObj?.name || 'Block'})`}
          </button>
        </div>
      </div>

      <PrototypeDisclaimer />

      {downscaleMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <span>{downscaleMsg}</span>
        </div>
      )}

      <LocationSelector showPanchayat={true} showDate={true} />

      {loading ? (
        <LoadingSkeleton rows={5} />
      ) : (
        <>
          {/* System Statistics Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            <StatCard
              title="Total Panchayats"
              value={stats?.totalPanchayats ?? 18}
              subtitle={`${stats?.totalBlocks ?? 5} Blocks / ${stats?.totalDistricts ?? 3} Districts`}
              icon={MapPin}
              color="green"
            />
            <StatCard
              title="Weather Records"
              value={stats?.forecastCount ?? 0}
              subtitle="Block + Panchayat"
              icon={CloudSun}
              color="blue"
            />
            <StatCard
              title="Avg Temperature"
              value={`${stats?.averageTemperature ?? 31.5}°C`}
              subtitle="Across Panchayats"
              icon={Cpu}
              color="amber"
            />
            <StatCard
              title="Agro Advisories"
              value={stats?.advisoryCount ?? 0}
              subtitle="Published bulletins"
              icon={Sprout}
              color="cyan"
            />
            <StatCard
              title="Active Alerts"
              value={stats?.activeAlerts ?? 0}
              subtitle="Risk warnings"
              icon={AlertTriangle}
              color="red"
            />
            <StatCard
              title="Registered Users"
              value={stats?.totalUsers ?? 3}
              subtitle="Farmers, Officers, Admins"
              icon={Users}
              color="purple"
            />
          </div>

          {/* Interactive GIS Map */}
          <PanchayatWeatherMap
            panchayats={panchayats}
            selectedPanchayatId={selectedPanchayat}
            onSelectPanchayat={(id) => setSelectedPanchayat(id)}
          />

          {/* Trend Charts */}
          <WeatherTrendCharts data={trends} />
        </>
      )}
    </div>
  );
};
