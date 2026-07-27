import { useMemo } from "react";
import { useConnectionState } from "@livekit/components-react";
import { ConnectionState } from "livekit-client";
import { useAppSelector } from "@/store/hooks";
import { usePresenterMediaState } from "./usePresenterMediaState";
import { usePresenterScreenShareTracks } from "./usePresenterScreenShareTracks";

export type StageState = "CONNECTING" | "WAITING" | "REPLAY_PENDING" | "BUFFERING" | "PLAYING" | "ERROR";

interface UseStageStateReturn {
  stageState: StageState;
  isPresenterJoined: boolean;
  isCameraOn: boolean;
}

export function useStageState(myIdentity?: string | null, presenterIdentity?: string | null): UseStageStateReturn {
  const connectionState = useConnectionState();
  const presenter = useAppSelector((s) => s.liveClass.presenter);

  const { isPresenterJoined, isCameraOn } = usePresenterMediaState(myIdentity, presenterIdentity);

  const screenShareTracks = usePresenterScreenShareTracks(presenterIdentity);

  const stageState = useMemo<StageState>(() => {
    if (connectionState === ConnectionState.Disconnected) return "ERROR";
    if (connectionState !== ConnectionState.Connected) return "CONNECTING";

    if (!isPresenterJoined) {
      if (presenter?.type === "REPLAY") return "REPLAY_PENDING";
      return "WAITING";
    }

    if (!isCameraOn && screenShareTracks.length === 0) return "BUFFERING";

    return "PLAYING";
  }, [
    connectionState,
    presenter?.type,
    isPresenterJoined,
    isCameraOn,
    screenShareTracks.length,
  ]);

  return { stageState, isPresenterJoined, isCameraOn };
}
