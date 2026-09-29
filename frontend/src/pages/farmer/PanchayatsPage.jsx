import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Search,
  Thermometer,
  CloudRain,
  Droplets,
  Wind,
  ArrowUpRight,
  Sprout,
} from 'lucide-react';
import { useLocationFilter } from '../../hooks/useLocationFilter';
import { locationService } from '../../services/locationService';
import { PrototypeDisclaimer } from '../../components/common/PrototypeDisclaimer';
import { LocationSelector } from '../../components/common/LocationSelector';
import { RiskBadge } from '../../components/common/RiskBadge';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';

export const PanchayatsPage = () => {
  const { selectedState, selectedDistrict, selectedBlock } = useLocationFilter();
  const [panchayats, setPanchayats] = useState([]);
  const [search, setSearch] = useState('');
  const [filterAllBlocks, setFilterAllBlocks] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadPanchayats = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (!filterAllBlocks) {
        if (selectedState) params.state = selectedState;
        if (selectedDistrict) params.district = selectedDistrict;
        if (selectedBlock) params.block = selectedBlock;
      }
      if (search.trim()) params.search = search.trim();

      const list = await locationService.getAllPanchayats(params);
      setPanchayats(list);
    } catch (err) {
      console.error('Failed to load panchayats:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedState, selectedDistrict, selectedBlock, search, filterAllBlocks]);

  useEffect(() => {
    loadPanchayats();
  }, [loadPanchayats]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Gram Panchayats Directory & Micro-Climate Status
          </h1>
          <p className="text-sm text-slate-600">
            Browse Panchayats, inspect coordinates, vegetation indices, and downscaled weather risks
          </p>
        </div>

        <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-3.5 py-2 rounded-xl cursor-pointer">
          <input
            type="checkbox"
            checked={filterAllBlocks}
            onChange={(e) => setFilterAllBlocks(e.target.checked)}
            className="rounded text-emerald-600"
          />
          Show All Panchayats Across All Blocks
        </label>
      </div>

      <PrototypeDisclaimer />

      {!filterAllBlocks && <LocationSelector showPanchayat={false} />}

      {/* Search Bar */}
      <div className="relative">
        <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Gram Panchayat by name..."
          className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm focus:border-emerald-600 focus:outline-none"
        />
      </div>

      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : panchayats.length === 0 ? (
        <EmptyState
          title="No Matching Gram Panchayats"
          description="Try clearing your search filter or enabling 'Show All Panchayats Across All Blocks'."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {panchayats.map((p) => {
            const w = p.latestWeather;
            return (
              <div
                key={p._id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {p.name}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                        Block: {p.block?.name} • {p.district?.name}
                      </p>
                    </div>
                    <RiskBadge level={p.risk?.riskLevel || 'low'} />
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-600">
                    <span className="rounded bg-slate-100 px-2 py-0.5">
                      Coords: {p.latitude}°N, {p.longitude}°E
                    </span>
                    <span className="rounded bg-slate-100 px-2 py-0.5">
                      Elev: {p.elevation || 215}m
                    </span>
                    <span className="rounded bg-emerald-50 text-emerald-800 px-2 py-0.5 font-medium">
                      Veg Factor: {p.vegetationFactor ?? 0.65}
                    </span>
                  </div>

                  {w ? (
                    <div className="mt-4 grid grid-cols-2 gap-2.5 rounded-xl bg-slate-50 p-3 border border-slate-200/80 text-xs">
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-amber-500" />
                        <div>
                          <span className="text-slate-500 block">Temp</span>
                          <span className="font-bold text-slate-900">
                            {w.temperature}°C
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CloudRain className="h-4 w-4 text-blue-600" />
                        <div>
                          <span className="text-slate-500 block">Rainfall</span>
                          <span className="font-bold text-blue-700">
                            {w.rainfall} mm
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-cyan-600" />
                        <div>
                          <span className="text-slate-500 block">Humidity</span>
                          <span className="font-semibold text-slate-800">
                            {w.humidity}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wind className="h-4 w-4 text-purple-600" />
                        <div>
                          <span className="text-slate-500 block">Wind</span>
                          <span className="font-semibold text-slate-800">
                            {w.windSpeed} km/h
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-4 text-xs text-slate-400 italic">
                      No forecast generated yet
                    </p>
                  )}

                  {p.primaryCrops?.length > 0 && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600">
                      <Sprout className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">
                        Crops: {p.primaryCrops.join(', ')}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-amber-700 font-medium">
                    Simulated Downscaled
                  </span>
                  <Link
                    to={`/panchayats/${p._id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    View 7-Day Forecast
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
