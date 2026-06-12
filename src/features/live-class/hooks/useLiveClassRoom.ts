import { useCallback, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
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
import type {
  ChatMessage,
  LiveKitConnectionParams,
} from "@/features/live-class/types";
import type { Room } from "livekit-client";

interface UseLiveClassRoomReturn {
  connectionParams: LiveKitConnectionParams | null;
  isJoining: boolean;
  error: Error | null;
  joinRoom: (roomName: string) => void;
  leaveRoom: () => void;
}

export function useLiveClassRoom(
  room: Room | null,
  teacherIdentity: string | null
): UseLiveClassRoomReturn {
  const dispatch = useAppDispatch();
  const [connectionParams, setConnectionParams] =
    useState<LiveKitConnectionParams | null>(null);

  const joinMutation = useMutation({
    mutationFn: (roomName: string) => liveClassApi.join(roomName),
    onSuccess: (data) => {
      const { liveKit, liveClass } = data;
      setConnectionParams({
        token: liveKit.token,
        serverUrl: liveKit.serverURL,
        roomName: liveKit.roomName,
      });

      dispatch(setRoomName(liveKit.roomName));
      dispatch(setParticipantIdentity(liveClass.participantId));
      dispatch(
        setParticipantRole(
          liveClass.participantRole as "teacher" | "student"
        )
      );
      if (teacherIdentity) {
        dispatch(setTeacherIdentity(teacherIdentity));
      }
    },
  });

  useEffect(() => {
    if (!room) return;

    const handleConnected = () => {
      dispatch(setConnected(true));
    };

    const handleDisconnected = () => {
      dispatch(setConnected(false));
    };

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

  const joinRoom = useCallback(
    (roomName: string) => {
      joinMutation.mutate(roomName);
    },
    [joinMutation]
  );

  const leaveRoom = useCallback(() => {
    room?.disconnect();
    setConnectionParams(null);
    dispatch(setConnected(false));
  }, [room, dispatch]);

  return {
    connectionParams,
    isJoining: joinMutation.isPending,
    error: joinMutation.error,
    joinRoom,
    leaveRoom,
  };
}
