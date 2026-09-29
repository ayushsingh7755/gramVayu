import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CloudSun } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { locationService } from '../../services/locationService';
import { ErrorBanner } from '../../components/common/ErrorBanner';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [panchayats, setPanchayats] = useState([]);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    state: '',
    district: '',
    block: '',
    panchayat: '',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    locationService.getStates().then((list) => {
      setStates(list);
      if (list[0]) setForm((f) => ({ ...f, state: list[0]._id }));
    });
  }, []);

  useEffect(() => {
    if (!form.state) return;
    locationService.getDistricts(form.state).then((list) => {
      setDistricts(list);
      if (list[0]) setForm((f) => ({ ...f, district: list[0]._id }));
    });
  }, [form.state]);

  useEffect(() => {
    if (!form.district) return;
    locationService.getBlocks(form.district).then((list) => {
      setBlocks(list);
      if (list[0]) setForm((f) => ({ ...f, block: list[0]._id }));
    });
  }, [form.district]);

  useEffect(() => {
    if (!form.block) return;
    locationService.getPanchayatsByBlock(form.block).then((list) => {
      setPanchayats(list);
      if (list[0]) setForm((f) => ({ ...f, panchayat: list[0]._id }));
    });
  }, [form.block]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-emerald-950 flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-blue-600 text-white shadow">
            <CloudSun className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">
              Farmer Registration
            </h1>
            <p className="text-xs text-slate-500">
              Subscribe to Panchayat-level weather forecasts & crop advisories
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4">
            <ErrorBanner message={error} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Suresh Kumar"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 98100XXXXX"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="farmer.name@example.com"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password (min 6 chars) *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
              Select Your Home Panchayat Location
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  State
                </label>
                <select
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                >
                  {states.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  District
                </label>
                <select
                  value={form.district}
                  onChange={(e) =>
                    setForm({ ...form, district: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
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
                  value={form.block}
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
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Gram Panchayat
                </label>
                <select
                  value={form.panchayat}
                  onChange={(e) =>
                    setForm({ ...form, panchayat: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                >
                  {panchayats.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {submitting ? 'Creating Account...' : 'Register Farmer Account'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-4">
          <Link to="/" className="hover:text-slate-800">
            ← Back to Home
          </Link>
          <span>
            Already registered?{' '}
            <Link
              to="/login"
              className="font-semibold text-emerald-700 hover:underline"
            >
              Sign In
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};
