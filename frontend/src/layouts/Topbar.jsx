import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, LogOut, MapPin, ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLocationFilter } from '../hooks/useLocationFilter';

export const Topbar = ({ onOpenSidebar }) => {
  const { user, logout } = useAuth();
  const { currentPanchayatObj, currentBlockObj } = useLocationFilter();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const roleBadgeColor =
    user?.role === 'admin'
      ? 'bg-purple-100 text-purple-800 border-purple-200'
      : user?.role === 'officer'
      ? 'bg-blue-100 text-blue-800 border-blue-200'
      : 'bg-emerald-100 text-emerald-800 border-emerald-200';

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-6 backdrop-blur">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
          <MapPin className="h-3.5 w-3.5 text-emerald-600" />
          <span>Active Focus:</span>
          <strong className="text-slate-900">
            {currentPanchayatObj?.name || 'All Panchayats'}
          </strong>
          {currentBlockObj && (
            <span className="text-slate-500">
              ({currentBlockObj.name} Block)
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <div className="flex items-center gap-2.5">
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-slate-800 leading-tight">
                {user.name}
              </p>
              <p className="text-[11px] text-slate-500">{user.email}</p>
            </div>

            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${roleBadgeColor}`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              {user.role}
            </span>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition"
              title="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
