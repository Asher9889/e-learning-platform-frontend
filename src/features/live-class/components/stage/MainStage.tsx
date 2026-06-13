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

  const myIdententity = useAppSelector(
    (state) => state?.auth?.user
  );
  const screenShareTracks = useScreenShareTracks(teacherIdentity);
  const teacherCameraTracks = useTeacherTracks(teacherIdentity?.id);
  const myCameraTracks = useTeacherTracks(myIdententity?.id);


  const allCameraTracks = useTracks(
    [{ source: Track.Source.Camera, withPlaceholder: true }],
    { onlySubscribed: false }
  );

  const hasScreenShare = screenShareTracks.length > 0;
  const hasTeacherCamera = teacherCameraTracks.length > 0;
  const hasAnyCamera = allCameraTracks.length > 0;
  console.log(teacherCameraTracks, "hasTeacherCamera123", myCameraTracks, "anubhav", hasAnyCamera, "teacherIdentity", teacherIdentity)
  if (hasScreenShare) {
    return (
      <div className="w-full h-full">
        <ScreenShareStage tracks={screenShareTracks} className="w-full h-full" />
      </div>
    );
  }

  if (hasTeacherCamera) {
    // return (
    //   <div className="w-full h-full flex items-center justify-center">
    //     <div className="w-full max-w-3xl aspect-video">
    //       <TeacherStage
    //         tracks={teacherCameraTracks}
    //         className="w-full h-full"
    //       />
    //     </div>
    //   </div>
    // );
    return (
      <div className="flex h-full w-full items-center justify-center p-4">
        <div className="w-full max-w-4xl aspect-video overflow-hidden rounded-xl border bg-muted">
          <div>remote</div>
          <div className=""> local</div>
        </div>
         <div className="w-full max-w-4xl aspect-video overflow-hidden rounded-xl border bg-muted">
          <div>remote</div>
          <div className=""> local</div>
        </div>
      </div>
    )
  }

  // if (hasAnyCamera) {
  //   return (
  //     <div className="w-full h-full flex items-center justify-center">
  //       <div className="w-full max-w-3xl aspect-video">
  //         <TeacherStage
  //           tracks={allCameraTracks.slice(0, 1)}
  //           className="w-full h-full"
  //         />
  //       </div>
  //     </div>
  //   );
  // }

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
