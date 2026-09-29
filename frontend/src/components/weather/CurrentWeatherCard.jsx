import React from 'react';
import {
  Thermometer,
  CloudRain,
  Droplets,
  Wind,
  Gauge,
  Cloud,
  Compass,
} from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';
import { PrototypeDisclaimer } from '../common/PrototypeDisclaimer';
import { formatDate } from '../../utils/formatters';

export const CurrentWeatherCard = ({ weather, panchayat }) => {
  if (!weather) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 via-blue-950 to-emerald-950 text-white p-6 shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/15 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-300">
              Panchayat Micro-Forecast
            </span>
            <PrototypeDisclaimer compact />
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight">
            {panchayat?.name || weather.panchayat?.name || 'Selected Panchayat'}
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Block: {panchayat?.block?.name || weather.block?.name || '—'} •
            District: {panchayat?.district?.name || weather.district?.name || '—'}{' '}
            • Coordinates: {panchayat?.latitude || weather.panchayat?.latitude}°N,{' '}
            {panchayat?.longitude || weather.panchayat?.longitude}°E
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-slate-300">{formatDate(weather.date)}</p>
          <div className="mt-1.5">
            <RiskBadge level={weather.risk?.riskLevel || 'low'} />
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Primary Temp & Condition */}
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 border border-white/15">
            <Thermometer className="h-9 w-9 text-amber-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold">
                {weather.temperature}°C
              </span>
              <span className="text-sm text-slate-300">
                ({weather.minTemperature}° / {weather.maxTemperature}°)
              </span>
            </div>
            <p className="text-sm font-medium text-emerald-300 mt-0.5">
              {weather.weatherCondition} • Rain Prob: {weather.probabilityOfRain}%
            </p>
          </div>
        </div>

        {/* 6 Meteorological Metrics */}
        <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="rounded-xl bg-white/10 border border-white/10 p-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <CloudRain className="h-4 w-4 text-blue-300" />
              Rainfall
            </div>
            <p className="mt-1 text-lg font-bold">{weather.rainfall} mm</p>
          </div>

          <div className="rounded-xl bg-white/10 border border-white/10 p-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <Droplets className="h-4 w-4 text-cyan-300" />
              Humidity
            </div>
            <p className="mt-1 text-lg font-bold">{weather.humidity}%</p>
          </div>

          <div className="rounded-xl bg-white/10 border border-white/10 p-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <Wind className="h-4 w-4 text-emerald-300" />
              Wind Speed
            </div>
            <p className="mt-1 text-lg font-bold">
              {weather.windSpeed} km/h ({weather.windDirection || 'NW'})
            </p>
          </div>

          <div className="rounded-xl bg-white/10 border border-white/10 p-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <Gauge className="h-4 w-4 text-purple-300" />
              Pressure
            </div>
            <p className="mt-1 text-lg font-bold">{weather.pressure} hPa</p>
          </div>

          <div className="rounded-xl bg-white/10 border border-white/10 p-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <Cloud className="h-4 w-4 text-slate-300" />
              Cloud Cover
            </div>
            <p className="mt-1 text-lg font-bold">{weather.cloudCover}%</p>
          </div>

          <div className="rounded-xl bg-white/10 border border-white/10 p-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <Compass className="h-4 w-4 text-amber-300" />
              Source
            </div>
            <p className="mt-1 text-xs font-semibold text-amber-200 truncate">
              {weather.source || 'Prototype Simulated Downscaling'}
            </p>
          </div>
        </div>
      </div>

      {weather.risk?.reason && (
        <div className="mt-4 rounded-xl bg-white/10 border border-white/15 px-4 py-2.5 text-xs text-slate-200 flex items-center justify-between">
          <span>
            <strong className="text-white">Rule-Based Risk Assessment:</strong>{' '}
            {weather.risk.reason}
          </span>
          <span className="text-[11px] text-emerald-300">
            Downscaling Mode: {weather.forecastType}
          </span>
        </div>
      )}
    </div>
  );
};
