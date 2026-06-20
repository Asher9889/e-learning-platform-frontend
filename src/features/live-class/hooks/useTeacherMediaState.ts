import { useMemo } from "react";
import { useParticipants, useTracks, type TrackReference } from "@livekit/components-react";
import { Track } from "livekit-client";

export function useTeacherMediaState(_myIdentity?: string | null, teacherIdentity?: string | null) {
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
console.log(mediaTracks,"mediaTracks7451298645")
    const activeStudentStreams = mediaTracks
      .filter(
        (track): track is TrackReference =>
          track.participant.identity !== teacherIdentity
         && track.source === Track.Source.Camera
         && track.publication !== undefined 
          && (
        (!track.publication.isMuted && !track.publication.trackInfo?.muted)
        || track.participant.isCameraEnabled   // 👈 ye add kiya
      )
      )
      .map((track) => ({
        identity: track.participant.identity,
        name: track.participant.name || track.participant.identity,
        trackReference: track, // same type as cameraTracks[i]
        isCameraOn: track.participant.isCameraEnabled,
        cameraOnAt: Number(
      track.participant.attributes?.cameraOnAt || 0
    ),
      }))
      .sort((a, b) => b.cameraOnAt - a.cameraOnAt);

    console.log(activeStudentStreams, "activeStudentStreamsac ", participants)
    console.log(
  mediaTracks.map((track) => ({
    participant: track.participant.identity !== teacherIdentity,
    source:track.source === Track.Source.Camera,
    type:track.source,
    name:  track.participant.name || track.participant.identity,
    publication: track.publication !== undefined,
    publicationdata: track.publication,

    isMuted: track.publication !== undefined && !track.publication.isMuted,
    trackInfoMuted: track.publication !== undefined && !track.publication.trackInfo?.muted ,
  })),"awdjgawjdgakjwdkjahwdkjhakwjhdkjahdkhakwhdkhaw CAMERA_OFF_ALL_1",activeStudentStreams
);
    return {
      isTeacherJoined,
      isCameraOn,
      isMicOn,
      cameraTracks,
      activeStudentStreams
    };
  }, [participants, mediaTracks, teacherIdentity]);
}