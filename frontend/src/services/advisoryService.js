import apiClient from './api';

export const advisoryService = {
  async getAdvisories(params = {}) {
    const { data } = await apiClient.get('/advisories', { params });
    return data.data.advisories;
  },

  async getAdvisoryById(id) {
    const { data } = await apiClient.get(`/advisories/${id}`);
    return data.data.advisory;
  },

  async createAdvisory(payload) {
    const isFormData = payload instanceof FormData;
    const { data } = await apiClient.post('/advisories', payload, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return data.data.advisory;
  },

  async updateAdvisory(id, payload) {
    const { data } = await apiClient.put(`/advisories/${id}`, payload);
    return data.data.advisory;
  },

  async deleteAdvisory(id) {
    const { data } = await apiClient.delete(`/advisories/${id}`);
    return data;
  },
};
