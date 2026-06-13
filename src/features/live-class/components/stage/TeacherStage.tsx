import { ParticipantTile, ParticipantName } from "@livekit/components-react";
import type { TrackReference } from "@livekit/components-react";
import { cn } from "@/lib/utils";

interface TeacherStageProps {
  tracks: TrackReference[];
  className?: string;
}
function AudioBars({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-end gap-[2px] ${className}`}>
      {[6, 12, 8, 15, 6].map((h, i) => (
        <div
          key={i}
          className="w-[3px] rounded-sm bg-emerald-500"
          style={{
            height: `${h}px`,
            animation: `audioPulse 0.8s ${i * 0.15}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}
export function TeacherStage({ tracks, className }: TeacherStageProps) {
// const isCameraOff =
//   tracks?.participant?.videoTrackPublications;
  const cameraPub = tracks?.participant?.getTrackPublication(
  Track.Source.Camera
  
);
console.log(
  tracks.map((t) => ({
    source: t.source,
    participant: t.participant.identity,
  })),"anubhavanubhav"
);

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
