import { api } from '@/config';


export const getUser = async () => {
  const { data } = await api.get(`/auth/me`);
  return data;
};