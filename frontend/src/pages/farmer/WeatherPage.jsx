import React, { useState, useEffect, useCallback } from 'react';
import { useLocationFilter } from '../../hooks/useLocationFilter';
import { weatherService } from '../../services/weatherService';
import { PrototypeDisclaimer } from '../../components/common/PrototypeDisclaimer';
import { LocationSelector } from '../../components/common/LocationSelector';
import { CurrentWeatherCard } from '../../components/weather/CurrentWeatherCard';
import { ForecastTable } from '../../components/weather/ForecastTable';
import { WeatherTrendCharts } from '../../components/charts/WeatherTrendCharts';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorBanner } from '../../components/common/ErrorBanner';

export const WeatherPage = () => {
  const {
    selectedBlock,
    selectedPanchayat,
    currentPanchayatObj,
    currentBlockObj,
  } = useLocationFilter();

  const [viewMode, setViewMode] = useState('panchayat'); // 'panchayat' | 'block'
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadWeather = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      if (viewMode === 'panchayat' && selectedPanchayat) {
        const list = await weatherService.getPanchayatWeather(selectedPanchayat);
        setForecasts(list);
      } else if (selectedBlock) {
        const list = await weatherService.getBlockWeather(selectedBlock);
        setForecasts(list);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Unable to fetch weather forecast data.'
      );
    } finally {
      setLoading(false);
    }
  }, [viewMode, selectedPanchayat, selectedBlock]);

  useEffect(() => {
    loadWeather();
  }, [loadWeather]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Weather Forecasts & Micro-Climate Parameters
          </h1>
          <p className="text-sm text-slate-600">
            Inspect 7-day Panchayat simulated forecasts or parent Block meteorological bulletins
          </p>
        </div>

        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          <button
            onClick={() => setViewMode('panchayat')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
              viewMode === 'panchayat'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Panchayat Forecast (Downscaled)
          </button>
          <button
            onClick={() => setViewMode('block')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
              viewMode === 'block'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Block Forecast (Coarse Baseline)
          </button>
        </div>
      </div>

      <PrototypeDisclaimer />

      <LocationSelector showPanchayat={viewMode === 'panchayat'} />

      {error && <ErrorBanner message={error} onRetry={loadWeather} />}

      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : forecasts.length === 0 ? (
        <EmptyState
          title="No Forecast Records Available"
          description="Select another location from the hierarchy bar above."
        />
      ) : (
        <>
          <CurrentWeatherCard
            weather={forecasts[0]}
            panchayat={
              viewMode === 'panchayat'
                ? currentPanchayatObj
                : {
                    name: `${currentBlockObj?.name || 'Block'} (Block Baseline)`,
                    block: currentBlockObj,
                    latitude: currentBlockObj?.centerLatitude,
                    longitude: currentBlockObj?.centerLongitude,
                  }
            }
          />

          <ForecastTable
            forecasts={forecasts}
            title={
              viewMode === 'panchayat'
                ? `7-Day Simulated Downscaled Forecast — ${currentPanchayatObj?.name || ''}`
                : `7-Day Block-Level Forecast Bulletin — ${currentBlockObj?.name || ''}`
            }
          />

          <WeatherTrendCharts data={forecasts} />
        </>
      )}
    </div>
  );
};
