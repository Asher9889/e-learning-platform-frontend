import { apiEndPoints } from "@/config";
import { api } from "@/config/index";

interface IAddFcmTokenResponse {
  success: boolean;
  message: string;
}

const addFcmToken = async (token: string) => {
  const { url, method } = apiEndPoints.USERS.ADD_FCM_TOKEN;
  
  const response = await api.request<IAddFcmTokenResponse>({
    url,
    method,
    data: {
      token,
    },
  });

  return response.data as IAddFcmTokenResponse;
};

export const fcmService = {
  addFcmToken,
};