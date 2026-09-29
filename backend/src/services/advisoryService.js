import Advisory from '../models/Advisory.js';
import { AppError } from '../utils/AppError.js';

export const getAdvisories = async (filters = {}) => {
  const query = {};
  if (filters.category && filters.category !== 'all') {
    query.category = filters.category;
  }
  if (filters.crop && filters.crop !== 'all') {
    query.crop = { $regex: filters.crop, $options: 'i' };
  }
  if (filters.weatherCondition && filters.weatherCondition !== 'all') {
    query.weatherCondition = { $regex: filters.weatherCondition, $options: 'i' };
  }
  if (filters.severity && filters.severity !== 'all') {
    query.severity = filters.severity;
  }
  if (filters.state) query.state = filters.state;
  if (filters.district) query.district = filters.district;
  if (filters.block) query.block = filters.block;
  if (filters.panchayat) {
    // Show advisories specific to this Panchayat OR block-wide advisories (panchayat: null)
    query.$or = [{ panchayat: filters.panchayat }, { panchayat: null }];
  }
  if (filters.search) {
    const searchRegex = { $regex: filters.search, $options: 'i' };
    query.$and = query.$and || [];
    query.$and.push({
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { crop: searchRegex },
        { weatherCondition: searchRegex },
      ],
    });
  }

  return Advisory.find(query)
    .populate('state', 'name code')
    .populate('district', 'name code')
    .populate('block', 'name')
    .populate('panchayat', 'name')
    .populate('createdBy', 'name role email')
    .sort({ createdAt: -1 });
};

export const getAdvisoryById = async (id) => {
  const advisory = await Advisory.findById(id)
    .populate('state', 'name code')
    .populate('district', 'name code')
    .populate('block', 'name')
    .populate('panchayat', 'name')
    .populate('createdBy', 'name role email');

  if (!advisory) {
    throw new AppError('Advisory not found.', 404);
  }
  return advisory;
};

export const createAdvisory = async (payload) => {
  const created = await Advisory.create(payload);
  return getAdvisoryById(created._id);
};

export const updateAdvisory = async (id, payload) => {
  const updated = await Advisory.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!updated) {
    throw new AppError('Advisory not found.', 404);
  }
  return getAdvisoryById(updated._id);
};

export const deleteAdvisory = async (id) => {
  const deleted = await Advisory.findByIdAndDelete(id);
  if (!deleted) {
    throw new AppError('Advisory not found.', 404);
  }
  return deleted;
};
