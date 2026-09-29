import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Users,
  Maximize2,
  Mountain,
  Trees,
  GitCompare,
} from 'lucide-react';
import { locationService } from '../../services/locationService';
import { advisoryService } from '../../services/advisoryService';
import { PrototypeDisclaimer } from '../../components/common/PrototypeDisclaimer';
import { CurrentWeatherCard } from '../../components/weather/CurrentWeatherCard';
import { ForecastTable } from '../../components/weather/ForecastTable';
import { WeatherTrendCharts } from '../../components/charts/WeatherTrendCharts';
import { AdvisoryCard } from '../../components/advisory/AdvisoryCard';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { ErrorBanner } from '../../components/common/ErrorBanner';

export const PanchayatDetailPage = () => {
  const { id } = useParams();
  const [panchayat, setPanchayat] = useState(null);
  const [advisories, setAdvisories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await locationService.getPanchayatById(id);
      setPanchayat(data);

      const advList = await advisoryService.getAdvisories({
        block: data.block?._id,
        panchayat: data._id,
      });
      setAdvisories(advList);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load Panchayat details.'
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  if (loading) {
    return <LoadingSkeleton rows={5} />;
  }

  if (error || !panchayat) {
    return (
      <div className="space-y-4">
        <ErrorBanner message={error || 'Panchayat not found'} onRetry={loadDetails} />
        <Link
          to="/panchayats"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Panchayats Directory
        </Link>
      </div>
    );
  }

  const forecasts = panchayat.forecasts || [];
  const currentWeather = panchayat.currentWeather || forecasts[0] || null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            to="/panchayats"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:underline mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All Gram Panchayats
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900">
            {panchayat.name}
          </h1>
          <p className="text-sm text-slate-600">
            Block: <strong>{panchayat.block?.name}</strong> • District:{' '}
            <strong>{panchayat.district?.name}</strong> • State:{' '}
            <strong>{panchayat.state?.name}</strong>
          </p>
        </div>

        <Link
          to={`/compare?blockId=${panchayat.block?._id}&panchayatId=${panchayat._id}`}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-blue-700 transition shadow-sm"
        >
          <GitCompare className="h-4 w-4" />
          Compare with {panchayat.block?.name} Block
        </Link>
      </div>

      <PrototypeDisclaimer />

      {/* Geographical & Micro-Terrain Metadata Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin className="h-4 w-4 text-emerald-600" />
            Coordinates
          </div>
          <p className="mt-1 text-sm font-bold text-slate-900">
            {panchayat.latitude}°N, {panchayat.longitude}°E
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Mountain className="h-4 w-4 text-blue-600" />
            Elevation
          </div>
          <p className="mt-1 text-sm font-bold text-slate-900">
            {panchayat.elevation || 215} m ASL
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Trees className="h-4 w-4 text-emerald-600" />
            Vegetation Factor
          </div>
          <p className="mt-1 text-sm font-bold text-slate-900">
            {panchayat.vegetationFactor ?? 0.65} (Canopy Index)
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Maximize2 className="h-4 w-4 text-amber-600" />
            Area
          </div>
          <p className="mt-1 text-sm font-bold text-slate-900">
            {panchayat.area} sq. km
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Users className="h-4 w-4 text-purple-600" />
            Population
          </div>
          <p className="mt-1 text-sm font-bold text-slate-900">
            {panchayat.population?.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Current Weather */}
      {currentWeather && (
        <CurrentWeatherCard weather={currentWeather} panchayat={panchayat} />
      )}

      {/* 7-Day Forecast Table */}
      <ForecastTable
        forecasts={forecasts}
        title={`Next 7 Days Simulated Forecast for ${panchayat.name}`}
      />

      {/* Temperature, Rainfall, Humidity, Wind Charts */}
      <WeatherTrendCharts data={forecasts} />

      {/* Advisories for this Panchayat */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">
          Agro-Meteorological Advisories for {panchayat.name}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {advisories.map((adv) => (
            <AdvisoryCard key={adv._id} advisory={adv} />
          ))}
        </div>
      </div>
    </div>
  );
};
