// // src/api/axiosInstance.ts
// import axios from 'axios';

// export const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL });

// // Interceptor for Auth token
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token'); // Ya Redux state se
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });


// using token refresh mechanism
// import axios from 'axios';
// import envs from './env';

// const api = axios.create({
//   baseURL: envs.baseURL,
// });

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // Agar 401 error hai aur pehle retry nahi kiya gaya hai
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const refreshToken = localStorage.getItem('refreshToken');
        
//         // Refresh token se naya access token mangna
//         const { data } = await axios.post(`${envs.baseURL}/auth/refresh-token`, {
//           token: refreshToken
//         });

//         // Naya token store karein
//         localStorage.setItem('token', data.accessToken);

//         // Header update karke purani request ko retry karein
//         originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
//         return api(originalRequest);
        
//       } catch (refreshError) {
//         // Agar refresh token bhi expire ho gaya, toh logout karein
//         localStorage.removeItem('token');
//         localStorage.removeItem('refreshToken');
//         window.location.href = '/login';
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;

import axios from 'axios';
import envs from './env';

const api = axios.create({
  baseURL: envs.baseURL,
  withCredentials: true, // Important
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Refresh token cookie automatically jayegi
        await api.post('/auth/refresh-token');

        // Original request retry
        return api(originalRequest);
      } catch (refreshError) {
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;