import type {
  TLiveClass,
  TStartLiveClassInput,
  TJoinLiveClassInput,
} from "../schema/live.schema";

import apiRequest from "@/lib/request";

export const liveClassApi = {
  
  getUpcoming: () => apiRequest<TLiveClass[]>({url: "/live-classes/upcoming"}),

  getById: (id: string) => apiRequest<TLiveClass>({url: `/live-classes/${id}`}),

  create: (data: TStartLiveClassInput) => apiRequest<TLiveClass, TStartLiveClassInput>({ url: "/live-classes", method: "POST",data}),

  start: (id: string) =>apiRequest< TLiveClass & {
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

  end: (id: string) => apiRequest<TLiveClass>({url: `/live-classes/${id}/end`, method: "POST"}),
};