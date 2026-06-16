import { ParticipantTile, ParticipantName } from "@livekit/components-react";
import type { TrackReference } from "@livekit/components-react";
import { cn } from "@/lib/utils";

interface TeacherStageProps {
  tracks: TrackReference[];
  className?: string;
}

export function TeacherStage({ tracks, className }: TeacherStageProps) {
  return (
    <div className={cn("relative w-full h-full", className)}>
      {tracks.slice(0, 1).map((track) => (
        <div key={track.participant.identity} className="relative w-full h-full">
          <ParticipantTile
            trackRef={track}
            className="w-full h-full [&>video]:object-cover [&>video]:w-full [&>video]:h-full rounded-xl"
          />

          {/*
            Name overlay — sits above video, never clips:
            - max-w-[calc(100%-1.5rem)] keeps it from touching the edges
            - truncate handles very long names gracefully
            - text-[clamp(...)] scales between 10px (tiny PiP) and 13px (full stage)
              so it's always readable but never wraps
          */}
          <div
            className={cn(
              "absolute bottom-2 left-2",
              "max-w-[calc(100%-1.5rem)]",   // never overflows container width
              "flex items-center gap-1.5 flex-shrink-0"
            )}
          >
            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md min-w-0">
              <ParticipantName
                participant={track.participant}
                className={cn(
                  "font-medium text-white drop-shadow-sm truncate",
                  // clamp: min 10px (PiP), preferred viewport-relative, max 13px (full stage)
                  "[font-size:clamp(10px,1.5cqw,13px)]"
                )}
              />
              <span
                className={cn(
                  "shrink-0 text-violet-300 font-semibold uppercase tracking-wide",
                  "[font-size:clamp(8px,1.1cqw,10px)]"
                )}
              >
                Teacher
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}