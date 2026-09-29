import State from '../models/State.js';
import District from '../models/District.js';
import Block from '../models/Block.js';
import Panchayat from '../models/Panchayat.js';
import WeatherForecast from '../models/WeatherForecast.js';
import { calculateWeatherRisk } from './riskService.js';
import { AppError } from '../utils/AppError.js';

export const getAllStates = async () => {
  return State.find().sort({ name: 1 });
};

export const createState = async (data) => {
  return State.create(data);
};

export const getDistrictsByState = async (stateId) => {
  const filter = stateId && stateId !== 'all' ? { state: stateId } : {};
  return District.find(filter).populate('state', 'name code').sort({ name: 1 });
};

export const createDistrict = async (data) => {
  return District.create(data);
};

export const getBlocksByDistrict = async (districtId) => {
  const filter = districtId && districtId !== 'all' ? { district: districtId } : {};
  return Block.find(filter)
    .populate('district', 'name code')
    .populate('state', 'name code')
    .sort({ name: 1 });
};

export const createBlock = async (data) => {
  return Block.create(data);
};

export const getPanchayatsByBlock = async (blockId) => {
  const filter = blockId && blockId !== 'all' ? { block: blockId } : {};
  return Panchayat.find(filter)
    .populate('block', 'name centerLatitude centerLongitude elevation')
    .populate('district', 'name code')
    .populate('state', 'name code')
    .sort({ name: 1 });
};

export const getAllPanchayatsWithLatestWeather = async (query = {}) => {
  const filter = {};
  if (query.state) filter.state = query.state;
  if (query.district) filter.district = query.district;
  if (query.block) filter.block = query.block;
  if (query.search) {
    filter.name = { $regex: query.search, $options: 'i' };
  }

  const panchayats = await Panchayat.find(filter)
    .populate('block', 'name centerLatitude centerLongitude elevation')
    .populate('district', 'name code')
    .populate('state', 'name code')
    .sort({ name: 1 })
    .lean();

  const targetDate = query.date || null;

  const enriched = await Promise.all(
    panchayats.map(async (p) => {
      const weatherFilter = {
        locationType: 'panchayat',
        panchayat: p._id,
      };
      if (targetDate) {
        weatherFilter.date = targetDate;
      }

      let latestWeather = await WeatherForecast.findOne(weatherFilter)
        .sort({ date: 1 })
        .lean();

      if (!latestWeather && targetDate) {
        latestWeather = await WeatherForecast.findOne({
          locationType: 'panchayat',
          panchayat: p._id,
        })
          .sort({ date: -1 })
          .lean();
      }

      const risk = latestWeather
        ? calculateWeatherRisk(latestWeather)
        : {
            riskLevel: 'low',
            riskType: 'normal',
            reason: 'No active forecast warnings',
            color: 'green',
          };

      return {
        ...p,
        latestWeather: latestWeather || null,
        risk,
      };
    })
  );

  return enriched;
};

export const getPanchayatByIdWithDetails = async (id) => {
  const panchayat = await Panchayat.findById(id)
    .populate('block', 'name centerLatitude centerLongitude elevation')
    .populate('district', 'name code')
    .populate('state', 'name code')
    .lean();

  if (!panchayat) {
    throw new AppError('Panchayat not found.', 404);
  }

  const forecasts = await WeatherForecast.find({
    locationType: 'panchayat',
    panchayat: panchayat._id,
  })
    .sort({ date: 1 })
    .lean();

  const enrichedForecasts = forecasts.map((f) => ({
    ...f,
    risk: calculateWeatherRisk(f),
  }));

  const currentWeather = enrichedForecasts[0] || null;

  return {
    ...panchayat,
    currentWeather,
    forecasts: enrichedForecasts,
  };
};

export const createPanchayat = async (data) => {
  return Panchayat.create(data);
};

export const updatePanchayat = async (id, data) => {
  const updated = await Panchayat.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .populate('block', 'name')
    .populate('district', 'name')
    .populate('state', 'name code');

  if (!updated) {
    throw new AppError('Panchayat not found.', 404);
  }
  return updated;
};

export const deletePanchayat = async (id) => {
  const deleted = await Panchayat.findByIdAndDelete(id);
  if (!deleted) {
    throw new AppError('Panchayat not found.', 404);
  }
  await WeatherForecast.deleteMany({ panchayat: id });
  return deleted;
};
