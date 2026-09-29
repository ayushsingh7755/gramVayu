import axios from 'axios';

const resolveBaseUrl = () => {
  const configured = import.meta.env.VITE_API_URL || '/api';
  if (
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1' &&
    configured.includes('localhost')
  ) {
    return '/api';
  }
  return configured;
};

const apiClient = axios.create({
  baseURL: resolveBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const savedToken = localStorage.getItem('gramvayu_token');
  if (savedToken && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${savedToken}`;
  }
  return config;
});

export default apiClient;
