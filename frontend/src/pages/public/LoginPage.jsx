import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CloudSun, Lock, Mail, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ErrorBanner } from '../../components/common/ErrorBanner';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('farmer@example.com');
  const [password, setPassword] = useState('Password@123');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e, customEmail, customPass) => {
    if (e) e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const targetEmail = customEmail || email;
      const targetPass = customPass || password;
      const loggedUser = await login(targetEmail, targetPass);
      if (loggedUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (loggedUser.role === 'officer') {
        navigate('/officer/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Login failed. Please verify your credentials.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const quickDemoLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Password@123');
    handleLogin(null, demoEmail, 'Password@123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-emerald-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-blue-600 text-white shadow">
            <CloudSun className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">
              Sign in to GramVayu
            </h1>
            <p className="text-xs text-slate-500">
              Panchayat Weather Downscaling & Agro-Advisory Portal
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4">
            <ErrorBanner message={error} />
          </div>
        )}

        {/* Quick 1-Click Role Demo Logins */}
        <div className="mb-6 rounded-xl bg-slate-50 border border-slate-200 p-3.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2.5">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <span>Instant 1-Click Demo Credentials (Password: Password@123)</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => quickDemoLogin('farmer@example.com')}
              className="rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition text-center"
            >
              Farmer Demo
            </button>
            <button
              type="button"
              onClick={() => quickDemoLogin('officer@example.com')}
              className="rounded-lg border border-blue-300 bg-blue-50 px-2.5 py-2 text-xs font-semibold text-blue-800 hover:bg-blue-100 transition text-center"
            >
              Officer Demo
            </button>
            <button
              type="button"
              onClick={() => quickDemoLogin('admin@example.com')}
              className="rounded-lg border border-purple-300 bg-purple-50 px-2.5 py-2 text-xs font-semibold text-purple-800 hover:bg-purple-100 transition text-center"
            >
              Admin Demo
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2.5 text-sm focus:border-emerald-600 focus:outline-none"
                placeholder="farmer@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2.5 text-sm focus:border-emerald-600 focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 transition disabled:opacity-50 shadow-sm"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-4">
          <Link to="/" className="hover:text-slate-800">
            ← Back to Home
          </Link>
          <span>
            New Farmer?{' '}
            <Link
              to="/register"
              className="font-semibold text-emerald-700 hover:underline"
            >
              Create Account
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};
