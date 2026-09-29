import React, { useState, useEffect, useCallback } from 'react';
import { GitCompare, Cpu } from 'lucide-react';
import { useLocationFilter } from '../../hooks/useLocationFilter';
import { weatherService } from '../../services/weatherService';
import { PrototypeDisclaimer } from '../../components/common/PrototypeDisclaimer';
import { LocationSelector } from '../../components/common/LocationSelector';
import { ComparisonCharts } from '../../components/charts/ComparisonCharts';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { ErrorBanner } from '../../components/common/ErrorBanner';
import { RiskBadge } from '../../components/common/RiskBadge';
import { formatDelta } from '../../utils/formatters';

export const ComparePage = () => {
  const { selectedBlock, selectedPanchayat, selectedDate } =
    useLocationFilter();

  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchComparison = useCallback(async () => {
    if (!selectedBlock || !selectedPanchayat) return;
    try {
      setLoading(true);
      setError('');
      const data = await weatherService.compareBlockVsPanchayat({
        blockId: selectedBlock,
        panchayatId: selectedPanchayat,
        date: selectedDate,
      });
      setComparison(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to compare Block vs Panchayat weather.'
      );
    } finally {
      setLoading(false);
    }
  }, [selectedBlock, selectedPanchayat, selectedDate]);

  useEffect(() => {
    fetchComparison();
  }, [fetchComparison]);

  const bw = comparison?.blockWeather;
  const pw = comparison?.panchayatWeather;
  const diff = comparison?.differences;
  const meta = pw?.downscalingMetadata;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          Block vs Panchayat Downscaling Comparison
        </h1>
        <p className="text-sm text-slate-600">
          Side-by-side comparison of coarse Block-level weather bulletin against high-resolution simulated Panchayat forecast
        </p>
      </div>

      <PrototypeDisclaimer />

      <LocationSelector showPanchayat={true} showDate={true} />

      {error && <ErrorBanner message={error} onRetry={fetchComparison} />}

      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : bw && pw ? (
        <>
          {/* Side-by-Side Comparison Table (Section 14) */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <GitCompare className="h-5 w-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  {comparison.block?.name} Block vs {comparison.panchayat?.name}{' '}
                  ({comparison.date})
                </h3>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-800">
                <Cpu className="h-3.5 w-3.5" />
                Method: {meta?.method || 'Prototype Simulated Downscaling'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-bold uppercase text-slate-600">
                    <th className="py-3.5 px-6">Meteorological Variable</th>
                    <th className="py-3.5 px-6">
                      Block Level ({comparison.block?.name})
                    </th>
                    <th className="py-3.5 px-6 bg-emerald-50/50 text-emerald-900">
                      Panchayat Level ({comparison.panchayat?.name} — Simulated)
                    </th>
                    <th className="py-3.5 px-6">Downscaled Delta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="py-3.5 px-6 font-semibold text-slate-800">
                      Temperature
                    </td>
                    <td className="py-3.5 px-6 text-slate-700 font-medium">
                      {bw.temperature}°C
                    </td>
                    <td className="py-3.5 px-6 bg-emerald-50/30 font-bold text-slate-900">
                      {pw.temperature}°C
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-blue-700">
                      {formatDelta(diff?.temperature, '°C')}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3.5 px-6 font-semibold text-slate-800">
                      Rainfall
                    </td>
                    <td className="py-3.5 px-6 text-slate-700 font-medium">
                      {bw.rainfall} mm
                    </td>
                    <td className="py-3.5 px-6 bg-emerald-50/30 font-bold text-blue-700">
                      {pw.rainfall} mm
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-blue-700">
                      {formatDelta(diff?.rainfall, ' mm')} (
                      {meta?.rainfallMultiplier ?? 1}x)
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3.5 px-6 font-semibold text-slate-800">
                      Relative Humidity
                    </td>
                    <td className="py-3.5 px-6 text-slate-700 font-medium">
                      {bw.humidity}%
                    </td>
                    <td className="py-3.5 px-6 bg-emerald-50/30 font-bold text-slate-900">
                      {pw.humidity}%
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-emerald-700">
                      {formatDelta(diff?.humidity, '%')}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3.5 px-6 font-semibold text-slate-800">
                      Wind Speed
                    </td>
                    <td className="py-3.5 px-6 text-slate-700 font-medium">
                      {bw.windSpeed} km/h
                    </td>
                    <td className="py-3.5 px-6 bg-emerald-50/30 font-bold text-slate-900">
                      {pw.windSpeed} km/h
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-purple-700">
                      {formatDelta(diff?.windSpeed, ' km/h')}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3.5 px-6 font-semibold text-slate-800">
                      Surface Pressure
                    </td>
                    <td className="py-3.5 px-6 text-slate-700 font-medium">
                      {bw.pressure} hPa
                    </td>
                    <td className="py-3.5 px-6 bg-emerald-50/30 font-bold text-slate-900">
                      {pw.pressure} hPa
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-slate-600">
                      {formatDelta(diff?.pressure, ' hPa')}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3.5 px-6 font-semibold text-slate-800">
                      Calculated Risk Level
                    </td>
                    <td className="py-3.5 px-6">
                      <RiskBadge level={bw.risk?.riskLevel} />
                    </td>
                    <td className="py-3.5 px-6 bg-emerald-50/30">
                      <RiskBadge level={pw.risk?.riskLevel} />
                    </td>
                    <td className="py-3.5 px-6 text-xs text-slate-500">
                      {pw.risk?.reason}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Spatial Adjustment Factors Explanation */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
              <span>
                <strong>Terrain & Spatial Factors Used:</strong> Distance from
                Block Center: {meta?.distanceFromBlockKm ?? 3.2} km • Elevation
                Delta: {formatDelta(meta?.elevationDeltaM ?? 0, 'm')} •
                Vegetation Canopy Factor:{' '}
                {comparison.panchayat?.vegetationFactor ?? 0.65}
              </span>
              <span className="text-amber-800 font-semibold">
                Deterministic Prototype Output (Ready for AI/ML Replacement)
              </span>
            </div>
          </div>

          {/* Comparison Charts */}
          <ComparisonCharts
            blockWeather={bw}
            panchayatWeather={pw}
            series={comparison.series || []}
          />
        </>
      ) : null}
    </div>
  );
};
