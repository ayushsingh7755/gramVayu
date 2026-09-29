import React from 'react';

export const LoadingSkeleton = ({ rows = 3, type = 'cards' }) => {
  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {Array.from({ length: rows }).map((_, idx) => (
          <div
            key={idx}
            className="h-28 rounded-xl bg-slate-200/70 border border-slate-200 p-4 flex flex-col justify-between"
          >
            <div className="h-4 w-28 bg-slate-300 rounded" />
            <div className="h-7 w-20 bg-slate-300 rounded" />
            <div className="h-3 w-36 bg-slate-300 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, idx) => (
        <div
          key={idx}
          className="h-16 rounded-xl bg-slate-200/70 border border-slate-200"
        />
      ))}
    </div>
  );
};
