import { useMemo } from "react";
import { useParticipants, useTracks, type TrackReference } from "@livekit/components-react";
import { Track } from "livekit-client";

export function useTeacherMediaState(myIdentity?: string | null,teacherIdentity?: string | null) {
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
  }
);
  return useMemo(() => {
    if (!teacherIdentity) {
      return {
        isTeacherJoined: false,
        isCameraOn: false,
        isMicOn: false,
        cameraTracks: [],
      };
    }

    const teacherParticipant = participants.find(
      (p) => p.identity === teacherIdentity
    );

    const isTeacherJoined = !!teacherParticipant;

  const cameraTracks = mediaTracks.filter(
  (track): track is TrackReference =>
    track.participant.identity === teacherIdentity &&
    track.source === Track.Source.Camera &&
    track.publication !== undefined
);

    const micTracks = mediaTracks.filter(
      (track) =>
        track.participant.identity === teacherIdentity &&
        track.source === Track.Source.Microphone
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

    return {
      isTeacherJoined,
      isCameraOn,
      isMicOn,
      cameraTracks,
    };
  }, [participants, mediaTracks, teacherIdentity]);
}