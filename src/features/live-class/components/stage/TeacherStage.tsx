import { ParticipantTile, ParticipantName } from "@livekit/components-react";
import type { TrackReference } from "@livekit/components-react";
import { cn } from "@/lib/utils";

interface TeacherStageProps {
  tracks: TrackReference[];
  className?: string;
}

export function TeacherStage({ tracks, className }: TeacherStageProps) {
  if (tracks.length === 0) return null;

  return (
    <div className={cn("relative w-full h-full", className)}>
      {tracks.slice(0, 1).map((track) => (
        <div key={track.participant.identity} className="relative w-full h-full">
          <ParticipantTile
            trackRef={track}
            className="w-full h-full [&>video]:object-cover [&>video]:w-full [&>video]:h-full rounded-xl"
          />
          <div className="absolute bottom-3 left-3">
            <ParticipantName
              participant={track.participant}
              className="text-sm font-medium text-white drop-shadow-md bg-black/40 px-2 py-1 rounded-md"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
