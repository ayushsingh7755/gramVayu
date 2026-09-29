import React, { useState, useEffect, useCallback } from 'react';
import { useLocationFilter } from '../../hooks/useLocationFilter';
import { locationService } from '../../services/locationService';
import { PrototypeDisclaimer } from '../../components/common/PrototypeDisclaimer';
import { LocationSelector } from '../../components/common/LocationSelector';
import { PanchayatWeatherMap } from '../../components/map/PanchayatWeatherMap';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { RiskBadge } from '../../components/common/RiskBadge';

export const MapPage = () => {
  const {
    selectedBlock,
    selectedPanchayat,
    setSelectedPanchayat,
    selectedDate,
  } = useLocationFilter();

  const [panchayats, setPanchayats] = useState([]);
  const [showAllBlocks, setShowAllBlocks] = useState(true);
  const [loading, setLoading] = useState(true);

  const loadMapData = useCallback(async () => {
    try {
      setLoading(true);
      const params = { date: selectedDate };
      if (!showAllBlocks && selectedBlock) {
        params.block = selectedBlock;
      }
      const list = await locationService.getAllPanchayats(params);
      setPanchayats(list);
    } catch (err) {
      console.error('Failed to load map panchayats:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedBlock, selectedDate, showAllBlocks]);

  useEffect(() => {
    loadMapData();
  }, [loadMapData]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            GIS Panchayat Weather & Risk Map
          </h1>
          <p className="text-sm text-slate-600">
            Spatial visualization of downscaled Panchayat forecasts, risk severity markers, and Block GeoJSON boundaries
          </p>
        </div>

        <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-3.5 py-2 rounded-xl cursor-pointer">
          <input
            type="checkbox"
            checked={showAllBlocks}
            onChange={(e) => setShowAllBlocks(e.target.checked)}
            className="rounded text-emerald-600"
          />
          Display All Blocks & Panchayats on Map
        </label>
      </div>

      <PrototypeDisclaimer />

      <LocationSelector showPanchayat={true} showDate={true} />

      {loading ? (
        <LoadingSkeleton rows={3} />
      ) : (
        <>
          <PanchayatWeatherMap
            panchayats={panchayats}
            selectedPanchayatId={selectedPanchayat}
            onSelectPanchayat={(id) => setSelectedPanchayat(id)}
            height="540px"
            showBlockBoundaries={true}
          />

          {/* Quick Spatial Summary Table */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-800">
                Panchayat Spatial Risk Matrix ({selectedDate})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-600 uppercase text-xs">
                    <th className="py-2.5 px-4">Panchayat</th>
                    <th className="py-2.5 px-4">Block</th>
                    <th className="py-2.5 px-4">Coordinates</th>
                    <th className="py-2.5 px-4">Temp</th>
                    <th className="py-2.5 px-4">Rainfall</th>
                    <th className="py-2.5 px-4">Humidity</th>
                    <th className="py-2.5 px-4">Wind</th>
                    <th className="py-2.5 px-4">Risk Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {panchayats.map((p) => {
                    const w = p.latestWeather || {};
                    return (
                      <tr key={p._id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-semibold text-slate-900">
                          {p.name}
                        </td>
                        <td className="py-2.5 px-4 text-slate-600">
                          {p.block?.name}
                        </td>
                        <td className="py-2.5 px-4 text-slate-500">
                          {p.latitude}°N, {p.longitude}°E
                        </td>
                        <td className="py-2.5 px-4 font-bold">
                          {w.temperature ?? '—'}°C
                        </td>
                        <td className="py-2.5 px-4 font-semibold text-blue-700">
                          {w.rainfall ?? '—'} mm
                        </td>
                        <td className="py-2.5 px-4">{w.humidity ?? '—'}%</td>
                        <td className="py-2.5 px-4">
                          {w.windSpeed ?? '—'} km/h
                        </td>
                        <td className="py-2.5 px-4">
                          <RiskBadge level={p.risk?.riskLevel || 'low'} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
