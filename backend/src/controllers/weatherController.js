import {
  queryWeatherForecasts,
  getWeatherForecastById,
  createOrUpdateWeatherForecast,
  updateWeatherForecastById,
  deleteWeatherForecastById,
  getWeatherByPanchayat,
  getWeatherByBlock,
  compareBlockAndPanchayatWeather,
} from '../services/weatherService.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listWeather = asyncHandler(async (req, res) => {
  const forecasts = await queryWeatherForecasts(req.query);
  return sendSuccess(res, 'Weather data fetched successfully', { forecasts });
});

export const getWeatherById = asyncHandler(async (req, res) => {
  const forecast = await getWeatherForecastById(req.params.id);
  return sendSuccess(res, 'Weather forecast fetched successfully', { forecast });
});

export const createWeather = asyncHandler(async (req, res) => {
  const payload = { ...req.body };

  if (req.file) {
    const uploaded = await uploadToCloudinary(req.file.path, 'weather_bulletins');
    if (uploaded) {
      payload.attachments = [
        {
          url: uploaded.url,
          publicId: uploaded.publicId,
          label: req.file.originalname,
        },
      ];
    }
  }

  const forecast = await createOrUpdateWeatherForecast(payload);
  return sendSuccess(
    res,
    'Weather forecast saved successfully',
    { forecast },
    201
  );
});

export const updateWeather = asyncHandler(async (req, res) => {
  const forecast = await updateWeatherForecastById(req.params.id, req.body);
  return sendSuccess(res, 'Weather forecast updated successfully', { forecast });
});

export const deleteWeather = asyncHandler(async (req, res) => {
  await deleteWeatherForecastById(req.params.id);
  return sendSuccess(res, 'Weather forecast deleted successfully', {});
});

export const fetchPanchayatWeather = asyncHandler(async (req, res) => {
  const forecasts = await getWeatherByPanchayat(req.params.panchayatId);
  return sendSuccess(res, 'Panchayat weather fetched successfully', {
    forecasts,
  });
});

export const fetchBlockWeather = asyncHandler(async (req, res) => {
  const forecasts = await getWeatherByBlock(req.params.blockId);
  return sendSuccess(res, 'Block weather fetched successfully', { forecasts });
});

export const compareWeather = asyncHandler(async (req, res) => {
  const { blockId, panchayatId, date } = req.query;
  const comparison = await compareBlockAndPanchayatWeather({
    blockId,
    panchayatId,
    date,
  });
  return sendSuccess(
    res,
    'Block vs Panchayat comparison generated successfully',
    comparison
  );
});
