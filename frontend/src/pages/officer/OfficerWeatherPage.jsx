import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Cpu, Trash2, CheckCircle2 } from 'lucide-react';
import { useLocationFilter } from '../../hooks/useLocationFilter';
import { weatherService } from '../../services/weatherService';
import { WEATHER_CONDITIONS } from '../../utils/constants';
import { PrototypeDisclaimer } from '../../components/common/PrototypeDisclaimer';
import { LocationSelector } from '../../components/common/LocationSelector';
import { RiskBadge } from '../../components/common/RiskBadge';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../hooks/useAuth';

export const OfficerWeatherPage = () => {
  const { user } = useAuth();
  const {
    selectedState,
    selectedDistrict,
    selectedBlock,
    selectedDate,
    currentBlockObj,
  } = useLocationFilter();

  const [blockForecasts, setBlockForecasts] = useState([]);
  const [panchayatForecasts, setPanchayatForecasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [bannerMsg, setBannerMsg] = useState('');

  const [form, setForm] = useState({
    date: '2026-10-01',
    temperature: 32,
    minTemperature: 25.5,
    maxTemperature: 35.5,
    rainfall: 20,
    humidity: 72,
    windSpeed: 14,
    windDirection: 'SE',
    pressure: 1005,
    cloudCover: 65,
    weatherCondition: 'Moderate Rain',
    probabilityOfRain: 75,
  });

  const loadWeatherRecords = useCallback(async () => {
    if (!selectedBlock) return;
    try {
      setLoading(true);
      const [bList, pList] = await Promise.all([
        weatherService.getBlockWeather(selectedBlock),
        weatherService.getWeatherList({
          locationType: 'panchayat',
          block: selectedBlock,
          date: selectedDate,
        }),
      ]);
      setBlockForecasts(bList);
      setPanchayatForecasts(pList);
    } catch (err) {
      console.error('Failed to load weather records:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedBlock, selectedDate]);

  useEffect(() => {
    loadWeatherRecords();
  }, [loadWeatherRecords]);

  const handleSaveBlockWeather = async (e) => {
    e.preventDefault();
    if (!selectedBlock) return;
    try {
      await weatherService.createWeather({
        ...form,
        locationType: 'block',
        state: selectedState,
        district: selectedDistrict,
        block: selectedBlock,
        forecastType: 'forecast',
        source: 'IMD Block Bulletin',
      });
      setBannerMsg(
        `Saved Block-level weather for ${currentBlockObj?.name} on ${form.date}. Click "Generate Panchayat Forecast" to downscale.`
      );
      await loadWeatherRecords();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save Block weather.');
    }
  };

  const handleGenerateDownscaled = async (targetDate) => {
    if (!selectedBlock) return;
    try {
      setGenerating(true);
      const res = await weatherService.generateDownscaledForecast({
        blockId: selectedBlock,
        date: targetDate || selectedDate,
      });
      setBannerMsg(
        `Generated ${res.panchayatForecasts?.length} simulated Panchayat forecasts for ${currentBlockObj?.name} (${targetDate || selectedDate}).`
      );
      await loadWeatherRecords();
    } catch (err) {
      alert(err.response?.data?.message || 'Downscaling failed.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this weather forecast record?')) return;
    await weatherService.deleteWeather(id);
    await loadWeatherRecords();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          Block Weather Data & Panchayat Downscaling Studio
        </h1>
        <p className="text-sm text-slate-600">
          Enter or update Block-level weather observations/forecasts and execute deterministic Panchayat-level downscaling
        </p>
      </div>

      <PrototypeDisclaimer />

      <LocationSelector showPanchayat={false} showDate={true} />

      {bannerMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{bannerMsg}</span>
        </div>
      )}

      {/* Enter Block-Level Weather Form (Section 8) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Enter / Update Block-Level Weather Bulletin ({currentBlockObj?.name || 'Block'})
            </h2>
            <p className="text-xs text-slate-500">
              Low-resolution Block input variables used as baseline for Panchayat spatial downscaling
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleGenerateDownscaled(selectedDate)}
            disabled={generating}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs sm:text-sm font-bold text-white hover:bg-blue-700 transition shadow-sm"
          >
            <Cpu className="h-4 w-4" />
            {generating
              ? 'Generating...'
              : `Generate Panchayat Forecasts (${selectedDate})`}
          </button>
        </div>

        <form
          onSubmit={handleSaveBlockWeather}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Forecast Date
            </label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Temperature (°C)
            </label>
            <input
              type="number"
              step="0.1"
              required
              value={form.temperature}
              onChange={(e) =>
                setForm({ ...form, temperature: Number(e.target.value) })
              }
              className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Rainfall (mm)
            </label>
            <input
              type="number"
              step="0.1"
              required
              value={form.rainfall}
              onChange={(e) =>
                setForm({ ...form, rainfall: Number(e.target.value) })
              }
              className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Humidity (%)
            </label>
            <input
              type="number"
              required
              value={form.humidity}
              onChange={(e) =>
                setForm({ ...form, humidity: Number(e.target.value) })
              }
              className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Wind Speed (km/h)
            </label>
            <input
              type="number"
              step="0.1"
              required
              value={form.windSpeed}
              onChange={(e) =>
                setForm({ ...form, windSpeed: Number(e.target.value) })
              }
              className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pressure (hPa)
            </label>
            <input
              type="number"
              required
              value={form.pressure}
              onChange={(e) =>
                setForm({ ...form, pressure: Number(e.target.value) })
              }
              className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Cloud Cover (%)
            </label>
            <input
              type="number"
              required
              value={form.cloudCover}
              onChange={(e) =>
                setForm({ ...form, cloudCover: Number(e.target.value) })
              }
              className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Rain Probability (%)
            </label>
            <input
              type="number"
              required
              value={form.probabilityOfRain}
              onChange={(e) =>
                setForm({ ...form, probabilityOfRain: Number(e.target.value) })
              }
              className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Weather Condition
            </label>
            <select
              value={form.weatherCondition}
              onChange={(e) =>
                setForm({ ...form, weatherCondition: e.target.value })
              }
              className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm"
            >
              {WEATHER_CONDITIONS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2 px-4 text-sm font-bold text-white hover:bg-emerald-700 transition"
            >
              <Plus className="h-4 w-4" />
              Save Block Weather Bulletin
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : (
        <>
          {/* Simulated Panchayat Outputs for Selected Date */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 bg-emerald-50/70 px-5 py-3.5 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Simulated Downscaled Panchayat Forecasts in{' '}
                  {currentBlockObj?.name} ({selectedDate})
                </h3>
                <p className="text-xs text-slate-600">
                  Deterministic outputs generated from Block weather + Panchayat elevation, coordinates & vegetation
                </p>
              </div>
              <span className="text-xs font-semibold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md">
                Prototype Simulated Downscaling
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-600">
                    <th className="py-2.5 px-4">Panchayat</th>
                    <th className="py-2.5 px-4">Date</th>
                    <th className="py-2.5 px-4">Temp</th>
                    <th className="py-2.5 px-4">Rainfall</th>
                    <th className="py-2.5 px-4">Humidity</th>
                    <th className="py-2.5 px-4">Wind</th>
                    <th className="py-2.5 px-4">Veg Factor</th>
                    <th className="py-2.5 px-4">Risk Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {panchayatForecasts.map((pf) => (
                    <tr key={pf._id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 font-bold text-slate-900">
                        {pf.panchayat?.name}
                      </td>
                      <td className="py-2.5 px-4">{pf.date}</td>
                      <td className="py-2.5 px-4 font-bold">
                        {pf.temperature}°C
                      </td>
                      <td className="py-2.5 px-4 font-bold text-blue-700">
                        {pf.rainfall} mm
                      </td>
                      <td className="py-2.5 px-4">{pf.humidity}%</td>
                      <td className="py-2.5 px-4">{pf.windSpeed} km/h</td>
                      <td className="py-2.5 px-4">
                        {pf.panchayat?.vegetationFactor ?? 0.65}
                      </td>
                      <td className="py-2.5 px-4">
                        <RiskBadge level={pf.risk?.riskLevel} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Block Weather Schedule Table */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-3.5">
              <h3 className="text-sm font-bold text-slate-900">
                Block-Level Forecast Schedule ({currentBlockObj?.name})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-600">
                    <th className="py-2.5 px-4">Date</th>
                    <th className="py-2.5 px-4">Condition</th>
                    <th className="py-2.5 px-4">Temp</th>
                    <th className="py-2.5 px-4">Rainfall</th>
                    <th className="py-2.5 px-4">Humidity</th>
                    <th className="py-2.5 px-4">Wind</th>
                    <th className="py-2.5 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {blockForecasts.map((bf) => (
                    <tr key={bf._id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 font-semibold">{bf.date}</td>
                      <td className="py-2.5 px-4">{bf.weatherCondition}</td>
                      <td className="py-2.5 px-4 font-bold">
                        {bf.temperature}°C
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-blue-700">
                        {bf.rainfall} mm
                      </td>
                      <td className="py-2.5 px-4">{bf.humidity}%</td>
                      <td className="py-2.5 px-4">{bf.windSpeed} km/h</td>
                      <td className="py-2.5 px-4 flex items-center gap-3">
                        <button
                          onClick={() => handleGenerateDownscaled(bf.date)}
                          className="text-xs font-bold text-emerald-700 hover:underline"
                        >
                          Downscale to Panchayats
                        </button>
                        {user?.role === 'admin' && (
                          <button
                            onClick={() => handleDelete(bf._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
