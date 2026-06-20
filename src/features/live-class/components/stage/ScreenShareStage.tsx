import {  VideoTrack } from "@livekit/components-react";
import type { TrackReference } from "@livekit/components-react";
import { Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScreenShareStageProps {
  tracks: TrackReference[];
  className?: string;
}

export function ScreenShareStage({ tracks, className }: ScreenShareStageProps) {
  if (tracks.length === 0) return null;

  return (
    <div className={cn("relative w-full h-full", className)}>
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-black/50 text-white text-xs font-medium px-2.5 py-1 rounded-full">
        <Monitor className="w-3.5 h-3.5" />
        Screen Share
      </div>
      {tracks.slice(0, 1).map((track) => (
        <VideoTrack
          key={track.participant.identity}
          trackRef={track}
          className="w-full h-full [&>video]:object-contain [&>video]:w-full [&>video]:h-full rounded-xl bg-black/40"
        />
      ))}
    </div>
  );
}
