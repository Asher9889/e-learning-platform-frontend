import { apiEndPoints } from "@/config";
import { api } from "@/config/index";
import type { IUserState } from "@/constants/user/user.constant";


const getMe = async () => {
  const { url, method } = apiEndPoints.AUTH.ME;
  const response = await api.request<IUserState>({
    url: url,
    method: method,
  });
  return response.data as unknown as IUserState;
};

export const authService = {
  getMe,
};