import { useMutation, useQuery } from "@tanstack/react-query";
import { liveClassApi } from "../api/live.api";
import type { TStartLiveClassInput, TJoinLiveClassInput } from "../schema/live.schema";
import type { LiveClassFilters } from "../types";

export const useUpcomingLiveClasses = (filters?: LiveClassFilters) => {
  return useQuery({
    queryKey: ["live-classes", "upcoming", filters],
    queryFn: () => liveClassApi.getUpcoming(filters),
  });
};


export const useActiveLiveClasses = (filters?: LiveClassFilters) => {
  return useQuery({
    queryKey: ["live-classes", "active", filters],
    queryFn: () => liveClassApi.getActive(filters),
  });
};

export const useCompletedLiveClasses = (filters?: LiveClassFilters) => {
  return useQuery({
    queryKey: ["live-classes", "completed", filters],
    queryFn: () => liveClassApi.getCompleted(filters),
  });
};


export const useLiveClass = (id: string) => {
  return useQuery({
    queryKey: ["live-classes", id],
    queryFn: () => liveClassApi.getById(id),
    enabled: Boolean(id),
  });
};

export const useLiveClassByRoomName = (roomName: string) => {
  return useQuery({
    queryKey: ["live-classes", "room", roomName],
    queryFn: () => liveClassApi.getByRoomName(roomName),
    enabled: Boolean(roomName),
  });
}

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