import { useEffect, useRef } from "react";
import { useAppSelector } from "@/store/hooks";
import { usePresenterScreenShareTracks } from "@/features/live-class/hooks/usePresenterScreenShareTracks";
import { usePresenterMediaState } from "@/features/live-class/hooks/usePresenterMediaState";
import PresenterAudioOnlyCard from "../AudioOnlyCard";
import { ScreenShareStage } from "../ScreenShareStage";
import VideoTile from "../VideoTile";
import { motion } from "framer-motion";
import { useRoomContext, type TrackReference } from "@livekit/components-react";
import type { LocalParticipant, RemoteParticipant } from "livekit-client";

interface StagePlayingProps {
  participants: (RemoteParticipant | LocalParticipant)[];
}

interface ActiveStudentStream {
  identity: string;
  name: string;
  trackReference: TrackReference;
  isCameraOn: boolean;
  cameraOnAt: number;
}

export function StagePlaying({ participants }: StagePlayingProps) {
  const dragBoundsRef = useRef<HTMLDivElement>(null);
  const room = useRoomContext();

  const presenter = useAppSelector((s) => s.liveClass.presenter);
  const myIdentity = useAppSelector((s) => s?.auth?.user);
  const presenterIdentity = presenter?.identity ?? null;

  const presenterParticipants = participants.filter(
    (p) =>
      p.identity?.trim() &&
      String(p.identity).trim() === String(presenterIdentity).trim(),
  );

  const { isCameraOn, cameraTracks: presenterCameraTracks, activeStudentStreams } = usePresenterMediaState(myIdentity?.id, presenterIdentity);

  const studentActiveStream: ActiveStudentStream | undefined = activeStudentStreams?.[0];

  const screenShareTracks = usePresenterScreenShareTracks(presenterIdentity);
  const studentScreenShareTracks = usePresenterScreenShareTracks(studentActiveStream?.identity);

  const hasScreenShare = screenShareTracks.length > 0;

  const sendCameraOffCommand = async (studentId: string) => {
    await room.localParticipant.publishData(
      new TextEncoder().encode(
        JSON.stringify({
          type: "CAMERA_OFF_ALL",
          targetStudentId: studentId,
        }),
      ),
      { reliable: true },
    );
  };

  useEffect(() => {
    if (activeStudentStreams) {
      const studentsToDisable = activeStudentStreams.slice(1);
      studentsToDisable.forEach((student) => {
        sendCameraOffCommand(student.identity);
      });
    }
  }, [activeStudentStreams]);

  const speakerProps = {
    isSpeaking: presenterParticipants[0]?.isSpeaking,
  };

  if (
    activeStudentStreams &&
    activeStudentStreams.length > 0 &&
    studentScreenShareTracks?.length > 0
  ) {
    return (
      <div
        ref={dragBoundsRef}
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
      >
        <div className="w-full h-full">
          <ScreenShareStage
            tracks={studentScreenShareTracks}
            className="w-full h-full"
          />
        </div>

        {activeStudentStreams[0]?.isCameraOn ? (
          <motion.div
            drag
            dragMomentum={false}
            dragElastic={0}
            dragConstraints={dragBoundsRef}
            className="absolute bottom-3 right-3 w-[22%] min-w-[120px] max-w-[224px] aspect-video rounded-xl overflow-hidden border-2 border-white shadow-2xl bg-black z-50 cursor-move select-none"
          >
            <VideoTile
              tracks={[activeStudentStreams[0].trackReference]}
              className="w-full h-full"
              hasScreenShare
              isSpeaking={speakerProps.isSpeaking}
              type="student"
            />
          </motion.div>
        ) : !isCameraOn ? (
          <div className="absolute bottom-3 right-3 w-[22%] min-w-[120px] max-w-[224px] aspect-video">
            <PresenterAudioOnlyCard
              hasScreenShare
              isSpeaking={speakerProps.isSpeaking}
            />
          </div>
        ) : null}
      </div>
    );
  }

  if (activeStudentStreams && activeStudentStreams.length > 0) {
    return (
      <div className="w-full h-full flex items-center justify-center p-2 sm:p-3">
        <div className="w-full max-w-3xl aspect-video min-h-0">
          <VideoTile
            tracks={[activeStudentStreams[0].trackReference]}
            type="student"
            className="w-full h-full"
            hasScreenShare={studentScreenShareTracks?.length > 0}
            isSpeaking={speakerProps.isSpeaking}
          />
        </div>
      </div>
    );
  }

  if (hasScreenShare) {
    return (
      <div
        ref={dragBoundsRef}
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
      >
        <div className="w-full h-full">
          <ScreenShareStage
            tracks={screenShareTracks}
            className="w-full h-full"
          />
        </div>
        {isCameraOn && presenterCameraTracks.length > 0 ? (
          <motion.div
            drag
            dragMomentum={false}
            dragElastic={0}
            dragConstraints={dragBoundsRef}
            className="absolute bottom-3 right-3 w-[22%] min-w-[120px] max-w-[224px] aspect-video rounded-xl overflow-hidden border-2 border-white shadow-2xl bg-black z-50 cursor-move select-none"
          >
            <VideoTile
              tracks={presenterCameraTracks}
              className="w-full h-full"
              hasScreenShare
              isSpeaking={speakerProps.isSpeaking}
              type={presenter?.type === "TEACHER" ? "teacher" : "presenter"}
            />
          </motion.div>
        ) : !isCameraOn ? (
          <div className="absolute bottom-3 right-3 w-[22%] min-w-[120px] max-w-[224px] aspect-video">
            <PresenterAudioOnlyCard
              hasScreenShare
              isSpeaking={speakerProps.isSpeaking}
            />
          </div>
        ) : null}
      </div>
    );
  }

  if (!isCameraOn) {
    return (
      <PresenterAudioOnlyCard isSpeaking={speakerProps.isSpeaking} />
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-2 sm:p-3">
      <div className="w-full max-w-3xl aspect-video min-h-0">
        <VideoTile
          tracks={presenterCameraTracks}
          className="w-full h-full"
          type={presenter?.type === "TEACHER" ? "teacher" : "presenter"}
          hasScreenShare={hasScreenShare}
          isSpeaking={speakerProps.isSpeaking}
        />
      </div>
    </div>
  );
}
