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
  setPresenter,
  addMessage,
  setClassId,
  resetClassroom,
} from "@/features/live-class/store/liveClass.slice";
import type { ChatMessage, ITeacherIdentity, LiveKitConnectionParams } from "@/features/live-class/types";
import type { Room } from "livekit-client";

export type JoinStep =
  | "fetching_session"
  | "fetching_token"
  | "ready"
  | "error";

interface UseLiveClassRoomReturn {
  connectionParams: LiveKitConnectionParams | null;
  joinStep: JoinStep;
  isJoining: boolean;
  error: Error | null;
  retry: () => void;
  leaveRoom: () => void;
  status: number | undefined;
}

export function useLiveClassRoom(
  room: Room,
  teacherIdentity?: ITeacherIdentity,
  roomName?: string,
  sessionError?: Error | null,
): UseLiveClassRoomReturn {
  const dispatch = useAppDispatch();

  const enabled = Boolean(roomName) && Boolean(teacherIdentity);

  const { data, error, refetch } = useQuery({
    queryKey: ["live-classes", "join", roomName],
    queryFn: () => liveClassApi.join(roomName!),
    enabled,
    retry: false,
    staleTime: 0,
  });

  const apiError = error as (Error & { statusCode?: number }) | null;

  const statusCode = apiError?.statusCode;

  const isErrorState = !!error;
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
    console.log(data, "classsc")
    dispatch(setRoomName(liveKit.roomName));
    dispatch(setParticipantIdentity(liveClass.participantId));
    dispatch(setParticipantRole(liveClass.participantRole as "TEACHER" | "STUDENT" | "ADMIN"));
    dispatch(setClassId(liveClass.id));
    if (teacherIdentity) {
      dispatch(setTeacherIdentity(teacherIdentity));
      dispatch(setPresenter({
        identity: teacherIdentity.id,
        type: "TEACHER",
        name: teacherIdentity.name,
        profileImage: teacherIdentity.profileImage,
      }));
    }
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

  const joinStep = useMemo<JoinStep>(() => {
    if (isErrorState) return "error";
    if (sessionError) return "error";
    if (!teacherIdentity) return "fetching_session";
    if (!connectionParams) return "fetching_token";
    return "ready";
  }, [teacherIdentity, connectionParams, isErrorState, sessionError]);

  useEffect(() => {
    return () => {
      dispatch(resetClassroom());
    };
  }, [dispatch]);

  return {
    connectionParams,
    joinStep,
    isJoining: joinStep !== "ready",
    error: sessionError ?? (error as Error | null),
    status: statusCode,
    retry: () => refetch(),
    leaveRoom,
  };
}
