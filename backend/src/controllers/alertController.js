import {
  getWeatherAlerts,
  createWeatherAlert,
  updateWeatherAlert,
  deleteWeatherAlert,
} from '../services/alertService.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listAlerts = asyncHandler(async (req, res) => {
  const alerts = await getWeatherAlerts(req.query);
  return sendSuccess(res, 'Weather alerts fetched successfully', { alerts });
});

export const addAlert = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    panchayat: req.body.panchayat || null,
    createdBy: req.user._id,
  };
  const alert = await createWeatherAlert(payload);
  return sendSuccess(res, 'Weather alert created successfully', { alert }, 201);
});

export const editAlert = asyncHandler(async (req, res) => {
  const alert = await updateWeatherAlert(req.params.id, req.body);
  return sendSuccess(res, 'Weather alert updated successfully', { alert });
});

export const removeAlert = asyncHandler(async (req, res) => {
  await deleteWeatherAlert(req.params.id);
  return sendSuccess(res, 'Weather alert deleted successfully', {});
});
