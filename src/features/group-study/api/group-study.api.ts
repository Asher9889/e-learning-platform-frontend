

import { api } from "@/config";
import type { IGroupStudyRoom, IGroupStudyRoomsResponse, IGroupStudyStats, ILiveKitJoinData, TRoomFilter } from "../types/group-study.types";
import type { TCreateGroupStudyRoomForm, TUpdateGroupStudyRoomForm } from "../schemas/group-study.schema";

// backend ApiResponse wraps everything as { success, message, data }
interface IApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

const BASE_URL = "/group-study";

export interface IGetRoomsParams {
  page?: number;
  limit?: number;
  search?: string;
  filter?: TRoomFilter;
  subject?: string;
}

export const groupStudyApi = {
  createRoom: async (payload: TCreateGroupStudyRoomForm) => {
    const { data } = await api.post<IApiEnvelope<IGroupStudyRoom>>(BASE_URL, payload);
    return data.data;
  },

  getRooms: async (params: IGetRoomsParams) => {
    const { data } = await api.get<IGroupStudyRoomsResponse>(BASE_URL, {
      params,
    });
    console.log(data,"api roomsrooms");
    return data;
  },

  getStats: async () => {
    const { data } = await api.get<IGroupStudyStats>(`${BASE_URL}/stats`);
    return data;
  },

  joinRoom: async (roomName: string) => {
    const { data } = await api.post<ILiveKitJoinData>(
      `${BASE_URL}/${roomName}/join`
    );
    return data;
  },

  getRoomByRoomName: async (roomName: string) => {
    const { data } = await api.get<IApiEnvelope<IGroupStudyRoom>>(
      `${BASE_URL}/roomName/${roomName}`
    );
    return data.data;
  },

  updateRoom: async (id: string, payload: TUpdateGroupStudyRoomForm) => {
    const { data } = await api.patch<IApiEnvelope<IGroupStudyRoom>>(`${BASE_URL}/${id}`, payload);
    return data.data;
  },

  addMembers: async (id: string, memberIds: string[]) => {
    const { data } = await api.post<IApiEnvelope<{ id: string; members: unknown[] }>>(
      `${BASE_URL}/${id}/members`,
      { memberIds }
    );
    return data.data;
  },

  removeMember: async (id: string, userId: string) => {
    const { data } = await api.delete<IApiEnvelope<{ id: string; members: unknown[] }>>(
      `${BASE_URL}/${id}/members/${userId}`
    );
    return data.data;
  },

  endRoom: async (id: string) => {
    const { data } = await api.post<IApiEnvelope<IGroupStudyRoom>>(`${BASE_URL}/${id}/end`);
    return data.data;
  },
};
