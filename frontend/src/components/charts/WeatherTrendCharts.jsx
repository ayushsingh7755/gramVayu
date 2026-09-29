import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { formatShortDate } from '../../utils/formatters';

export const WeatherTrendCharts = ({ data = [] }) => {
  const formatted = data.map((item) => ({
    ...item,
    shortDate: formatShortDate(item.date),
  }));

  if (!formatted.length) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Temperature Trend */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-800">
            Temperature Trend (°C)
          </h3>
          <p className="text-xs text-slate-500">
            Daily mean, maximum, and minimum temperature trajectory
          </p>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formatted}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="shortDate" tick={{ fontSize: 12 }} />
              <YAxis unit="°C" tick={{ fontSize: 12 }} domain={['auto', 'auto']} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="maxTemperature"
                name="Max Temp (°C)"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="temperature"
                name="Mean Temp (°C)"
                stroke="#f59e0b"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="minTemperature"
                name="Min Temp (°C)"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Rainfall Trend */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-800">
            Rainfall Forecast Trend (mm)
          </h3>
          <p className="text-xs text-slate-500">
            Expected daily precipitation across the 7-day window
          </p>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formatted}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="shortDate" tick={{ fontSize: 12 }} />
              <YAxis unit=" mm" tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="rainfall"
                name="Rainfall (mm)"
                fill="#2563eb"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Relative Humidity Trend */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-800">
            Relative Humidity Trend (%)
          </h3>
          <p className="text-xs text-slate-500">
            Canopy moisture & disease pressure indicator
          </p>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formatted}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="shortDate" tick={{ fontSize: 12 }} />
              <YAxis unit="%" domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="humidity"
                name="Humidity (%)"
                stroke="#0d9488"
                fill="#99f6e4"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Wind Speed Trend */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-800">
            Surface Wind Speed Trend (km/h)
          </h3>
          <p className="text-xs text-slate-500">
            Critical for spraying operations and tall crop lodging alerts
          </p>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formatted}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="shortDate" tick={{ fontSize: 12 }} />
              <YAxis unit=" km/h" tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="windSpeed"
                name="Wind Speed (km/h)"
                stroke="#7c3aed"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
