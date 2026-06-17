// import { useTracks } from "@livekit/components-react";
// import { Track } from "livekit-client";
// import type { TrackReference } from "@livekit/components-react";

// export function useTeacherTracks(
//   teacherIdentity: string | null
// ): TrackReference[] {
//   const cameraTracks = useTracks(
//     [{ source: Track.Source.Camera, withPlaceholder: true }],
//     { onlySubscribed: false }
//   );

//   if (!teacherIdentity) return [];

//   return cameraTracks.filter(
//     (track) => track.participant.identity === teacherIdentity
//   );
// }



// import { useMemo } from "react";
// import { useTracks } from "@livekit/components-react";
// import { Track } from "livekit-client";
// import type { TrackReference } from "@livekit/components-react";

// export function useTeacherTracks(
//   teacherIdentity: string | null
// ) : {
//   tracks: TrackReference[];
//   isCameraOff: boolean;
// }{
//   const cameraTracks = useTracks(
//     [{ source: Track.Source.Camera, withPlaceholder: true }],
//     { onlySubscribed: false }
//   );

//   const teacherTracks = useMemo(() => {
//     if (!teacherIdentity) {
//       return {
//         tracks: [],
//         isCameraOff: true,
//       };
//     }

//     const tracks = cameraTracks.filter(
//       (track) => track.participant.identity === teacherIdentity
//     );

//     const publication = tracks[0]?.publication;

//     const isCameraOff =
//       tracks.length === 0 ||
//       publication?.track?.isMuted ||
//       publication?.isMuted ||
//       publication?.trackInfo?.muted;

//     return {
//       tracks,
//       isCameraOff: Boolean(isCameraOff),
//     };
//   }, [cameraTracks, teacherIdentity]);

//   return teacherTracks;
// }

import { useMemo } from "react";
import { useTracks } from "@livekit/components-react";
import { Track } from "livekit-client";
import type { TrackReferenceOrPlaceholder } from "@livekit/components-react";

export function useTeacherTracks(
  teacherIdentity: string | null
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
    { onlySubscribed: false }
  );

  const teacherTracks = useMemo(() => {
    if (!teacherIdentity) {
      return {
        tracks: [],
        isCameraOff: true,
        hasAudioTrack: false,
      };
    }

    const tracks = mediaTracks.filter(
      (track) =>
        track.participant.identity === teacherIdentity &&
        track.source === Track.Source.Camera
    );

    const publication = tracks[0]?.publication;

    const isCameraOff =
      tracks.length === 0 ||
      publication?.track?.isMuted ||
      publication?.isMuted ||
      publication?.trackInfo?.muted;

    const hasAudioTrack = mediaTracks.some(
      (track) =>
        track.participant.identity === teacherIdentity &&
        track.source === Track.Source.Microphone
    );

    return {
      tracks,
      isCameraOff: Boolean(isCameraOff),
      hasAudioTrack,
    };
  }, [mediaTracks, teacherIdentity]);

  return teacherTracks;
}