/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from 'axios';

export const HOST_URL = "http://localhost:8000/api/v1";         // Python AI Microservice
export const HOST_URL1 = "https://elearning.mssplonline.in/api"; // Node.js Backend

// 1. Python AI Service Instance (Timeout increased to 120s for Deep AI Video/PDF Analysis)
const api = axios.create({
  baseURL: HOST_URL,
  timeout: 120000, // 🟢 FIX: 120 Seconds (2 Minutes) Timeout
});

// 2. Node.js Backend Instance (With Auth Cookies)
export const api1 = axios.create({
  baseURL: HOST_URL1,
  timeout: 120000,
  withCredentials: true, // Sends Auth Cookies Automatically
});

// Response Interceptor for Node.js Backend (api1)
api1.interceptors.response.use(
  function onFulfilled(response) {
    return response.data;
  },
  async function onRejected(error: AxiosError) {
    if (!error.response) {
      return Promise.reject(new Error("Node Backend Server is not responding"));
    }
    const responseData = error.response.data as any;
    return Promise.reject(new Error(responseData?.message || "Node API Error"));
  }
);

// Response Interceptor for Python AI Service (api)
api.interceptors.response.use(
  function onFulfilled(response) {
    return response.data;
  },
  async function onRejected(error: AxiosError) {
    if (!error.response) {
      return Promise.reject(new Error("Python AI Service is not responding. Please check if FastAPI server is running."));
    }
    const responseData = error.response.data as any;
    const errorMsg = responseData?.detail || responseData?.message || "AI Processing Error";
    return Promise.reject(new Error(errorMsg));
  }
);

export default api;
