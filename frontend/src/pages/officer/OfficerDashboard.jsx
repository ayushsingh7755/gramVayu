import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  MapPin,
  CloudSun,
  Sprout,
  AlertTriangle,
  GitCompare,
  CheckCircle2,
} from 'lucide-react';
import { useLocationFilter } from '../../hooks/useLocationFilter';
import { weatherService } from '../../services/weatherService';
import { analyticsService } from '../../services/analyticsService';
import { locationService } from '../../services/locationService';
import { PrototypeDisclaimer } from '../../components/common/PrototypeDisclaimer';
import { LocationSelector } from '../../components/common/LocationSelector';
import { StatCard } from '../../components/common/StatCard';
import { PanchayatWeatherMap } from '../../components/map/PanchayatWeatherMap';
import { ForecastTable } from '../../components/weather/ForecastTable';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';

export const OfficerDashboard = () => {
  const {
    selectedState,
    selectedDistrict,
    selectedBlock,
    selectedPanchayat,
    setSelectedPanchayat,
    selectedDate,
    currentBlockObj,
  } = useLocationFilter();

  const [stats, setStats] = useState(null);
  const [blockForecasts, setBlockForecasts] = useState([]);
  const [panchayats, setPanchayats] = useState([]);
  const [downscaleResult, setDownscaleResult] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!selectedBlock) return;
    try {
      setLoading(true);
      const [dashStats, bWeather, pList] = await Promise.all([
        analyticsService.getDashboardStats({
          state: selectedState,
          district: selectedDistrict,
          block: selectedBlock,
        }),
        weatherService.getBlockWeather(selectedBlock),
        locationService.getAllPanchayats({
          block: selectedBlock,
          date: selectedDate,
        }),
      ]);
      setStats(dashStats);
      setBlockForecasts(bWeather);
      setPanchayats(pList);
    } catch (err) {
      console.error('Officer dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedState, selectedDistrict, selectedBlock, selectedDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRunDownscaling = async () => {
    if (!selectedBlock) return;
    try {
      setGenerating(true);
      const res = await weatherService.generateDownscaledForecast({
        blockId: selectedBlock,
        date: selectedDate,
      });
      setDownscaleResult(res);
      await loadData();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          'Failed to generate Panchayat downscaled forecasts.'
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Agriculture Officer Command Center
          </h1>
          <p className="text-sm text-slate-600">
            Execute Block-to-Panchayat downscaling simulations, monitor risk maps, and issue crop advisories
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/officer/compare"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            <GitCompare className="h-4 w-4 text-blue-600" />
            Compare Block vs Panchayat
          </Link>
          <Link
            to="/officer/advisories"
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs sm:text-sm font-bold text-white hover:bg-emerald-700"
          >
            <Sprout className="h-4 w-4" />
            Manage Advisories
          </Link>
        </div>
      </div>

      <PrototypeDisclaimer />

      <LocationSelector showPanchayat={true} showDate={true} />

      {/* Section 28: Block-to-Panchayat Downscaling Trigger Card */}
      <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-950 via-slate-900 to-emerald-950 p-6 text-white shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
              <Cpu className="h-4 w-4" />
              <span>Prototype Downscaling Engine (Block → Panchayat)</span>
            </div>
            <h2 className="text-lg font-bold">
              Generate Panchayat-Level Forecasts for{' '}
              {currentBlockObj?.name || 'Selected'} Block ({selectedDate})
            </h2>
            <p className="text-xs text-slate-300">
              Fetches the Block-level weather bulletin for {selectedDate} and
              computes deterministic high-resolution forecasts for every Gram
              Panchayat in {currentBlockObj?.name} using elevation, coordinates,
              and vegetation factors.
            </p>
          </div>

          <button
            onClick={handleRunDownscaling}
            disabled={generating}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition shadow-lg disabled:opacity-50"
          >
            <Cpu className="h-4 w-4" />
            {generating
              ? 'Running Downscaler...'
              : 'Generate Panchayat Forecast'}
          </button>
        </div>

        {downscaleResult && (
          <div className="mt-4 rounded-xl bg-white/10 border border-white/20 p-4 text-xs">
            <div className="flex items-center gap-2 font-bold text-emerald-300 mb-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>
                Successfully generated & saved{' '}
                {downscaleResult.panchayatForecasts?.length} Panchayat forecasts
                from {downscaleResult.block?.name} Block baseline (Temp:{' '}
                {downscaleResult.blockWeather?.temperature}°C, Rain:{' '}
                {downscaleResult.blockWeather?.rainfall} mm)
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-2">
              {downscaleResult.panchayatForecasts?.map((pf) => (
                <div
                  key={pf._id}
                  className="rounded-lg bg-slate-900/80 border border-white/10 p-2.5"
                >
                  <p className="font-bold text-white">{pf.panchayat?.name}</p>
                  <p className="text-slate-300 mt-1">
                    Temp: <strong>{pf.temperature}°C</strong> | Rain:{' '}
                    <strong className="text-blue-300">{pf.rainfall} mm</strong>{' '}
                    | Humidity: <strong>{pf.humidity}%</strong>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Panchayats in Block"
              value={panchayats.length}
              subtitle={currentBlockObj?.name}
              icon={MapPin}
              color="green"
            />
            <StatCard
              title="Active Forecasts"
              value={stats?.forecastCount ?? 0}
              subtitle="Block + Panchayat records"
              icon={CloudSun}
              color="blue"
            />
            <StatCard
              title="Published Advisories"
              value={stats?.advisoryCount ?? 0}
              subtitle="Crop recommendations"
              icon={Sprout}
              color="amber"
            />
            <StatCard
              title="Active Weather Alerts"
              value={stats?.activeAlerts ?? 0}
              subtitle="Early warning bulletins"
              icon={AlertTriangle}
              color="red"
            />
          </div>

          <PanchayatWeatherMap
            panchayats={panchayats}
            selectedPanchayatId={selectedPanchayat}
            onSelectPanchayat={(id) => setSelectedPanchayat(id)}
          />

          <ForecastTable
            forecasts={blockForecasts}
            title={`Coarse Block-Level Weather Bulletin — ${currentBlockObj?.name || 'Block'}`}
          />
        </>
      )}
    </div>
  );
};
