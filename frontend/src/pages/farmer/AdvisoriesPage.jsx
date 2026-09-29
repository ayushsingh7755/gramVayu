import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Sprout, Filter } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLocationFilter } from '../../hooks/useLocationFilter';
import { advisoryService } from '../../services/advisoryService';
import {
  ADVISORY_CATEGORIES,
  WEATHER_CONDITIONS,
  COMMON_CROPS,
} from '../../utils/constants';
import { LocationSelector } from '../../components/common/LocationSelector';
import { AdvisoryCard } from '../../components/advisory/AdvisoryCard';
import { AdvisoryModal } from '../../components/advisory/AdvisoryModal';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorBanner } from '../../components/common/ErrorBanner';

export const AdvisoriesPage = () => {
  const { user } = useAuth();
  const { selectedBlock, selectedPanchayat } = useLocationFilter();
  const canManage = user?.role === 'admin' || user?.role === 'officer';

  const [advisories, setAdvisories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [crop, setCrop] = useState('all');
  const [weatherCondition, setWeatherCondition] = useState('all');
  const [filterByLocation, setFilterByLocation] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAdvisories = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = {
        category,
        crop,
        weatherCondition,
      };
      if (search.trim()) params.search = search.trim();
      if (filterByLocation) {
        if (selectedBlock) params.block = selectedBlock;
        if (selectedPanchayat) params.panchayat = selectedPanchayat;
      }

      const list = await advisoryService.getAdvisories(params);
      setAdvisories(list);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load agro-advisories.'
      );
    } finally {
      setLoading(false);
    }
  }, [
    category,
    crop,
    weatherCondition,
    search,
    filterByLocation,
    selectedBlock,
    selectedPanchayat,
  ]);

  useEffect(() => {
    loadAdvisories();
  }, [loadAdvisories]);

  const handleCreateAdvisory = async (formData) => {
    try {
      setSubmitting(true);
      await advisoryService.createAdvisory(formData);
      setModalOpen(false);
      await loadAdvisories();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create advisory.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAdvisory = async (id) => {
    if (!window.confirm('Delete this agro-meteorological advisory?')) return;
    try {
      await advisoryService.deleteAdvisory(id);
      await loadAdvisories();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete advisory.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Agro-Meteorological Advisory System
          </h1>
          <p className="text-sm text-slate-600">
            Actionable crop, irrigation, harvesting, and pest management guidance tailored to Panchayat weather
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 transition shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Create New Advisory
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
            <Filter className="h-4 w-4 text-emerald-600" />
            <span>Search & Filter Advisories</span>
          </div>

          <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={filterByLocation}
              onChange={(e) => setFilterByLocation(e.target.checked)}
              className="rounded text-emerald-600"
            />
            Filter by Selected Block/Panchayat Only
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, crop, recommendation..."
              className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm"
          >
            <option value="all">All Categories</option>
            {ADVISORY_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <select
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm"
          >
            <option value="all">All Crops</option>
            {COMMON_CROPS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={weatherCondition}
            onChange={(e) => setWeatherCondition(e.target.value)}
            className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm"
          >
            <option value="all">All Weather Conditions</option>
            {WEATHER_CONDITIONS.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filterByLocation && <LocationSelector showPanchayat={true} />}

      {error && <ErrorBanner message={error} onRetry={loadAdvisories} />}

      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : advisories.length === 0 ? (
        <EmptyState
          icon={Sprout}
          title="No Agro-Meteorological Advisories Match Your Filters"
          description="Try resetting the crop, category, or weather condition filters above."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {advisories.map((adv) => (
            <AdvisoryCard
              key={adv._id}
              advisory={adv}
              canManage={canManage}
              onDelete={handleDeleteAdvisory}
            />
          ))}
        </div>
      )}

      <AdvisoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateAdvisory}
        submitting={submitting}
      />
    </div>
  );
};
