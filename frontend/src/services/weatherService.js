import apiClient from './api';

export const weatherService = {
  async getWeatherList(params = {}) {
    const { data } = await apiClient.get('/weather', { params });
    return data.data.forecasts;
  },

  async getWeatherById(id) {
    const { data } = await apiClient.get(`/weather/${id}`);
    return data.data.forecast;
  },

  async createWeather(payload) {
    const isFormData = payload instanceof FormData;
    const { data } = await apiClient.post('/weather', payload, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return data.data.forecast;
  },

  async updateWeather(id, payload) {
    const { data } = await apiClient.put(`/weather/${id}`, payload);
    return data.data.forecast;
  },

  async deleteWeather(id) {
    const { data } = await apiClient.delete(`/weather/${id}`);
    return data;
  },

  async getPanchayatWeather(panchayatId) {
    const { data } = await apiClient.get(`/weather/panchayat/${panchayatId}`);
    return data.data.forecasts;
  },

  async getBlockWeather(blockId) {
    const { data } = await apiClient.get(`/weather/block/${blockId}`);
    return data.data.forecasts;
  },

  async compareBlockVsPanchayat(params) {
    const { data } = await apiClient.get('/weather/compare', { params });
    return data.data;
  },

  async generateDownscaledForecast({ blockId, date }) {
    const { data } = await apiClient.post('/downscaling/generate', {
      blockId,
      date,
    });
    return data.data;
  },

  async getDownscaledByPanchayat(panchayatId) {
    const { data } = await apiClient.get(`/downscaling/${panchayatId}`);
    return data.data;
  },
};
