import { haversineDistanceKm, deterministicSpatialFactor } from '../utils/geoUtils.js';
import { calculateWeatherRisk } from './riskService.js';
import { env } from '../config/env.js';
import { requestAiDownscalingFromFastAPI } from './aiClientService.js';

/**
 * Infers descriptive weather condition from downscaled rainfall, cloud cover, and temperature.
 */
const deriveWeatherCondition = ({ rainfall, temperature, cloudCover, windSpeed }) => {
  if (rainfall >= 50) return 'Heavy Rain';
  if (rainfall >= 20 && windSpeed >= 28) return 'Thunderstorm';
  if (rainfall >= 15) return 'Moderate Rain';
  if (rainfall >= 2) return 'Light Rain';
  if (temperature >= 40) return 'Heatwave';
  if (cloudCover >= 70) return 'Cloudy';
  if (cloudCover >= 30) return 'Partly Cloudy';
  return 'Clear';
};

/**
 * Deterministic Prototype Downscaling Engine
 * ----------------------------------------------------------------------------
 * Computes repeatable Panchayat-level micro-meteorological estimates from
 * coarse Block-level weather using Panchayat geographical metadata:
 *   - Latitude & Longitude (spatial gradient relative to Block center)
 *   - Elevation delta (environmental lapse rate ~0.65°C per 100m)
 *   - Vegetation factor (evaporative cooling & moisture retention)
 *   - Area & distance from Block center
 *
 * IMPORTANT: Uses NO random numbers. Identical inputs always yield identical outputs.
 */
export const simulatePanchayatWeather = (blockWeather, panchayat, blockDoc = null) => {
  const blockLat = blockDoc?.centerLatitude ?? 28.61;
  const blockLon = blockDoc?.centerLongitude ?? 77.05;
  const blockElevation = blockDoc?.elevation ?? 215;

  const pLat = Number(panchayat.latitude || blockLat);
  const pLon = Number(panchayat.longitude || blockLon);
  const pElevation = Number(panchayat.elevation || blockElevation);
  const vegFactor = Number(panchayat.vegetationFactor ?? 0.65); // [0..1]
  const area = Number(panchayat.area || 12);

  // Distance from block center in km
  const distanceKm = haversineDistanceKm(blockLat, blockLon, pLat, pLon);

  // Deterministic coordinate signature in [-1, 1]
  const spatialSig = deterministicSpatialFactor(
    `${panchayat.name}:${pLat.toFixed(4)}:${pLon.toFixed(4)}`
  );

  // 1. Temperature adjustment (°C)
  // Elevation lapse rate + vegetation cooling + directional micro-gradient
  const elevationDeltaM = pElevation - blockElevation;
  const lapseAdjustment = -(elevationDeltaM / 100) * 0.65;
  const vegCooling = -(vegFactor - 0.5) * 1.4;
  const spatialTempOffset = spatialSig * 0.55;
  const tempDelta = Number((lapseAdjustment + vegCooling + spatialTempOffset).toFixed(1));

  const temperature = Number((Number(blockWeather.temperature) + tempDelta).toFixed(1));
  const minTemperature = Number(
    (Number(blockWeather.minTemperature ?? blockWeather.temperature - 5) + tempDelta * 0.9).toFixed(1)
  );
  const maxTemperature = Number(
    (Number(blockWeather.maxTemperature ?? blockWeather.temperature + 4) + tempDelta * 1.1).toFixed(1)
  );

  // 2. Rainfall adjustment (mm)
  // Orographic/canopy & spatial convergence factor (typically 0.82x to 1.30x of Block rainfall)
  const baseRain = Number(blockWeather.rainfall || 0);
  const rainMultiplier = Number(
    Math.max(
      0.75,
      Math.min(1.35, 1 + (vegFactor - 0.5) * 0.35 + spatialSig * 0.22 + (elevationDeltaM / 200) * 0.08)
    ).toFixed(2)
  );
  const rainfall = baseRain > 0 ? Number(Math.max(0, baseRain * rainMultiplier).toFixed(1)) : 0;

  // 3. Humidity adjustment (%)
  const humidityDelta = Math.round((vegFactor - 0.5) * 8 + (rainMultiplier - 1) * 12 - tempDelta * 1.2);
  const humidity = Math.max(
    15,
    Math.min(99, Math.round(Number(blockWeather.humidity || 65) + humidityDelta))
  );

  // 4. Wind speed adjustment (km/h)
  // Higher vegetation canopy slightly reduces surface wind speed; open areas increase it
  const windDelta = Number((-(vegFactor - 0.5) * 4.5 + (area > 14 ? 1.2 : -0.6) + spatialSig * 1.5).toFixed(1));
  const windSpeed = Number(Math.max(2, Number(blockWeather.windSpeed || 12) + windDelta).toFixed(1));

  // 5. Pressure & Cloud Cover
  const pressure = Math.round(Number(blockWeather.pressure || 1006) - elevationDeltaM * 0.11);
  const cloudCover = Math.max(
    0,
    Math.min(100, Math.round(Number(blockWeather.cloudCover || 40) + (rainMultiplier - 1) * 25))
  );

  // 6. Probability of Rain (%)
  const baseProb = Number(
    blockWeather.probabilityOfRain ?? (baseRain > 15 ? 78 : baseRain > 2 ? 50 : 15)
  );
  const probabilityOfRain = Math.max(
    0,
    Math.min(100, Math.round(baseProb + (rainMultiplier - 1) * 35))
  );

  const weatherCondition = deriveWeatherCondition({
    rainfall,
    temperature,
    cloudCover,
    windSpeed,
  });

  const downscaledRecord = {
    locationType: 'panchayat',
    state: panchayat.state?._id || panchayat.state || blockWeather.state,
    district: panchayat.district?._id || panchayat.district || blockWeather.district,
    block: panchayat.block?._id || panchayat.block || blockWeather.block,
    panchayat: panchayat._id,
    date: blockWeather.date,
    temperature,
    minTemperature,
    maxTemperature,
    rainfall,
    humidity,
    windSpeed,
    windDirection: blockWeather.windDirection || 'NW',
    pressure,
    cloudCover,
    weatherCondition,
    probabilityOfRain,
    source: 'Prototype Simulated Downscaling',
    forecastType: 'simulated',
    downscalingMetadata: {
      parentBlockWeatherId: blockWeather._id || null,
      method: 'Prototype Simulated Downscaling',
      distanceFromBlockKm: Number(distanceKm.toFixed(2)),
      elevationDeltaM: Number(elevationDeltaM.toFixed(1)),
      vegetationFactor: vegFactor,
      temperatureDelta: tempDelta,
      rainfallMultiplier: rainMultiplier,
      humidityDelta,
      windDelta,
    },
  };

  const risk = calculateWeatherRisk(downscaledRecord);

  return {
    ...downscaledRecord,
    risk,
  };
};

/**
 * Primary Downscaling Abstraction
 * ----------------------------------------------------------------------------
 * Controllers call `generatePanchayatForecast(blockWeather, panchayats, blockDoc)`.
 * Currently uses the deterministic prototype downscaler.
 * Later can switch to FastAPI ML service via env.downscalingProvider === 'ai_service'.
 */
export const generatePanchayatForecast = async (blockWeather, panchayats, blockDoc = null) => {
  if (env.downscalingProvider === 'ai_service') {
    return requestAiDownscalingFromFastAPI(blockWeather, panchayats);
  }

  return panchayats.map((panchayat) =>
    simulatePanchayatWeather(blockWeather, panchayat, blockDoc)
  );
};
