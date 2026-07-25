import { useTracks } from "@livekit/components-react";
import { Track } from "livekit-client";
import type { TrackReference } from "@livekit/components-react";

/**
 * Returns screen-share tracks for the current presenter.
 *
 * The presenter is the participant occupying the main stage.
 * Initially always the teacher. Will support REPLAY in the future.
 */
export function usePresenterScreenShareTracks(
  presenterIdentity?: string | null,
): TrackReference[] {
  const screenTracks = useTracks([Track.Source.ScreenShare], {
    onlySubscribed: false,
  });

  if (!presenterIdentity) return screenTracks;

  return screenTracks.filter(
    (track) => track.participant.identity === presenterIdentity,
  );
}
