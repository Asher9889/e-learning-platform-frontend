import axios, { AxiosError } from 'axios';
import envConfig from './envConfig';


export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}
const api = axios.create({
  baseURL: envConfig.baseURL,
  withCredentials: true, // Important
});


api.interceptors.response.use(
  function onFulfilled(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  }, async function onRejected(error: AxiosError) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error



    // Network/server unreachable
    if (!error.response) {
      return Promise.reject(new Error("Server is not responding"));
    }

    // Handle auth refresh only
    if (error.response.status === 401) {

      const originalRequest = error.config;

      if (!originalRequest) {
        return Promise.reject(error);
      }

      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      if (originalRequest.url?.includes("/auth/login") || originalRequest.url?.includes("/auth/refresh")) {
        return Promise.reject(error);
      }

      try {
        originalRequest._retry = true;
        await api.post("/auth/refresh");
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }


    }

    // Normalize all other errors
    const responseData = error.response.data as { message?: string, errors?: any[], success: boolean, statusCode: number };
    console.log("Error response data:", responseData);
    // const message =  responseData?.message || "Something went wrong";
  
    const errorData = {
  message: responseData?.message,
  statusCode: responseData.statusCode,
}
// const dummy = new Error(errorData)
// console.log(message, "messagemessagemessage0147101", dummy)
// return Promise.reject(new ApiError(errorData));
return Promise.reject(
  new ApiError(
    errorData.message || "Unknown error",
    errorData.statusCode || 500
  )
);
  }
)

export default api;