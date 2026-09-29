import express from 'express';
import {
  fetchDashboardAnalytics,
  fetchWeatherTrends,
  fetchRiskSummary,
} from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/dashboard', fetchDashboardAnalytics);
router.get('/weather-trends', fetchWeatherTrends);
router.get('/risk-summary', fetchRiskSummary);

export default router;
