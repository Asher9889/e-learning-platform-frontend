import { useTracks } from "@livekit/components-react";
import { Track } from "livekit-client";
import type { TrackReference } from "@livekit/components-react";

export function useScreenShareTracks(
  teacherIdentity?: string | null
): TrackReference[] {
  const screenTracks = useTracks([Track.Source.ScreenShare], {
    onlySubscribed: false,
  });

  if (!teacherIdentity) return screenTracks;

  return screenTracks.filter(
    (track) => track.participant.identity === teacherIdentity
  );
}
