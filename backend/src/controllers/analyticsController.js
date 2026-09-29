import {
  getDashboardAnalytics,
  getWeatherTrendsAnalytics,
  getRiskSummaryAnalytics,
} from '../services/analyticsService.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const fetchDashboardAnalytics = asyncHandler(async (req, res) => {
  const stats = await getDashboardAnalytics(req.query);
  return sendSuccess(res, 'Dashboard analytics fetched successfully', stats);
});

export const fetchWeatherTrends = asyncHandler(async (req, res) => {
  const trends = await getWeatherTrendsAnalytics(req.query);
  return sendSuccess(res, 'Weather trends fetched successfully', trends);
});

export const fetchRiskSummary = asyncHandler(async (req, res) => {
  const riskSummary = await getRiskSummaryAnalytics(req.query);
  return sendSuccess(res, 'Risk summary fetched successfully', riskSummary);
});
