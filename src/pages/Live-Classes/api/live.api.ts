import { apiEndPoints } from "@/config";
import type { TStartLiveClassInput } from "../schema/live.schema";
import type { IActiveLiveSession, IJoinLiveClassResponse, ILiveClassesStats, ILiveSession, IUpcomingLiveClassesResponse, LiveClassFilters } from "../types";

import apiRequest from "@/lib/request";
import type { Method } from "axios";

const { UPCOMING, COMPLETED, START, ACTIVE, GET_BY_ROOM_NAME, JOIN ,STATS } = apiEndPoints.LIVE_CLASSES; 

export const liveClassApi = {
  getStats: () => apiRequest<ILiveClassesStats>({url: STATS.url, method: STATS.method}),

  getActive: (filters?: LiveClassFilters) => apiRequest<IUpcomingLiveClassesResponse>({url: ACTIVE.url, method: ACTIVE.method, params: { ...ACTIVE.params, ...filters }}),

  getUpcoming: (filters?: LiveClassFilters) => apiRequest<IUpcomingLiveClassesResponse>({url: UPCOMING.url, method: UPCOMING.method, params: { ...UPCOMING.params, ...filters }}),

  getCompleted: (filters?: LiveClassFilters) => apiRequest<IUpcomingLiveClassesResponse>({url: COMPLETED.url, method: COMPLETED.method, params: { ...COMPLETED.params, ...filters }}),

  getById: (id: string) => apiRequest<IUpcomingLiveClassesResponse>({url: `/live-classes/${id}`}),

  getByRoomName: (roomName: string) => apiRequest<IActiveLiveSession>({url: GET_BY_ROOM_NAME(roomName).url, method: GET_BY_ROOM_NAME(roomName).method}),

  create: (data: TStartLiveClassInput) => apiRequest({ url: "/live-classes", method: "POST",data}),

  start: (id: string) =>apiRequest<{id: string, roomName: string}>({
      url: START(id).url,
      method: START(id).method as Method, 
    }),

  join: (roomName: string) => apiRequest<IJoinLiveClassResponse>({
      url: JOIN(roomName).url,
      method: JOIN(roomName).method as Method,
    }),

  end: (id: string) => apiRequest<ILiveSession>({url: `/live-classes/${id}/end`, method: "POST"}),
};