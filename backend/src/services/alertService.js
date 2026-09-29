import WeatherAlert from '../models/WeatherAlert.js';
import { AppError } from '../utils/AppError.js';

export const getWeatherAlerts = async (filters = {}) => {
  const query = {};
  if (filters.isActive !== undefined && filters.isActive !== 'all') {
    query.isActive = filters.isActive === 'true' || filters.isActive === true;
  }
  if (filters.severity && filters.severity !== 'all') {
    query.severity = filters.severity;
  }
  if (filters.type && filters.type !== 'all') {
    query.type = filters.type;
  }
  if (filters.state) query.state = filters.state;
  if (filters.district) query.district = filters.district;
  if (filters.block) query.block = filters.block;
  if (filters.panchayat) {
    query.$or = [{ panchayat: filters.panchayat }, { panchayat: null }];
  }

  return WeatherAlert.find(query)
    .populate('state', 'name code')
    .populate('district', 'name code')
    .populate('block', 'name')
    .populate('panchayat', 'name')
    .populate('createdBy', 'name role')
    .sort({ isActive: -1, severity: -1, createdAt: -1 });
};

export const createWeatherAlert = async (payload) => {
  const alert = await WeatherAlert.create(payload);
  return WeatherAlert.findById(alert._id)
    .populate('state', 'name code')
    .populate('district', 'name code')
    .populate('block', 'name')
    .populate('panchayat', 'name')
    .populate('createdBy', 'name role');
};

export const updateWeatherAlert = async (id, payload) => {
  const updated = await WeatherAlert.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
    .populate('state', 'name code')
    .populate('district', 'name code')
    .populate('block', 'name')
    .populate('panchayat', 'name');

  if (!updated) {
    throw new AppError('Weather alert not found.', 404);
  }
  return updated;
};

export const deleteWeatherAlert = async (id) => {
  const deleted = await WeatherAlert.findByIdAndDelete(id);
  if (!deleted) {
    throw new AppError('Weather alert not found.', 404);
  }
  return deleted;
};
