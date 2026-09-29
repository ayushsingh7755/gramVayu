export const ADVISORY_CATEGORIES = [
  { value: 'irrigation', label: 'Irrigation Management' },
  { value: 'sowing', label: 'Sowing & Seed Treatment' },
  { value: 'harvesting', label: 'Harvesting & Post-Harvest' },
  { value: 'pest_management', label: 'Pest & Disease Control' },
  { value: 'fertilizer', label: 'Fertilizer & Soil Nutrition' },
  { value: 'crop_protection', label: 'Crop Protection' },
  { value: 'weather_alert', label: 'Weather Contingency' },
  { value: 'general', label: 'General Agro-Advisory' },
];

export const WEATHER_CONDITIONS = [
  'Clear',
  'Partly Cloudy',
  'Cloudy',
  'Light Rain',
  'Moderate Rain',
  'Heavy Rain',
  'Thunderstorm',
  'Heatwave',
];

export const ALERT_TYPES = [
  { value: 'heavy_rain', label: 'Heavy Rain' },
  { value: 'thunderstorm', label: 'Thunderstorm & Lightning' },
  { value: 'high_temperature', label: 'High Temperature / Heatwave' },
  { value: 'strong_wind', label: 'Strong Surface Wind' },
  { value: 'low_temperature', label: 'Cold Wave / Frost' },
  { value: 'flood_risk', label: 'Localized Flood / Waterlogging Risk' },
];

export const SEVERITY_LEVELS = [
  { value: 'low', label: 'Normal / Low Risk', color: 'emerald' },
  { value: 'moderate', label: 'Moderate Risk', color: 'amber' },
  { value: 'high', label: 'High Risk', color: 'orange' },
  { value: 'severe', label: 'Severe Risk', color: 'red' },
];

export const COMMON_CROPS = [
  'Paddy',
  'Wheat',
  'Mustard',
  'Pearl Millet (Bajra)',
  'Cauliflower',
  'Tomato',
  'Sugarcane',
  'Vegetables',
];

export const PROTOTYPE_DISCLAIMER_TEXT =
  'Panchayat-level forecasts shown in this prototype are simulated downscaled outputs. AI/ML-based operational downscaling will be integrated in a future version.';
