import { useTracks, type TrackReferenceOrPlaceholder } from "@livekit/components-react";
import { Track } from "livekit-client";

/**
 * Returns camera tracks for all non-presenter participants (students).
 *
 * Filters out the current presenter. Initially the presenter is always
 * the teacher. Will support REPLAY in the future.
 */
export function useStudentTracks(
  presenterIdentity: string | null,
): TrackReferenceOrPlaceholder[] {
  const cameraTracks = useTracks(
    [{ source: Track.Source.Camera, withPlaceholder: true }],
    { onlySubscribed: false },
  );

  if (!presenterIdentity) return cameraTracks;

  return cameraTracks.filter(
    (track) => track.participant.identity !== presenterIdentity,
  );
}
