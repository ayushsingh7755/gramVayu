/**
 * Haversine distance in kilometers between two lat/lng coordinates.
 */
export const haversineDistanceKm = (lat1, lon1, lat2, lon2) => {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Deterministic hash from a string or coordinate pair into [-1, 1]
 * Used to ensure repeatable spatial micro-climate adjustments without randomness.
 */
export const deterministicSpatialFactor = (inputString) => {
  let hash = 2166136261;
  const str = String(inputString);
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const normalized = ((hash >>> 0) % 2000) / 1000 - 1; // [-1, 1]
  return Number(normalized.toFixed(4));
};
