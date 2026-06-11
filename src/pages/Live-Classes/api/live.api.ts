import { apiEndPoints } from "@/config";
import type { TStartLiveClassInput, TJoinLiveClassInput } from "../schema/live.schema";
import type { ILiveSession } from "../types";

import apiRequest from "@/lib/request";

const { UPCOMING } = apiEndPoints.LIVE_CLASSES; 

export const liveClassApi = {
  
  getUpcoming: () => apiRequest<ILiveSession[]>({url: UPCOMING.url, method: UPCOMING.method}),

  getById: (id: string) => apiRequest<ILiveSession>({url: `/live-classes/${id}`}),

  create: (data: TStartLiveClassInput) => apiRequest<ILiveSession, TStartLiveClassInput>({ url: "/live-classes", method: "POST",data}),

  start: (id: string) =>apiRequest< ILiveSession & {
        meetingUrl: string;
        passcode: string;
      }>({
      url: `/live-classes/${id}/start`,
      method: "POST",
      data: undefined
    }),

  join: (id: string, data: TJoinLiveClassInput) => apiRequest<{token: string; roomUrl: string;}, TJoinLiveClassInput>({
      url: `/live-classes/${id}/join`,
      method: "POST",
      data,
    }),

  end: (id: string) => apiRequest<ILiveSession>({url: `/live-classes/${id}/end`, method: "POST"}),
};