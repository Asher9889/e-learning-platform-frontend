import type { TrackReference } from "@livekit/components-react";
import { ParticipantTile, ParticipantName } from "@livekit/components-react";
import { cn } from "@/lib/utils";

interface ParticipantsGridProps {
  tracks: TrackReference[];
  className?: string;
}

export function ParticipantsGrid({ tracks, className }: ParticipantsGridProps) {
  if (tracks.length === 0) return null;

  return (
    <div
      className={cn(
        "grid gap-2",
        tracks.length <= 1 && "grid-cols-1",
        tracks.length === 2 && "grid-cols-2",
        tracks.length >= 3 && "grid-cols-2 sm:grid-cols-3",
        className
      )}
    >
      {tracks.map((track) => (
        <div
          key={track.participant.identity}
          className="relative aspect-video rounded-lg overflow-hidden bg-muted"
        >
          <ParticipantTile
            trackRef={track}
            className="w-full h-full [&>video]:object-cover [&>video]:w-full [&>video]:h-full"
          />
          <div className="absolute bottom-2 left-2">
            <ParticipantName
              participant={track.participant}
              className="text-xs font-medium text-white drop-shadow-md bg-black/40 px-2 py-0.5 rounded"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
