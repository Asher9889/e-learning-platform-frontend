// src/services/auth.service.ts
import envs from '@/config/env';
import type { LoginCredentials } from '@/types/user';
import axios from 'axios';

// Vite environment variable access
const API_BASE = envs.baseURL;

export const loginUser = async (credentials: LoginCredentials) => {
  const { data } = await axios.post(`${API_BASE}/auth/login`, credentials);
  return data;
};