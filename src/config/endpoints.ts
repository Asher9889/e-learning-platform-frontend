// src/api/endpoints.ts

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },
  COURSES: {
    GET_ALL: '/courses',
    GET_BY_ID: (id: string) => `/courses/${id}`, // Dynamic route ke liye function
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/update-profile',
  },
} as const;