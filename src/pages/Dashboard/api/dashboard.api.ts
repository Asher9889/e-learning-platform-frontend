import { api, apiEndPoints } from "@/config";

export const getUser = async () => {
  const { data } = await api.get(`/auth/me`);
  return data;
};



export async function getDashboardStats() {
  const { url, method } = apiEndPoints.DASHBOARD.STATS;

  const res = await api.request({
    url,
    method,
  });

  return res.data;
}

export async function getRecentLiveClasses() {
  const { url, method } = apiEndPoints.DASHBOARD.RECENT_LIVE_CLASSES;

  const res = await api.request({
    url,
    method,
  });

  return res.data;
}

export async function getRecentContents() {
  const { url, method } = apiEndPoints.DASHBOARD.RECENT_CONTENTS;

  const res = await api.request({
    url,
    method,
  });

  return res.data;
}

export async function getRecentGroupStudies() {
  const { url, method } = apiEndPoints.DASHBOARD.RECENT_GROUP_STUDIES;

  const res = await api.request({
    url,
    method,
  });

  return res.data;
}