import { api, envConfig} from '@/config';
// import type { LoginCredentials } from '@/types';


const API_BASE = envConfig.baseURL;

console.log(API_BASE,"API_BASE")
export const getUser = async () => {
  const { data } = await api.get(`/auth/me`);
  return data;
};