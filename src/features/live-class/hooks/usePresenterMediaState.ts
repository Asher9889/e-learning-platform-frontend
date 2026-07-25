import { useMemo } from "react";
import { useParticipants, useTracks, type TrackReference } from "@livekit/components-react";
import { Track } from "livekit-client";

/**
 * Returns the media state of the current presenter (camera, mic, active student streams).
 *
 * The presenter is the participant occupying the main stage.
 * Initially always the teacher. Will support REPLAY in the future.
 */
export function usePresenterMediaState(
  _myIdentity?: string | null,
  presenterIdentity?: string | null,
) {
  const participants = useParticipants();

  const mediaTracks = useTracks(
    [
      {
        source: Track.Source.Camera,
        withPlaceholder: true,
      },
      {
        source: Track.Source.Microphone,
        withPlaceholder: true,
      },
    ],
    {
      onlySubscribed: false,
    },
  );

  return useMemo(() => {
    if (!presenterIdentity) {
      return {
        isPresenterJoined: false,
        isCameraOn: false,
        isMicOn: false,
        cameraTracks: [],
      };
    }

    const presenterParticipant = participants.find(
      (p) => p.identity === presenterIdentity,
    );

    const isPresenterJoined = !!presenterParticipant;

    const cameraTracks = mediaTracks.filter(
      (track): track is TrackReference =>
        track.participant.identity === presenterIdentity &&
        track.source === Track.Source.Camera &&
        track.publication !== undefined,
    );

    const micTracks = mediaTracks.filter(
      (track) =>
        track.participant.identity === presenterIdentity &&
        track.source === Track.Source.Microphone,
    );

    const cameraPublication = cameraTracks[0]?.publication;
    const micPublication = micTracks[0]?.publication;

    const isCameraOn =
      cameraTracks.length > 0 &&
      !cameraPublication?.isMuted &&
      !cameraPublication?.trackInfo?.muted;

    const isMicOn =
      micTracks.length > 0 &&
      !micPublication?.isMuted &&
      !micPublication?.trackInfo?.muted;

    const activeStudentStreams = mediaTracks
      .filter(
        (track): track is TrackReference =>
          track.participant.identity !== presenterIdentity &&
          track.source === Track.Source.Camera &&
          track.publication !== undefined &&
          (!track.publication.isMuted && !track.publication.trackInfo?.muted ||
            track.participant.isCameraEnabled),
      )
      .map((track) => ({
        identity: track.participant.identity,
        name: track.participant.name || track.participant.identity,
        trackReference: track,
        isCameraOn: track.participant.isCameraEnabled,
        cameraOnAt: Number(
          track.participant.attributes?.cameraOnAt || 0,
        ),
      }))
      .sort((a, b) => b.cameraOnAt - a.cameraOnAt);

    return {
      isPresenterJoined,
      isCameraOn,
      isMicOn,
      cameraTracks,
      activeStudentStreams,
    };
  }, [participants, mediaTracks, presenterIdentity]);
}
