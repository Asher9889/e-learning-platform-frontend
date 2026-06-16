import { useCallback, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { liveClassApi } from "@/pages/Live-Classes/api/live.api";
import { useAppDispatch } from "@/store/hooks";
import {
  setConnected,
  setParticipantIdentity,
  setParticipantRole,
  setRoomName,
  setTeacherIdentity,
  addMessage,
} from "@/features/live-class/store/liveClass.slice";
import type { ChatMessage, ITeacherIdentity, LiveKitConnectionParams } from "@/features/live-class/types";
import type { Room } from "livekit-client";

interface UseLiveClassRoomReturn {
  connectionParams: LiveKitConnectionParams | null;
  isJoining: boolean;
  error: Error | null;
  retry: () => void;
  leaveRoom: () => void;
}

export function useLiveClassRoom(room: Room, teacherIdentity?: ITeacherIdentity, roomName?: string): UseLiveClassRoomReturn {
  const dispatch = useAppDispatch();

  const enabled = Boolean(roomName) && Boolean(teacherIdentity);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["live-classes", "join", roomName],
    queryFn: () => liveClassApi.join(roomName!),
    enabled,
    retry: false,
    staleTime: Infinity,
  });

  const connectionParams = useMemo<LiveKitConnectionParams | null>(() => {
    if (!data) return null;
    return {
      token: data.liveKit.token,
      serverUrl: data.liveKit.serverURL,
      roomName: data.liveKit.roomName,
    };
  }, [data]);

  useEffect(() => {
    if (!data) return;
    const { liveKit, liveClass } = data;

    dispatch(setRoomName(liveKit.roomName));
    dispatch(setParticipantIdentity(liveClass.participantId));
    dispatch(setParticipantRole(liveClass.participantRole as "TEACHER" | "STUDENT" | "ADMIN"));
    if (teacherIdentity) dispatch(setTeacherIdentity(teacherIdentity));
  }, [data, dispatch, teacherIdentity]);

  useEffect(() => {
    if (!room && !teacherIdentity) return;

    const handleConnected = () => dispatch(setConnected(true));
    const handleDisconnected = () => dispatch(setConnected(false));
    const handleDataReceived = (payload: Uint8Array) => {
      try {
        const text = new TextDecoder().decode(payload);
        const message: ChatMessage = JSON.parse(text);
        dispatch(addMessage(message));
      } catch {
        // ignore malformed messages
      }
    };

    room.on("connected", handleConnected);
    room.on("disconnected", handleDisconnected);
    room.on("dataReceived", handleDataReceived);

    return () => {
      room.off("connected", handleConnected);
      room.off("disconnected", handleDisconnected);
      room.off("dataReceived", handleDataReceived);
    };
  }, [room, dispatch]);

  const leaveRoom = useCallback(() => {
    room?.disconnect();
    dispatch(setConnected(false));
  }, [room, dispatch]);

  return {
    connectionParams,
    isJoining: !enabled || isLoading || !connectionParams,
    error: error as Error | null,
    retry: () => refetch(),
    leaveRoom,
  };
}
