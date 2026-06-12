import { useTracks } from "@livekit/components-react";
import { Track } from "livekit-client";
import { useAppSelector } from "@/store/hooks";
import { useScreenShareTracks } from "@/features/live-class/hooks/useScreenShareTracks";
import { useTeacherTracks } from "@/features/live-class/hooks/useTeacherTracks";
import { ScreenShareStage } from "./ScreenShareStage";
import { TeacherStage } from "./TeacherStage";
import { EmptyState } from "@/features/live-class/components/shared/EmptyState";
import { User } from "lucide-react";

export function MainStage() {
  const teacherIdentity = useAppSelector(
    (state) => state.liveClass.teacherIdentity
  );

  const screenShareTracks = useScreenShareTracks(teacherIdentity);
  const teacherCameraTracks = useTeacherTracks(teacherIdentity);

  const allCameraTracks = useTracks(
    [{ source: Track.Source.Camera, withPlaceholder: true }],
    { onlySubscribed: false }
  );

  const hasScreenShare = screenShareTracks.length > 0;
  const hasTeacherCamera = teacherCameraTracks.length > 0;
  const hasAnyCamera = allCameraTracks.length > 0;

  if (hasScreenShare) {
    return (
      <div className="w-full h-full">
        <ScreenShareStage tracks={screenShareTracks} className="w-full h-full" />
      </div>
    );
  }

  if (hasTeacherCamera) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-full max-w-3xl aspect-video">
          <TeacherStage
            tracks={teacherCameraTracks}
            className="w-full h-full"
          />
        </div>
      </div>
    );
  }

  if (hasAnyCamera) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-full max-w-3xl aspect-video">
          <TeacherStage
            tracks={allCameraTracks.slice(0, 1)}
            className="w-full h-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <EmptyState
        icon={User}
        title="Waiting for teacher"
        description="The class hasn't started yet. Stay tuned!"
        className="max-w-md"
      />
    </div>
  );
}
