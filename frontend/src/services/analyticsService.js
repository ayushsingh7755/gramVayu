import apiClient from './api';

export const analyticsService = {
  async getDashboardStats(params = {}) {
    const { data } = await apiClient.get('/analytics/dashboard', { params });
    return data.data;
  },

  async getWeatherTrends(params = {}) {
    const { data } = await apiClient.get('/analytics/weather-trends', {
      params,
    });
    return data.data;
  },

  async getRiskSummary(params = {}) {
    const { data } = await apiClient.get('/analytics/risk-summary', { params });
    return data.data;
  },
};
