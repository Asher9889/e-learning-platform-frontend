import { useCallback, useRef, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { Maximize2, Minimize2 } from "lucide-react";
import { useRoomContext } from "@livekit/components-react";
import { cn } from "#lib/utils";
import type { LocalParticipant, RemoteParticipant } from "livekit-client";
import { useStageState } from "../../hooks/useStageState";
import { StageConnecting } from "./states/StageConnecting";
import { StageWaiting } from "./states/StageWaiting";
import { StageReplayPending } from "./states/StageReplayPending";
import { StageBuffering } from "./states/StageBuffering";
import { StageError } from "./states/StageError";
import { StagePlaying } from "./states/StagePlaying";

interface MainStageNewProps {
  participants: (RemoteParticipant | LocalParticipant)[];
}

function MainStageNew(props: MainStageNewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const room = useRoomContext();

  const presenter = useAppSelector((s) => s.liveClass.presenter);
  const myIdentity = useAppSelector((s) => s?.auth?.user);
  const presenterIdentity = presenter?.identity ?? null;

  const { stageState } = useStageState(myIdentity?.id, presenterIdentity);

  const handleFullscreenToggle = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current?.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  }, []);

  const handleRetry = useCallback(() => {
    room.reconnect().catch(() => {
      // reconnect failed — user can try again
    });
  }, [room]);

  let content: React.ReactNode;

  switch (stageState) {
    case "CONNECTING":
      content = <StageConnecting />;
      break;
    case "WAITING":
      content = <StageWaiting />;
      break;
    case "REPLAY_PENDING":
      content = <StageReplayPending />;
      break;
    case "BUFFERING":
      content = <StageBuffering />;
      break;
    case "ERROR":
      content = <StageError onRetry={handleRetry} />;
      break;
    case "PLAYING":
      content = <StagePlaying participants={props.participants} />;
      break;
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
    >
      <button
        onClick={handleFullscreenToggle}
        title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        className={cn(
          "absolute top-2 right-2 z-10",
          "w-8 h-8 rounded-lg",
          "flex items-center justify-center",
          "bg-black/40 hover:bg-black/65 backdrop-blur-sm",
          "text-white transition-all duration-150",
          "focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/50"
        )}
      >
        {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
      </button>
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-full h-full rounded-xl border border-violet-200 bg-white relative overflow-hidden shadow-sm">
          {content}
        </div>
      </div>
    </div>
  );
}

export default MainStageNew;
