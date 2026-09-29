import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import {
  ADVISORY_CATEGORIES,
  WEATHER_CONDITIONS,
  SEVERITY_LEVELS,
  COMMON_CROPS,
} from '../../utils/constants';
import { useLocationFilter } from '../../hooks/useLocationFilter';

export const AdvisoryModal = ({ isOpen, onClose, onSubmit, submitting }) => {
  const {
    states,
    districts,
    blocks,
    panchayats,
    selectedState,
    selectedDistrict,
    selectedBlock,
    selectedPanchayat,
  } = useLocationFilter();

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'irrigation',
    crop: 'Paddy',
    weatherCondition: 'Heavy Rain',
    severity: 'high',
    state: selectedState,
    district: selectedDistrict,
    block: selectedBlock,
    panchayat: selectedPanchayat,
    recommendationsText:
      'Avoid irrigation for the next 48 hours.\nEnsure field drainage channels are clear.\nDelay fertilizer top-dressing until skies clear.',
  });
  const [file, setFile] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('category', form.category);
    formData.append('crop', form.crop);
    formData.append('weatherCondition', form.weatherCondition);
    formData.append('severity', form.severity);
    formData.append('state', form.state || selectedState);
    formData.append('district', form.district || selectedDistrict);
    formData.append('block', form.block || selectedBlock);
    if (form.panchayat) {
      formData.append('panchayat', form.panchayat);
    }

    const recs = form.recommendationsText
      .split('\n')
      .map((r) => r.trim())
      .filter(Boolean);
    formData.append('recommendations', JSON.stringify(recs));

    if (file) {
      formData.append('attachment', file);
    }

    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Publish Agro-Meteorological Advisory
            </h3>
            <p className="text-xs text-slate-500">
              Issue location-specific crop recommendations based on downscaled Panchayat weather
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Advisory Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Heavy Rain Expected: Suspend Irrigation in Standing Paddy"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category *
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                {ADVISORY_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Crop *
              </label>
              <input
                type="text"
                list="crop-options"
                required
                value={form.crop}
                onChange={(e) => setForm({ ...form, crop: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <datalist id="crop-options">
                {COMMON_CROPS.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Trigger Weather Condition *
              </label>
              <select
                value={form.weatherCondition}
                onChange={(e) =>
                  setForm({ ...form, weatherCondition: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                {WEATHER_CONDITIONS.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Risk / Urgency Severity *
              </label>
              <select
                value={form.severity}
                onChange={(e) => setForm({ ...form, severity: e.target.value })}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Block
              </label>
              <select
                value={form.block || selectedBlock}
                onChange={(e) => setForm({ ...form, block: e.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
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
                Target Panchayat (Optional - leave blank for entire Block)
              </label>
              <select
                value={form.panchayat}
                onChange={(e) =>
                  setForm({ ...form, panchayat: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
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
              Detailed Agro-Meteorological Summary *
            </label>
            <textarea
              rows={3}
              required
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Describe expected rainfall/temperature impact on crop growth stage..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Actionable Recommendations (One per line) *
            </label>
            <textarea
              rows={4}
              required
              value={form.recommendationsText}
              onChange={(e) =>
                setForm({ ...form, recommendationsText: e.target.value })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Attach Advisory Document / Field Image (Cloudinary Upload)
            </label>
            <label className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-xs text-slate-600 cursor-pointer hover:bg-slate-100">
              <Upload className="h-4 w-4 text-emerald-600" />
              <span>
                {file
                  ? `Selected: ${file.name}`
                  : 'Upload JPG, PNG, or PDF bulletin (Max 5 MB)'}
              </span>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {submitting ? 'Publishing...' : 'Publish Advisory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
