import axios from 'axios';
import envConfig from './envConfig';

const api = axios.create({
  baseURL: envConfig.baseURL,
  withCredentials: true, // Important
});

api.interceptors.response.use((response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh token cookie automatically jayegi
        // await api.post('/auth/refresh-token');

        // // Original request retry
        // return api(originalRequest);
      } catch (refreshError) {
        // window.location.href = '/login';
        // return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;