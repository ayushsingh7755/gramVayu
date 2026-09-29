import Panchayat from '../models/Panchayat.js';
import Block from '../models/Block.js';
import District from '../models/District.js';
import State from '../models/State.js';
import WeatherForecast from '../models/WeatherForecast.js';
import WeatherAlert from '../models/WeatherAlert.js';
import Advisory from '../models/Advisory.js';
import User from '../models/User.js';
import { calculateWeatherRisk } from './riskService.js';

export const getDashboardAnalytics = async (filters = {}) => {
  const locationFilter = {};
  if (filters.state) locationFilter.state = filters.state;
  if (filters.district) locationFilter.district = filters.district;
  if (filters.block) locationFilter.block = filters.block;
  if (filters.panchayat) locationFilter.panchayat = filters.panchayat;

  const [
    totalStates,
    totalDistricts,
    totalBlocks,
    totalPanchayats,
    activeAlerts,
    forecastCount,
    advisoryCount,
    totalUsers,
  ] = await Promise.all([
    State.countDocuments(),
    District.countDocuments(filters.state ? { state: filters.state } : {}),
    Block.countDocuments(
      filters.district
        ? { district: filters.district }
        : filters.state
        ? { state: filters.state }
        : {}
    ),
    Panchayat.countDocuments(
      filters.block
        ? { block: filters.block }
        : filters.district
        ? { district: filters.district }
        : {}
    ),
    WeatherAlert.countDocuments({ ...locationFilter, isActive: true }),
    WeatherForecast.countDocuments(locationFilter),
    Advisory.countDocuments(locationFilter),
    User.countDocuments(),
  ]);

  const weatherDocs = await WeatherForecast.find({
    ...locationFilter,
    locationType: filters.locationType || 'panchayat',
  }).lean();

  const count = weatherDocs.length || 1;
  const sumTemp = weatherDocs.reduce((acc, w) => acc + Number(w.temperature || 0), 0);
  const sumRain = weatherDocs.reduce((acc, w) => acc + Number(w.rainfall || 0), 0);
  const sumHumidity = weatherDocs.reduce((acc, w) => acc + Number(w.humidity || 0), 0);
  const sumWind = weatherDocs.reduce((acc, w) => acc + Number(w.windSpeed || 0), 0);

  const rainAlertCount = weatherDocs.filter((w) => Number(w.rainfall || 0) >= 25).length;

  return {
    totalStates,
    totalDistricts,
    totalBlocks,
    totalPanchayats,
    activeAlerts,
    rainAlertCount,
    averageTemperature: weatherDocs.length ? Number((sumTemp / count).toFixed(1)) : 31.5,
    totalRainfall: weatherDocs.length ? Number((sumRain / count).toFixed(1)) : 18.4,
    averageHumidity: weatherDocs.length ? Math.round(sumHumidity / count) : 70,
    averageWindSpeed: weatherDocs.length ? Number((sumWind / count).toFixed(1)) : 13.2,
    forecastCount,
    advisoryCount,
    totalUsers,
  };
};

export const getWeatherTrendsAnalytics = async (filters = {}) => {
  const matchQuery = {};
  if (filters.state) matchQuery.state = filters.state;
  if (filters.district) matchQuery.district = filters.district;
  if (filters.block) matchQuery.block = filters.block;
  if (filters.panchayat) {
    matchQuery.panchayat = filters.panchayat;
    matchQuery.locationType = 'panchayat';
  } else if (filters.locationType) {
    matchQuery.locationType = filters.locationType;
  } else {
    matchQuery.locationType = 'panchayat';
  }

  const forecasts = await WeatherForecast.find(matchQuery)
    .populate('panchayat', 'name')
    .populate('block', 'name')
    .sort({ date: 1 })
    .lean();

  // Group by date to compute daily averages for trend charts
  const byDate = new Map();
  for (const item of forecasts) {
    const d = item.date;
    if (!byDate.has(d)) {
      byDate.set(d, {
        date: d,
        tempSum: 0,
        minTempSum: 0,
        maxTempSum: 0,
        rainSum: 0,
        humiditySum: 0,
        windSum: 0,
        pressureSum: 0,
        count: 0,
      });
    }
    const entry = byDate.get(d);
    entry.tempSum += Number(item.temperature || 0);
    entry.minTempSum += Number(item.minTemperature || item.temperature - 4);
    entry.maxTempSum += Number(item.maxTemperature || item.temperature + 4);
    entry.rainSum += Number(item.rainfall || 0);
    entry.humiditySum += Number(item.humidity || 0);
    entry.windSum += Number(item.windSpeed || 0);
    entry.pressureSum += Number(item.pressure || 1006);
    entry.count += 1;
  }

  const dailyTrends = Array.from(byDate.values()).map((e) => ({
    date: e.date,
    temperature: Number((e.tempSum / e.count).toFixed(1)),
    minTemperature: Number((e.minTempSum / e.count).toFixed(1)),
    maxTemperature: Number((e.maxTempSum / e.count).toFixed(1)),
    rainfall: Number((e.rainSum / e.count).toFixed(1)),
    humidity: Math.round(e.humiditySum / e.count),
    windSpeed: Number((e.windSum / e.count).toFixed(1)),
    pressure: Math.round(e.pressureSum / e.count),
  }));

  return {
    dailyTrends,
    totalRecords: forecasts.length,
  };
};

export const getRiskSummaryAnalytics = async (filters = {}) => {
  const query = { locationType: 'panchayat' };
  if (filters.block) query.block = filters.block;
  if (filters.district) query.district = filters.district;
  if (filters.date) query.date = filters.date;

  const forecasts = await WeatherForecast.find(query)
    .populate('panchayat', 'name latitude longitude')
    .populate('block', 'name')
    .lean();

  const summary = {
    low: 0,
    moderate: 0,
    high: 0,
    severe: 0,
    byType: {
      normal: 0,
      heavy_rain: 0,
      thunderstorm: 0,
      high_temperature: 0,
      strong_wind: 0,
      low_temperature: 0,
      flood_risk: 0,
    },
    highRiskLocations: [],
  };

  for (const f of forecasts) {
    const risk = calculateWeatherRisk(f);
    summary[risk.riskLevel] = (summary[risk.riskLevel] || 0) + 1;
    summary.byType[risk.riskType] = (summary.byType[risk.riskType] || 0) + 1;

    if (risk.riskLevel === 'high' || risk.riskLevel === 'severe') {
      summary.highRiskLocations.push({
        forecastId: f._id,
        panchayatName: f.panchayat?.name || 'Panchayat',
        blockName: f.block?.name || 'Block',
        date: f.date,
        temperature: f.temperature,
        rainfall: f.rainfall,
        windSpeed: f.windSpeed,
        risk,
      });
    }
  }

  return summary;
};
