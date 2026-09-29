import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CloudSun,
  MapPin,
  Map,
  Sprout,
  AlertTriangle,
  GitCompare,
  BarChart3,
  User,
  Users,
  Database,
  Layers,
  X,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const role = user?.role || 'farmer';

  const getDashboardPath = () => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'officer') return '/officer/dashboard';
    return '/dashboard';
  };

  const primaryLinks = [
    {
      label: 'Dashboard',
      to: getDashboardPath(),
      icon: LayoutDashboard,
    },
    {
      label: 'Weather Forecasts',
      to: role === 'officer' ? '/officer/weather' : '/weather',
      icon: CloudSun,
    },
    {
      label: 'Panchayats',
      to: role === 'officer' ? '/officer/panchayats' : '/panchayats',
      icon: MapPin,
    },
    {
      label: 'Weather Risk Map',
      to: '/map',
      icon: Map,
    },
    {
      label: 'Agro Advisories',
      to: role === 'officer' ? '/officer/advisories' : '/advisories',
      icon: Sprout,
    },
    {
      label: 'Weather Alerts',
      to: role === 'officer' ? '/officer/alerts' : '/alerts',
      icon: AlertTriangle,
    },
    {
      label: 'Block vs Panchayat',
      to: role === 'officer' ? '/officer/compare' : '/compare',
      icon: GitCompare,
    },
    {
      label: 'Weather Analytics',
      to: role === 'admin' ? '/admin/analytics' : '/analytics',
      icon: BarChart3,
    },
    {
      label: 'My Profile',
      to: '/profile',
      icon: User,
    },
  ];

  const adminLinks = [
    {
      label: 'User Management',
      to: '/admin/users',
      icon: Users,
    },
    {
      label: 'Location Hierarchy',
      to: '/admin/locations',
      icon: Layers,
    },
    {
      label: 'Weather & Downscaler',
      to: '/admin/weather',
      icon: Database,
    },
    {
      label: 'Manage Advisories',
      to: '/admin/advisories',
      icon: Sprout,
    },
    {
      label: 'Manage Alerts',
      to: '/admin/alerts',
      icon: AlertTriangle,
    },
  ];

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
      isActive
        ? 'bg-emerald-600 text-white shadow-sm'
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/60 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800 transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 text-white font-bold shadow">
              <CloudSun className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white block leading-none">
                GramVayu
              </span>
              <span className="text-[11px] text-emerald-400 font-medium">
                Panchayat Weather & Agro-Met
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <div>
            <p className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Agro-Met Portal
            </p>
            <nav className="space-y-1">
              {primaryLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={navItemClass}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {role === 'admin' && (
            <div>
              <p className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-amber-400">
                System Administration
              </p>
              <nav className="space-y-1">
                {adminLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={onClose}
                      className={navItemClass}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          )}
        </div>

        {/* Architecture Status Footer */}
        <div className="border-t border-slate-800 p-4 bg-slate-950/50">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Downscaling Engine</span>
            <span className="rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 text-[10px] font-semibold">
              Prototype v1.0
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            FastAPI AI/ML adapter ready for plug-in integration.
          </p>
        </div>
      </aside>
    </>
  );
};
