import apiClient from './api';

export const authService = {
  async register(userData) {
    const { data } = await apiClient.post('/auth/register', userData);
    if (data?.data?.token) {
      localStorage.setItem('gramvayu_token', data.data.token);
    }
    return data.data;
  },

  async login(credentials) {
    const { data } = await apiClient.post('/auth/login', credentials);
    if (data?.data?.token) {
      localStorage.setItem('gramvayu_token', data.data.token);
    }
    return data.data;
  },

  async logout() {
    localStorage.removeItem('gramvayu_token');
    const { data } = await apiClient.post('/auth/logout');
    return data;
  },

  async getCurrentUser() {
    const { data } = await apiClient.get('/auth/me');
    return data.data.user;
  },

  async updateProfile(profileData) {
    const { data } = await apiClient.put('/auth/profile', profileData);
    return data.data.user;
  },
};
