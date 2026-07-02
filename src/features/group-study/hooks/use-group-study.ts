import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { groupStudyApi, type IGetRoomsParams } from "../api/group-study.api";
import type { TCreateGroupStudyRoomForm, TUpdateGroupStudyRoomForm } from "../schemas/group-study.schema";
import { sileo } from "sileo";

export const groupStudyKeys = {
  all: ["group-study"] as const,
  lists: () => [...groupStudyKeys.all, "list"] as const,
  list: (params: IGetRoomsParams) => [...groupStudyKeys.lists(), params] as const,
  stats: () => [...groupStudyKeys.all, "stats"] as const,
  detail: (roomName: string) => [...groupStudyKeys.all, "detail", roomName] as const,
};

export const useGroupStudyRooms = (params: IGetRoomsParams) => {
  return useQuery({
    queryKey: groupStudyKeys.list(params),
    queryFn: () => groupStudyApi.getRooms(params),
    placeholderData: (prev) => prev,
  });
};

export const useGroupStudyStats = () => {
  return useQuery({
    queryKey: groupStudyKeys.stats(),
    queryFn: () => groupStudyApi.getStats(),
  });
};

export const useGroupStudyRoomByName = (roomName: string | undefined) => {
  return useQuery({
    queryKey: groupStudyKeys.detail(roomName ?? ""),
    queryFn: () => groupStudyApi.getRoomByRoomName(roomName as string),
    enabled: !!roomName,
  });
};

export const useCreateGroupStudyRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TCreateGroupStudyRoomForm) => groupStudyApi.createRoom(payload),
    onSuccess: () => {
      sileo.success({ title: "Study Room Created", description: "Study room created successfully"});
      queryClient.invalidateQueries({ queryKey: groupStudyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: groupStudyKeys.stats() });
    },
    onError: () => {
      console.error("Failed to create study room");
    },
  });
};

export const useJoinGroupStudyRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roomName: string) => groupStudyApi.joinRoom(roomName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupStudyKeys.lists() });
    },
    onError: (error: any) => {
      console.error(error?.response?.data?.message ?? "Failed to join study room");
    },
  });
};

export const useUpdateGroupStudyRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: TUpdateGroupStudyRoomForm }) =>
      groupStudyApi.updateRoom(id, payload),
    onSuccess: () => {
      sileo.success({ title: "Study Room Updated", description: "Study room updated"});
      queryClient.invalidateQueries({ queryKey: groupStudyKeys.lists() });
    },
    onError: (error: any) => {
      console.error(error?.response?.data?.message ?? "Failed to update study room");
    },
  });
};

export const useAddRoomMembers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, memberIds }: { id: string; memberIds: string[] }) =>
      groupStudyApi.addMembers(id, memberIds),
    onSuccess: () => {
      sileo.success({ title: "Members Added", description: "Members added"});
      queryClient.invalidateQueries({ queryKey: groupStudyKeys.lists() });
    },
    onError: (error: any) => {
      console.error(error?.response?.data?.message ?? "Failed to add members");
    },
  });
};

export const useRemoveRoomMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) =>
      groupStudyApi.removeMember(id, userId),
    onSuccess: () => {
      sileo.success({ title: "Member Removed", description: "Member removed"});
      queryClient.invalidateQueries({ queryKey: groupStudyKeys.lists() });
    },
    onError: (error: any) => {
      console.error(error?.response?.data?.message ?? "Failed to remove member");
    },
  });
};

export const useEndGroupStudyRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => groupStudyApi.endRoom(id),
    onSuccess: () => {
      sileo.success({ title: "Study Room Ended", description: "Study room ended"});
      queryClient.invalidateQueries({ queryKey: groupStudyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: groupStudyKeys.stats() });
    },
    onError: (error: any) => {
      console.error(error?.response?.data?.message ?? "Failed to end study room");
    },
  });
};
