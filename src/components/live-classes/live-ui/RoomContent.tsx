import { ParticipantName, ParticipantTile, TrackLoop, useTracks } from "@livekit/components-react";
import { Track } from "livekit-client";

function RoomContent() {
  const tracks = useTracks([
    {
      source: Track.Source.Camera,
      withPlaceholder: true,
    },
  ]);

  return (
    <>

      <TrackLoop tracks={tracks}>
        <ParticipantTile>
          <ParticipantName />
        </ParticipantTile>
      </TrackLoop>
    </>
  );
}

export default RoomContent;