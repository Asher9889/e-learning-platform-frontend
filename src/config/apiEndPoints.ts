export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: {
      path: "/auth/login",
      method: "POST",
    },

    REGISTER: {
      path: "/auth/register",
      method: "POST",
    },

    REFRESH: {
      path: "/auth/refresh",
      method: "POST",
    },

    LOGOUT: {
      path: "/auth/logout",
      method: "POST",
    },

    ME: {
      path: "/auth/me",
      method: "GET",
    },
  },

  USERS: {
    GET_ALL: {
      path: "/users",
      method: "GET",
    },

    GET_BY_ID: (userId: string) => ({
      path: `/users/${userId}`,
      method: "GET",
    }),

    UPDATE: (userId: string) => ({
      path: `/users/${userId}`,
      method: "PATCH",
    }),

    UPDATE_STATUS: (userId: string) => ({
      path: `/users/${userId}/status`,
      method: "PATCH",
    }),
  },

  COURSES: {
    GET_ALL: {
      path: "/courses",
      method: "GET",
    },

    CREATE: {
      path: "/courses",
      method: "POST",
    },

    GET_BY_ID: (courseId: string) => ({
      path: `/courses/${courseId}`,
      method: "GET",
    }),

    UPDATE: (courseId: string) => ({
      path: `/courses/${courseId}`,
      method: "PATCH",
    }),

    DELETE: (courseId: string) => ({
      path: `/courses/${courseId}`,
      method: "DELETE",
    }),
  },
} as const;