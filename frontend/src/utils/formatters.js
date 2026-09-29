export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatShortDate = (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
};

export const formatDelta = (val, unit = '') => {
  const num = Number(val || 0);
  if (num > 0) return `+${num}${unit}`;
  return `${num}${unit}`;
};

export const getRiskMarkerColor = (riskLevel = 'low') => {
  switch (riskLevel) {
    case 'severe':
      return '#dc2626'; // Red
    case 'high':
      return '#ea580c'; // Orange
    case 'moderate':
      return '#eab308'; // Yellow
    case 'low':
    default:
      return '#16a34a'; // Green
  }
};
