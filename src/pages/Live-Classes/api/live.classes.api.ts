import { api, apiEndPoints } from "@/config";
import type { TStartLiveClassInput } from "../schema/live.class.schema";


// http://127.0.0.1:4505/api/v1/classes/subjects/summary?grade=11th Grade
// GET

export async function getClassSubjectsSummary(grade: string) {
  const { url, method } =
    apiEndPoints.LIVE_CLASSES.SUBJECTS_SUMMARY;

  const res = await api.request<any>({
    url,
    method,
    params: {
      grade,
    },
  });

  return res.data;
}


export async function startLiveClass(liveClassData: TStartLiveClassInput) {
  const { url, method } =
    apiEndPoints.LIVE_CLASSES.START_LIVE_CLASS;

  const res = await api.request({
    url,
    method,
    data:liveClassData,
  });

  return res.data;
}