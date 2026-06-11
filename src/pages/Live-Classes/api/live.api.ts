import { apiEndPoints } from "@/config";
import type { TStartLiveClassInput, TJoinLiveClassInput } from "../schema/live.schema";
import type { IActiveLiveSession, IBaseApiResponse, IJoinLiveClassResponse, ILiveSession, IUpcomingLiveClassesResponse } from "../types";

import apiRequest from "@/lib/request";
import type { Method } from "axios";

const { UPCOMING, START, ACTIVE } = apiEndPoints.LIVE_CLASSES; 

export const liveClassApi = {

  getActive:  () => apiRequest<IUpcomingLiveClassesResponse>({url: ACTIVE.url, method: ACTIVE.method, params: ACTIVE.params}),

  getUpcoming: () => apiRequest<IUpcomingLiveClassesResponse>({url: UPCOMING.url, method: UPCOMING.method, params: UPCOMING.params}),

  getById: (id: string) => apiRequest<IUpcomingLiveClassesResponse>({url: `/live-classes/${id}`}),

  create: (data: TStartLiveClassInput) => apiRequest({ url: "/live-classes", method: "POST",data}),

  start: (id: string) =>apiRequest<{id: string, roomName: string}>({
      url: START(id).url,
      method: START(id).method as Method, 
    }),

  join: (roomName: string) => apiRequest<IJoinLiveClassResponse>({
      url: `/live-classes/${roomName}/join`,
      method: "POST",
    }),

  end: (id: string) => apiRequest<ILiveSession>({url: `/live-classes/${id}/end`, method: "POST"}),
};