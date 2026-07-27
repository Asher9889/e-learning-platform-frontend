import { useState } from "react";
import { useParams } from "react-router-dom";
import { Room } from "livekit-client";
import { LiveKitRoom } from "@livekit/components-react";
import { useLiveClassRoom } from "@/features/live-class/hooks/useLiveClassRoom";
import { JoiningScreen } from "@/features/live-class/components/shared/JoiningScreen";
import { ErrorState } from "@/features/live-class/components/shared/ErrorState";
import { useLiveClassByRoomName } from "@/pages/Live-Classes/hooks/useLiveClass";
import "@livekit/components-styles";
import ClassRoomLayoutNew from "../layouts/ClassRoomLayoutNew";

export default function ActiveLiveClassPage() {
  const { roomName } = useParams<{ roomName: string }>();
  const [room] = useState(() => new Room());
  const { data: liveSession, error: sessionError } = useLiveClassByRoomName(roomName ?? ""); // Fetch live session details based on room name
  const teacherIdentity = liveSession?.teacher;

  const { connectionParams, joinStep, error, retry, status } = useLiveClassRoom(room, teacherIdentity, roomName, sessionError); // start joining to livekit room

  if (!roomName) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <ErrorState
          title="Failed to join"
          message="Could not connect to the live class due to invalid room name. Please try with correct room name again."
        />
      </div>
    );
  }

  if (joinStep === "error") {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <ErrorState
          title="Failed to join"
          message={error?.message || "Could not connect to the live class. Please try again."}
          onRetry={retry}
          statusCode={status}
        />
      </div>
    );
  }

  if (joinStep !== "ready") {
    return <JoiningScreen step={joinStep} />;
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
      <ClassRoomLayoutNew />
    </LiveKitRoom>
  );
}
