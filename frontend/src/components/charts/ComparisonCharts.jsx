import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { formatShortDate } from '../../utils/formatters';

export const ComparisonCharts = ({
  blockWeather,
  panchayatWeather,
  series = [],
}) => {
  if (!blockWeather || !panchayatWeather) return null;

  const singleDayParameters = [
    {
      parameter: 'Temperature (°C)',
      Block: blockWeather.temperature,
      Panchayat: panchayatWeather.temperature,
    },
    {
      parameter: 'Rainfall (mm)',
      Block: blockWeather.rainfall,
      Panchayat: panchayatWeather.rainfall,
    },
    {
      parameter: 'Humidity (%)',
      Block: blockWeather.humidity,
      Panchayat: panchayatWeather.humidity,
    },
    {
      parameter: 'Wind (km/h)',
      Block: blockWeather.windSpeed,
      Panchayat: panchayatWeather.windSpeed,
    },
  ];

  const formattedSeries = series.map((item) => ({
    ...item,
    shortDate: formatShortDate(item.date),
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Side-by-side Parameter Bar Comparison */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-800">
            Selected Date Parameter Comparison (Block vs Downscaled Panchayat)
          </h3>
          <p className="text-xs text-slate-500">
            Coarse Block baseline vs simulated Panchayat micro-climate
          </p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={singleDayParameters}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="parameter" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="Block"
                name="Block Forecast (Coarse)"
                fill="#64748b"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="Panchayat"
                name="Panchayat (Simulated Downscaled)"
                fill="#16a34a"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Multi-day Rainfall & Temperature Downscaling Divergence */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-800">
            7-Day Rainfall Downscaling Comparison (mm)
          </h3>
          <p className="text-xs text-slate-500">
            Illustrates how local vegetation & elevation modulate Block rainfall
          </p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="shortDate" tick={{ fontSize: 12 }} />
              <YAxis unit=" mm" tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="blockRainfall"
                name="Block Rainfall (mm)"
                stroke="#64748b"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
              <Line
                type="monotone"
                dataKey="panchayatRainfall"
                name="Panchayat Simulated Rainfall (mm)"
                stroke="#2563eb"
                strokeWidth={2.5}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
