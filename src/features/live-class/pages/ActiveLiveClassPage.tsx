import { useState } from "react";
import { useParams } from "react-router-dom";
import { Room } from "livekit-client";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { useLiveClassRoom } from "@/features/live-class/hooks/useLiveClassRoom";
import { ClassroomLayout } from "@/features/live-class/layouts/ClassroomLayout";
import { LoadingState } from "@/features/live-class/components/shared/LoadingState";
import { ErrorState } from "@/features/live-class/components/shared/ErrorState";
import { useLiveClassByRoomName } from "@/pages/Live-Classes/hooks/useLiveClass";
import "@livekit/components-styles";
import ClassRoomLayoutNew from "../layouts/ClassRoomLayoutNew";
export default function ActiveLiveClassPage() {
  const { roomName } = useParams<{ roomName: string }>();

  if (!roomName) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <ErrorState
          title="Failed to join"
          message="Could not connect to the live class due to invalid room name. Please try with correct room name again."
        />
      </div>
    )
  }

  const [room] = useState(() => new Room());

  const { data: liveSession } = useLiveClassByRoomName(roomName);
  const teacherIdentity = liveSession?.teacher!;

  const { connectionParams, isJoining, error, retry } = useLiveClassRoom(room, teacherIdentity, roomName);

  if (isJoining) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <LoadingState message="Joining live class..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <ErrorState
          title="Failed to join"
          message={error.message || "Could not connect to the live class. Please try again."}
          onRetry={retry}
        />
      </div>
    );
  }

  return (
    <LiveKitRoom
      token={connectionParams?.token}
      serverUrl={connectionParams?.serverUrl}
      connect={!!connectionParams}
      room={room}
      options={{
        adaptiveStream: true,
        dynacast: true,
      }}
    >
      {/* <ClassroomLayout /> */}
      {/* <VideoConference /> */}
      <ClassRoomLayoutNew/>
    </LiveKitRoom>
  );
}
