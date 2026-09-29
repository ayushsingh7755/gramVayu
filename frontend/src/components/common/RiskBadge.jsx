import React from 'react';

const stylesByLevel = {
  low: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  moderate: 'bg-amber-50 text-amber-800 border-amber-200',
  high: 'bg-orange-50 text-orange-800 border-orange-200',
  severe: 'bg-red-50 text-red-800 border-red-200',
};

const dotByLevel = {
  low: 'bg-emerald-500',
  moderate: 'bg-amber-500',
  high: 'bg-orange-500',
  severe: 'bg-red-600',
};

const labelByLevel = {
  low: 'Normal',
  moderate: 'Moderate Risk',
  high: 'High Risk',
  severe: 'Severe Risk',
};

export const RiskBadge = ({ level = 'low', customLabel = null }) => {
  const normalized = (level || 'low').toLowerCase();
  const badgeClass = stylesByLevel[normalized] || stylesByLevel.low;
  const dotClass = dotByLevel[normalized] || dotByLevel.low;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badgeClass}`}
    >
      <span className={`h-2 w-2 rounded-full ${dotClass}`} />
      {customLabel || labelByLevel[normalized] || normalized}
    </span>
  );
};
