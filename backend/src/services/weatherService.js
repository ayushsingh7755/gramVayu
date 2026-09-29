import WeatherForecast from '../models/WeatherForecast.js';
import Block from '../models/Block.js';
import Panchayat from '../models/Panchayat.js';
import { calculateWeatherRisk } from './riskService.js';
import { simulatePanchayatWeather } from './downscalingService.js';
import { AppError } from '../utils/AppError.js';

const populateWeatherQuery = (query) =>
  query
    .populate('state', 'name code')
    .populate('district', 'name code')
    .populate('block', 'name centerLatitude centerLongitude elevation')
    .populate('panchayat', 'name latitude longitude elevation area population vegetationFactor');

export const queryWeatherForecasts = async (filters = {}) => {
  const query = {};
  if (filters.locationType) query.locationType = filters.locationType;
  if (filters.state) query.state = filters.state;
  if (filters.district) query.district = filters.district;
  if (filters.block) query.block = filters.block;
  if (filters.panchayat) query.panchayat = filters.panchayat;
  if (filters.date) query.date = filters.date;
  if (filters.forecastType) query.forecastType = filters.forecastType;

  const docs = await populateWeatherQuery(
    WeatherForecast.find(query).sort({ date: 1, locationType: 1 })
  ).lean();

  return docs.map((doc) => ({
    ...doc,
    risk: calculateWeatherRisk(doc),
  }));
};

export const getWeatherForecastById = async (id) => {
  const doc = await populateWeatherQuery(WeatherForecast.findById(id)).lean();
  if (!doc) {
    throw new AppError('Weather forecast record not found.', 404);
  }
  return {
    ...doc,
    risk: calculateWeatherRisk(doc),
  };
};

export const createOrUpdateWeatherForecast = async (payload) => {
  const { locationType, block, panchayat, date } = payload;

  const blockDoc = await Block.findById(block);
  if (!blockDoc) {
    throw new AppError('Specified Block not found.', 404);
  }

  const recordData = {
    ...payload,
    state: payload.state || blockDoc.state,
    district: payload.district || blockDoc.district,
    block: blockDoc._id,
    panchayat: locationType === 'panchayat' ? panchayat : null,
    minTemperature:
      payload.minTemperature ?? Number((Number(payload.temperature) - 4.5).toFixed(1)),
    maxTemperature:
      payload.maxTemperature ?? Number((Number(payload.temperature) + 4.2).toFixed(1)),
  };

  const filter = {
    locationType,
    block: blockDoc._id,
    panchayat: locationType === 'panchayat' ? panchayat : null,
    date,
  };

  const saved = await WeatherForecast.findOneAndUpdate(filter, recordData, {
    new: true,
    upsert: true,
    runValidators: true,
    setDefaultsOnInsert: true,
  });

  return getWeatherForecastById(saved._id);
};

export const updateWeatherForecastById = async (id, payload) => {
  const updated = await WeatherForecast.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!updated) {
    throw new AppError('Weather forecast record not found.', 404);
  }
  return getWeatherForecastById(updated._id);
};

export const deleteWeatherForecastById = async (id) => {
  const deleted = await WeatherForecast.findByIdAndDelete(id);
  if (!deleted) {
    throw new AppError('Weather forecast record not found.', 404);
  }
  return deleted;
};

export const getWeatherByPanchayat = async (panchayatId) => {
  const docs = await populateWeatherQuery(
    WeatherForecast.find({
      locationType: 'panchayat',
      panchayat: panchayatId,
    }).sort({ date: 1 })
  ).lean();

  return docs.map((d) => ({
    ...d,
    risk: calculateWeatherRisk(d),
  }));
};

export const getWeatherByBlock = async (blockId) => {
  const docs = await populateWeatherQuery(
    WeatherForecast.find({
      locationType: 'block',
      block: blockId,
    }).sort({ date: 1 })
  ).lean();

  return docs.map((d) => ({
    ...d,
    risk: calculateWeatherRisk(d),
  }));
};

export const compareBlockAndPanchayatWeather = async ({
  blockId,
  panchayatId,
  date,
}) => {
  if (!blockId || !panchayatId) {
    throw new AppError('Both blockId and panchayatId are required for comparison.', 400);
  }

  const panchayatDoc = await Panchayat.findById(panchayatId)
    .populate('block', 'name centerLatitude centerLongitude elevation')
    .populate('district', 'name code')
    .populate('state', 'name code')
    .lean();

  if (!panchayatDoc) {
    throw new AppError('Selected Panchayat not found.', 404);
  }

  const blockDoc = await Block.findById(blockId)
    .populate('district', 'name code')
    .populate('state', 'name code')
    .lean();

  if (!blockDoc) {
    throw new AppError('Selected Block not found.', 404);
  }

  const blockForecasts = await WeatherForecast.find({
    locationType: 'block',
    block: blockId,
  })
    .sort({ date: 1 })
    .lean();

  const panchayatForecasts = await WeatherForecast.find({
    locationType: 'panchayat',
    panchayat: panchayatId,
  })
    .sort({ date: 1 })
    .lean();

  const targetDate =
    date ||
    blockForecasts[0]?.date ||
    panchayatForecasts[0]?.date ||
    new Date().toISOString().split('T')[0];

  let blockDay = blockForecasts.find((f) => f.date === targetDate) || blockForecasts[0] || null;
  let panchayatDay =
    panchayatForecasts.find((f) => f.date === (blockDay?.date || targetDate)) || null;

  // If Panchayat forecast for that date hasn't been persisted yet, compute deterministic simulation on the fly
  if (blockDay && !panchayatDay) {
    panchayatDay = simulatePanchayatWeather(blockDay, panchayatDoc, blockDoc);
  }

  // Build multi-day comparison series across all available block dates
  const series = blockForecasts.map((bRow) => {
    const pRow =
      panchayatForecasts.find((p) => p.date === bRow.date) ||
      simulatePanchayatWeather(bRow, panchayatDoc, blockDoc);

    return {
      date: bRow.date,
      blockTemperature: bRow.temperature,
      panchayatTemperature: pRow.temperature,
      blockRainfall: bRow.rainfall,
      panchayatRainfall: pRow.rainfall,
      blockHumidity: bRow.humidity,
      panchayatHumidity: pRow.humidity,
      blockWindSpeed: bRow.windSpeed,
      panchayatWindSpeed: pRow.windSpeed,
    };
  });

  return {
    date: blockDay?.date || targetDate,
    block: blockDoc,
    panchayat: panchayatDoc,
    blockWeather: blockDay ? { ...blockDay, risk: calculateWeatherRisk(blockDay) } : null,
    panchayatWeather: panchayatDay
      ? { ...panchayatDay, risk: calculateWeatherRisk(panchayatDay) }
      : null,
    differences:
      blockDay && panchayatDay
        ? {
            temperature: Number((panchayatDay.temperature - blockDay.temperature).toFixed(1)),
            rainfall: Number((panchayatDay.rainfall - blockDay.rainfall).toFixed(1)),
            humidity: Number((panchayatDay.humidity - blockDay.humidity).toFixed(1)),
            windSpeed: Number((panchayatDay.windSpeed - blockDay.windSpeed).toFixed(1)),
            pressure: Number((panchayatDay.pressure - blockDay.pressure).toFixed(1)),
          }
        : null,
    series,
  };
};
