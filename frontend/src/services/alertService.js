import apiClient from './api';

export const alertService = {
  async getAlerts(params = {}) {
    const { data } = await apiClient.get('/alerts', { params });
    return data.data.alerts;
  },

  async createAlert(payload) {
    const { data } = await apiClient.post('/alerts', payload);
    return data.data.alert;
  },

  async updateAlert(id, payload) {
    const { data } = await apiClient.put(`/alerts/${id}`, payload);
    return data.data.alert;
  },

  async deleteAlert(id) {
    const { data } = await apiClient.delete(`/alerts/${id}`);
    return data;
  },
};
