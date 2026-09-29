import apiClient from './api';

export const userService = {
  async getUsers(params = {}) {
    const { data } = await apiClient.get('/users', { params });
    return data.data.users;
  },

  async createUser(payload) {
    const { data } = await apiClient.post('/users', payload);
    return data.data.user;
  },

  async updateUser(id, payload) {
    const { data } = await apiClient.put(`/users/${id}`, payload);
    return data.data.user;
  },

  async deleteUser(id) {
    const { data } = await apiClient.delete(`/users/${id}`);
    return data;
  },
};
