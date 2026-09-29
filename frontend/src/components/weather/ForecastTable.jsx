import React from 'react';
import { RiskBadge } from '../common/RiskBadge';
import { formatDate } from '../../utils/formatters';

export const ForecastTable = ({
  forecasts = [],
  title = '7-Day Panchayat Simulated Weather Forecast',
}) => {
  if (!forecasts.length) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 px-5 py-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-800">{title}</h3>
          <p className="text-xs text-slate-500">
            High-resolution Panchayat variables inferred from Block forecast + local terrain factors
          </p>
        </div>
        <span className="rounded-md bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-medium text-amber-800">
          Prototype Simulated Downscaling
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-600">
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Condition</th>
              <th className="py-3 px-4">Temp (Min/Max)</th>
              <th className="py-3 px-4">Rainfall</th>
              <th className="py-3 px-4">Humidity</th>
              <th className="py-3 px-4">Wind</th>
              <th className="py-3 px-4">Rain Prob.</th>
              <th className="py-3 px-4">Risk Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {forecasts.map((f) => (
              <tr key={f._id || f.date} className="hover:bg-slate-50/80">
                <td className="py-3 px-4 font-medium text-slate-900 whitespace-nowrap">
                  {formatDate(f.date)}
                </td>
                <td className="py-3 px-4 text-slate-700">
                  {f.weatherCondition}
                </td>
                <td className="py-3 px-4">
                  <span className="font-bold text-slate-900">
                    {f.temperature}°C
                  </span>{' '}
                  <span className="text-xs text-slate-500">
                    ({f.minTemperature}° / {f.maxTemperature}°)
                  </span>
                </td>
                <td className="py-3 px-4 font-semibold text-blue-700">
                  {f.rainfall} mm
                </td>
                <td className="py-3 px-4 text-slate-700">{f.humidity}%</td>
                <td className="py-3 px-4 text-slate-700">
                  {f.windSpeed} km/h ({f.windDirection})
                </td>
                <td className="py-3 px-4 text-slate-700">
                  {f.probabilityOfRain}%
                </td>
                <td className="py-3 px-4">
                  <RiskBadge level={f.risk?.riskLevel || 'low'} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
