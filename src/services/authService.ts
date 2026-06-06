import { envConfig} from '@/config';
import type { LoginCredentials } from '@/types';
import axios from 'axios';

const API_BASE = envConfig.baseURL;

export const loginUser = async (credentials: LoginCredentials) => {
  const { data } = await axios.post(`${API_BASE}/auth/login`, credentials);
  return data;
};