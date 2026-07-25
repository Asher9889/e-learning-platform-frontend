import { useMemo } from "react";
import { useTracks } from "@livekit/components-react";
import { Track } from "livekit-client";
import type { TrackReferenceOrPlaceholder } from "@livekit/components-react";

/**
 * Returns the camera and microphone track state for the current presenter.
 *
 * The presenter is the participant occupying the main stage.
 * Initially always the teacher. Will support REPLAY in the future.
 */
export function usePresenterTracks(
  presenterIdentity: string | null,
): {
  tracks: TrackReferenceOrPlaceholder[];
  isCameraOff: boolean;
  hasAudioTrack: boolean;
} {
  const mediaTracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.Microphone, withPlaceholder: true },
    ],
    { onlySubscribed: false },
  );

  const presenterTracks = useMemo(() => {
    if (!presenterIdentity) {
      return {
        tracks: [],
        isCameraOff: true,
        hasAudioTrack: false,
      };
    }

    const tracks = mediaTracks.filter(
      (track) =>
        track.participant.identity === presenterIdentity &&
        track.source === Track.Source.Camera,
    );

    const publication = tracks[0]?.publication;

    const isCameraOff =
      tracks.length === 0 ||
      publication?.track?.isMuted ||
      publication?.isMuted ||
      publication?.trackInfo?.muted;

    const hasAudioTrack = mediaTracks.some(
      (track) =>
        track.participant.identity === presenterIdentity &&
        track.source === Track.Source.Microphone,
    );

    return {
      tracks,
      isCameraOff: Boolean(isCameraOff),
      hasAudioTrack,
    };
  }, [mediaTracks, presenterIdentity]);

  return presenterTracks;
}
