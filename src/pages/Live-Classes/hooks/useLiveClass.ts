import { useMutation, useQuery } from "@tanstack/react-query";
import { liveClassApi } from "../api/live.api";
import type { TStartLiveClassInput, TJoinLiveClassInput } from "../schema/live.schema";

export const useUpcomingLiveClasses = () => {
  return useQuery({
    queryKey: ["live-classes", "upcoming"],
    queryFn: () => liveClassApi.getUpcoming(),
  });
};


export const useActiveLiveClasses = () => {
  return useQuery({
    queryKey: ["live-classes", "active"],
    queryFn: () => liveClassApi.getActive(),
  });
}


export const useLiveClass = (id: string) => {
  return useQuery({
    queryKey: ["live-classes", id],
    queryFn: () => liveClassApi.getById(id),
    enabled: Boolean(id),
  });
};

export const useCreateLiveClass = () => {
  return useMutation({
    mutationFn: (data: TStartLiveClassInput) =>
      liveClassApi.create(data),
  });
};

export const useStartLiveClass = () => {
  return useMutation({
    mutationFn: (id: string) => liveClassApi.start(id),
  });
};

export const useJoinLiveClass = () => {
  return useMutation({
    mutationFn: (roomName: string) => liveClassApi.join(roomName),
  });
};

export const useEndLiveClass = () => {
  return useMutation({
    mutationFn: (id: string) =>
      liveClassApi.end(id),
  });
};