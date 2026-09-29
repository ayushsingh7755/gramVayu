import React from 'react';
import { MapPin, Calendar } from 'lucide-react';
import { useLocationFilter } from '../../hooks/useLocationFilter';

export const LocationSelector = ({
  showPanchayat = true,
  showDate = false,
  availableDates = [
    '2026-10-01',
    '2026-10-02',
    '2026-10-03',
    '2026-10-04',
    '2026-10-05',
    '2026-10-06',
    '2026-10-07',
  ],
}) => {
  const {
    states,
    districts,
    blocks,
    panchayats,
    selectedState,
    setSelectedState,
    selectedDistrict,
    setSelectedDistrict,
    selectedBlock,
    setSelectedBlock,
    selectedPanchayat,
    setSelectedPanchayat,
    selectedDate,
    setSelectedDate,
  } = useLocationFilter();

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
        <MapPin className="h-4 w-4 text-emerald-600" />
        <span>Geographic Hierarchy Selector (State → District → Block → Panchayat)</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            State
          </label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-emerald-600 focus:bg-white focus:outline-none"
          >
            {states.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            District
          </label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-emerald-600 focus:bg-white focus:outline-none"
          >
            {districts.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Block
          </label>
          <select
            value={selectedBlock}
            onChange={(e) => setSelectedBlock(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-emerald-600 focus:bg-white focus:outline-none"
          >
            {blocks.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {showPanchayat && (
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Gram Panchayat
            </label>
            <select
              value={selectedPanchayat}
              onChange={(e) => setSelectedPanchayat(e.target.value)}
              className="w-full rounded-lg border border-emerald-300 bg-emerald-50/40 px-3 py-2 text-sm font-medium text-slate-900 focus:border-emerald-600 focus:bg-white focus:outline-none"
            >
              {panchayats.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {showDate && (
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-blue-600" />
                Forecast Date
              </span>
            </label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-lg border border-blue-300 bg-blue-50/40 px-3 py-2 text-sm font-medium text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none"
            >
              {availableDates.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
