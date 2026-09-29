import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export const ErrorBanner = ({ message, onRetry }) => {
  if (!message) return null;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      <div className="flex items-center gap-2.5">
        <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
        <span>{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-red-700 border border-red-200 hover:bg-red-100 transition"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Retry
        </button>
      )}
    </div>
  );
};
