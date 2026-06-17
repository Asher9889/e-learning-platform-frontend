import { useTracks, type TrackReferenceOrPlaceholder } from "@livekit/components-react";
import { Track } from "livekit-client";

export function useStudentTracks(
  teacherIdentity: string | null
): TrackReferenceOrPlaceholder[] {
  const cameraTracks = useTracks(
    [{ source: Track.Source.Camera, withPlaceholder: true }],
    { onlySubscribed: false }
  );

  if (!teacherIdentity) return cameraTracks;

  return cameraTracks.filter(
    (track) => track.participant.identity !== teacherIdentity
  );
}
