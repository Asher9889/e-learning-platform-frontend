import { useTracks } from "@livekit/components-react";
import { Track } from "livekit-client";
import type { TrackReference } from "@livekit/components-react";

export function useStudentTracks(
  teacherIdentity: string | null
): TrackReference[] {
  const cameraTracks = useTracks(
    [{ source: Track.Source.Camera, withPlaceholder: true }],
    { onlySubscribed: false }
  );

  if (!teacherIdentity) return cameraTracks;

  return cameraTracks.filter(
    (track) => track.participant.identity !== teacherIdentity
  );
}
