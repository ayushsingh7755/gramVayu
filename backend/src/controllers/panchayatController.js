import {
  getAllPanchayatsWithLatestWeather,
  getPanchayatByIdWithDetails,
  createPanchayat,
  updatePanchayat,
  deletePanchayat,
} from '../services/locationService.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listPanchayats = asyncHandler(async (req, res) => {
  const panchayats = await getAllPanchayatsWithLatestWeather(req.query);
  return sendSuccess(res, 'Panchayats fetched successfully', { panchayats });
});

export const getPanchayat = asyncHandler(async (req, res) => {
  const panchayat = await getPanchayatByIdWithDetails(req.params.id);
  return sendSuccess(res, 'Panchayat details fetched successfully', {
    panchayat,
  });
});

export const addPanchayat = asyncHandler(async (req, res) => {
  const panchayat = await createPanchayat(req.body);
  return sendSuccess(res, 'Panchayat created successfully', { panchayat }, 201);
});

export const editPanchayat = asyncHandler(async (req, res) => {
  const panchayat = await updatePanchayat(req.params.id, req.body);
  return sendSuccess(res, 'Panchayat updated successfully', { panchayat });
});

export const removePanchayat = asyncHandler(async (req, res) => {
  await deletePanchayat(req.params.id);
  return sendSuccess(res, 'Panchayat deleted successfully', {});
});
