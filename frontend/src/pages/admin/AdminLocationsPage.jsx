import React, { useState } from 'react';
import { Layers, Plus, Trash2, MapPin } from 'lucide-react';
import { useLocationFilter } from '../../hooks/useLocationFilter';
import { locationService } from '../../services/locationService';
import { LocationSelector } from '../../components/common/LocationSelector';

export const AdminLocationsPage = () => {
  const {
    states,
    districts,
    blocks,
    panchayats,
    selectedState,
    selectedDistrict,
    selectedBlock,
    setSelectedBlock,
  } = useLocationFilter();

  const [panchayatForm, setPanchayatForm] = useState({
    name: '',
    latitude: 28.612,
    longitude: 76.955,
    elevation: 214,
    area: 13.5,
    population: 7500,
    vegetationFactor: 0.72,
  });

  const [blockForm, setBlockForm] = useState({
    name: '',
    centerLatitude: 28.61,
    centerLongitude: 76.98,
    elevation: 215,
  });

  const handleAddPanchayat = async (e) => {
    e.preventDefault();
    try {
      await locationService.createPanchayat({
        ...panchayatForm,
        state: selectedState,
        district: selectedDistrict,
        block: selectedBlock,
      });
      setPanchayatForm({
        name: '',
        latitude: 28.612,
        longitude: 76.955,
        elevation: 214,
        area: 13.5,
        population: 7500,
        vegetationFactor: 0.72,
      });
      // Trigger refresh by toggling block selection
      const currentB = selectedBlock;
      setSelectedBlock('');
      setTimeout(() => setSelectedBlock(currentB), 50);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create Panchayat.');
    }
  };

  const handleAddBlock = async (e) => {
    e.preventDefault();
    try {
      const created = await locationService.createBlock({
        ...blockForm,
        state: selectedState,
        district: selectedDistrict,
      });
      setBlockForm({
        name: '',
        centerLatitude: 28.61,
        centerLongitude: 76.98,
        elevation: 215,
      });
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create Block.');
    }
  };

  const handleDeletePanchayat = async (id) => {
    if (!window.confirm('Delete this Panchayat and its weather forecasts?'))
      return;
    try {
      await locationService.deletePanchayat(id);
      const currentB = selectedBlock;
      setSelectedBlock('');
      setTimeout(() => setSelectedBlock(currentB), 50);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete Panchayat.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          Geographic Hierarchy & Panchayat Spatial Metadata
        </h1>
        <p className="text-sm text-slate-600">
          Manage State → District → Block → Gram Panchayat records along with coordinates, elevation, and vegetation factors
        </p>
      </div>

      <LocationSelector showPanchayat={false} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Panchayat Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald-600" />
            Add Gram Panchayat to Selected Block
          </h3>
          <form
            onSubmit={handleAddPanchayat}
            className="grid grid-cols-2 gap-3"
          >
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Panchayat Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Mundela Khurd Panchayat"
                value={panchayatForm.name}
                onChange={(e) =>
                  setPanchayatForm({ ...panchayatForm, name: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Latitude *
              </label>
              <input
                type="number"
                step="0.0001"
                required
                value={panchayatForm.latitude}
                onChange={(e) =>
                  setPanchayatForm({
                    ...panchayatForm,
                    latitude: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Longitude *
              </label>
              <input
                type="number"
                step="0.0001"
                required
                value={panchayatForm.longitude}
                onChange={(e) =>
                  setPanchayatForm({
                    ...panchayatForm,
                    longitude: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Elevation (m)
              </label>
              <input
                type="number"
                value={panchayatForm.elevation}
                onChange={(e) =>
                  setPanchayatForm({
                    ...panchayatForm,
                    elevation: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Vegetation Factor (0–1)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={panchayatForm.vegetationFactor}
                onChange={(e) =>
                  setPanchayatForm({
                    ...panchayatForm,
                    vegetationFactor: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Area (sq. km)
              </label>
              <input
                type="number"
                step="0.1"
                value={panchayatForm.area}
                onChange={(e) =>
                  setPanchayatForm({
                    ...panchayatForm,
                    area: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Population
              </label>
              <input
                type="number"
                value={panchayatForm.population}
                onChange={(e) =>
                  setPanchayatForm({
                    ...panchayatForm,
                    population: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="col-span-2 pt-1">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2 text-sm font-bold text-white hover:bg-emerald-700"
              >
                <Plus className="h-4 w-4" />
                Add Gram Panchayat
              </button>
            </div>
          </form>
        </div>

        {/* Add Block Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Layers className="h-4 w-4 text-blue-600" />
            Add New Block to Selected District
          </h3>
          <form onSubmit={handleAddBlock} className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Block Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Mehrauli Block"
                value={blockForm.name}
                onChange={(e) =>
                  setBlockForm({ ...blockForm, name: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Center Latitude
              </label>
              <input
                type="number"
                step="0.0001"
                value={blockForm.centerLatitude}
                onChange={(e) =>
                  setBlockForm({
                    ...blockForm,
                    centerLatitude: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Center Longitude
              </label>
              <input
                type="number"
                step="0.0001"
                value={blockForm.centerLongitude}
                onChange={(e) =>
                  setBlockForm({
                    ...blockForm,
                    centerLongitude: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mean Elevation (m)
              </label>
              <input
                type="number"
                value={blockForm.elevation}
                onChange={(e) =>
                  setBlockForm({
                    ...blockForm,
                    elevation: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="col-span-2 pt-1">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2 text-sm font-bold text-white hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Create Block
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Panchayats in Selected Block Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-3.5">
          <h3 className="text-sm font-bold text-slate-900">
            Panchayats in Selected Block ({panchayats.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-600">
                <th className="py-3 px-4">Panchayat Name</th>
                <th className="py-3 px-4">Coordinates</th>
                <th className="py-3 px-4">Elevation</th>
                <th className="py-3 px-4">Vegetation Factor</th>
                <th className="py-3 px-4">Area</th>
                <th className="py-3 px-4">Population</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {panchayats.map((p) => (
                <tr key={p._id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {p.name}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {p.latitude}°N, {p.longitude}°E
                  </td>
                  <td className="py-3 px-4">{p.elevation}m</td>
                  <td className="py-3 px-4 font-semibold text-emerald-700">
                    {p.vegetationFactor}
                  </td>
                  <td className="py-3 px-4">{p.area} sq.km</td>
                  <td className="py-3 px-4">
                    {p.population?.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDeletePanchayat(p._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
