import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { useLocationFilter } from '../../hooks/useLocationFilter';
import { analyticsService } from '../../services/analyticsService';
import { PrototypeDisclaimer } from '../../components/common/PrototypeDisclaimer';
import { LocationSelector } from '../../components/common/LocationSelector';
import { WeatherTrendCharts } from '../../components/charts/WeatherTrendCharts';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { RiskBadge } from '../../components/common/RiskBadge';

const RISK_COLORS = ['#16a34a', '#eab308', '#ea580c', '#dc2626'];

export const AnalyticsPage = () => {
  const { selectedState, selectedDistrict, selectedBlock } =
    useLocationFilter();

  const [trends, setTrends] = useState([]);
  const [riskSummary, setRiskSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const [trendRes, riskRes] = await Promise.all([
        analyticsService.getWeatherTrends({
          state: selectedState,
          district: selectedDistrict,
          block: selectedBlock,
        }),
        analyticsService.getRiskSummary({
          district: selectedDistrict,
          block: selectedBlock,
        }),
      ]);
      setTrends(trendRes.dailyTrends || []);
      setRiskSummary(riskRes);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedState, selectedDistrict, selectedBlock]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const pieData = riskSummary
    ? [
        { name: 'Normal (Low)', value: riskSummary.low || 0 },
        { name: 'Moderate Risk', value: riskSummary.moderate || 0 },
        { name: 'High Risk', value: riskSummary.high || 0 },
        { name: 'Severe Risk', value: riskSummary.severe || 0 },
      ]
    : [];

  const riskTypeData = riskSummary?.byType
    ? Object.entries(riskSummary.byType).map(([key, value]) => ({
        type: key.replace('_', ' '),
        count: value,
      }))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          Agro-Meteorological Trends & Risk Analytics
        </h1>
        <p className="text-sm text-slate-600">
          Aggregated Panchayat weather trends and rule-based risk distribution across forecast horizons
        </p>
      </div>

      <PrototypeDisclaimer />

      <LocationSelector showPanchayat={false} />

      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Severity Distribution */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-1">
                Panchayat Forecast Risk Level Distribution
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Proportion of Panchayat-day forecasts falling into each risk tier
              </p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={85}
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={RISK_COLORS[index % RISK_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Risk Category Breakdown */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-1">
                Forecasted Hazard Category Breakdown
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Frequency of specific meteorological triggers across Panchayats
              </p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={riskTypeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="type" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar
                      dataKey="count"
                      name="Forecast Occurrences"
                      fill="#0284c7"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 4 Meteorological Trend Charts */}
          <WeatherTrendCharts data={trends} />

          {/* High Risk Panchayat Watchlist */}
          {riskSummary?.highRiskLocations?.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-slate-200 bg-red-50 px-5 py-3.5">
                <h3 className="text-sm font-bold text-red-950">
                  High & Severe Risk Panchayat Forecast Watchlist
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-600">
                      <th className="py-2.5 px-4">Date</th>
                      <th className="py-2.5 px-4">Panchayat</th>
                      <th className="py-2.5 px-4">Block</th>
                      <th className="py-2.5 px-4">Rainfall</th>
                      <th className="py-2.5 px-4">Temp</th>
                      <th className="py-2.5 px-4">Severity</th>
                      <th className="py-2.5 px-4">Rule Trigger Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {riskSummary.highRiskLocations.slice(0, 12).map((item, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-medium">{item.date}</td>
                        <td className="py-2.5 px-4 font-bold text-slate-900">
                          {item.panchayatName}
                        </td>
                        <td className="py-2.5 px-4">{item.blockName}</td>
                        <td className="py-2.5 px-4 font-semibold text-blue-700">
                          {item.rainfall} mm
                        </td>
                        <td className="py-2.5 px-4">{item.temperature}°C</td>
                        <td className="py-2.5 px-4">
                          <RiskBadge level={item.risk.riskLevel} />
                        </td>
                        <td className="py-2.5 px-4 text-slate-600">
                          {item.risk.reason}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
