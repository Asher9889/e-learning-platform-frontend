// src/pages/Teacher/api/upload-avatar.api.ts

import { api, apiEndPoints } from "@/config";

export async function uploadAvatar(
  file: File | string
) {
  const formData = new FormData();

  formData.append("avatar", file);

  const { url, method } =
    apiEndPoints.USERS.UPLOAD_AVATAR;

  const res = await api.request({
    url,
    method,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}