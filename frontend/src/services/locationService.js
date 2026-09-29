import apiClient from './api';

export const locationService = {
  async getStates() {
    const { data } = await apiClient.get('/locations/states');
    return data.data.states;
  },

  async createState(payload) {
    const { data } = await apiClient.post('/locations/states', payload);
    return data.data.state;
  },

  async getDistricts(stateId = 'all') {
    const { data } = await apiClient.get(`/locations/districts/${stateId}`);
    return data.data.districts;
  },

  async createDistrict(payload) {
    const { data } = await apiClient.post('/locations/districts', payload);
    return data.data.district;
  },

  async getBlocks(districtId = 'all') {
    const { data } = await apiClient.get(`/locations/blocks/${districtId}`);
    return data.data.blocks;
  },

  async createBlock(payload) {
    const { data } = await apiClient.post('/locations/blocks', payload);
    return data.data.block;
  },

  async getPanchayatsByBlock(blockId = 'all') {
    const { data } = await apiClient.get(`/locations/panchayats/${blockId}`);
    return data.data.panchayats;
  },

  async getAllPanchayats(params = {}) {
    const { data } = await apiClient.get('/panchayats', { params });
    return data.data.panchayats;
  },

  async getPanchayatById(id) {
    const { data } = await apiClient.get(`/panchayats/${id}`);
    return data.data.panchayat;
  },

  async createPanchayat(payload) {
    const { data } = await apiClient.post('/panchayats', payload);
    return data.data.panchayat;
  },

  async updatePanchayat(id, payload) {
    const { data } = await apiClient.put(`/panchayats/${id}`, payload);
    return data.data.panchayat;
  },

  async deletePanchayat(id) {
    const { data } = await apiClient.delete(`/panchayats/${id}`);
    return data;
  },
};
