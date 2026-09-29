import React, { useState, useEffect, useCallback } from 'react';
import {
  AlertTriangle,
  Plus,
  MapPin,
  Clock,
  Trash2,
  X,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLocationFilter } from '../../hooks/useLocationFilter';
import { alertService } from '../../services/alertService';
import { ALERT_TYPES, SEVERITY_LEVELS } from '../../utils/constants';
import { RiskBadge } from '../../components/common/RiskBadge';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorBanner } from '../../components/common/ErrorBanner';
import { formatDate } from '../../utils/formatters';

export const AlertsPage = () => {
  const { user } = useAuth();
  const {
    selectedState,
    selectedDistrict,
    selectedBlock,
    selectedPanchayat,
    blocks,
    panchayats,
  } = useLocationFilter();

  const canManage = user?.role === 'admin' || user?.role === 'officer';

  const [alerts, setAlerts] = useState([]);
  const [severityFilter, setSeverityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    severity: 'high',
    type: 'heavy_rain',
    block: '',
    panchayat: '',
    startTime: '2026-10-01',
    endTime: '2026-10-03',
  });

  const loadAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const list = await alertService.getAlerts({
        severity: severityFilter,
        type: typeFilter,
      });
      setAlerts(list);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load weather alerts.'
      );
    } finally {
      setLoading(false);
    }
  }, [severityFilter, typeFilter]);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    try {
      await alertService.createAlert({
        ...form,
        state: selectedState,
        district: selectedDistrict,
        block: form.block || selectedBlock,
        panchayat: form.panchayat || null,
        isActive: true,
      });
      setModalOpen(false);
      setForm({
        title: '',
        description: '',
        severity: 'high',
        type: 'heavy_rain',
        block: '',
        panchayat: '',
        startTime: '2026-10-01',
        endTime: '2026-10-03',
      });
      await loadAlerts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to issue weather alert.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this weather alert?')) return;
    await alertService.deleteAlert(id);
    await loadAlerts();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Weather Early Warning & Risk Alerts
          </h1>
          <p className="text-sm text-slate-600">
            Active Panchayat and Block-level extreme weather warnings for heavy rain, thunderstorm, heatwave, and strong wind
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700 transition shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Issue Weather Alert
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm"
        >
          <option value="all">All Severities</option>
          {SEVERITY_LEVELS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm"
        >
          <option value="all">All Alert Types</option>
          {ALERT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {error && <ErrorBanner message={error} onRetry={loadAlerts} />}

      {loading ? (
        <LoadingSkeleton rows={3} />
      ) : alerts.length === 0 ? (
        <EmptyState
          icon={AlertTriangle}
          title="No Weather Alerts Found"
          description="There are currently no weather alerts matching your filter criteria."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((alert) => (
            <div
              key={alert._id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="rounded-md bg-red-50 border border-red-200 px-2.5 py-0.5 text-xs font-bold uppercase text-red-800">
                    {alert.type?.replace('_', ' ')}
                  </span>
                  <RiskBadge level={alert.severity} />
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  {alert.title}
                </h3>
                <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                  {alert.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                    {alert.panchayat?.name
                      ? `${alert.panchayat.name} (${alert.block?.name})`
                      : `${alert.block?.name || 'Block-wide'}`}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-blue-600" />
                    Valid: {formatDate(alert.startTime)} –{' '}
                    {formatDate(alert.endTime)}
                  </span>
                </div>

                {canManage && (
                  <button
                    onClick={() => handleDelete(alert._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete Alert"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Alert Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
              <h3 className="text-base font-bold text-slate-900">
                Issue Weather Warning Alert
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1 text-slate-500 hover:bg-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAlert} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alert Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Heavy Rain Warning (>55 mm)"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alert Type
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  >
                    {ALERT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Severity
                  </label>
                  <select
                    value={form.severity}
                    onChange={(e) =>
                      setForm({ ...form, severity: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  >
                    {SEVERITY_LEVELS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Block
                  </label>
                  <select
                    value={form.block || selectedBlock}
                    onChange={(e) =>
                      setForm({ ...form, block: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  >
                    {blocks.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Panchayat (Optional)
                  </label>
                  <select
                    value={form.panchayat}
                    onChange={(e) =>
                      setForm({ ...form, panchayat: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  >
                    <option value="">All Panchayats in Block</option>
                    {panchayats.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description & Precautionary Action *
                </label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
                >
                  Publish Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
