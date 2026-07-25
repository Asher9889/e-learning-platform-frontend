import { useAppSelector } from '@/store/hooks';
import React, { useEffect, useRef, useState } from 'react'
import { usePresenterScreenShareTracks } from '../../hooks/usePresenterScreenShareTracks';
import { EmptyState } from "@/features/live-class/components/shared/EmptyState";
import { Maximize2, Minimize2, User } from "lucide-react";
import { ScreenShareStage } from './ScreenShareStage';
import { usePresenterMediaState } from '../../hooks/usePresenterMediaState';
import PresenterAudioOnlyCard from './AudioOnlyCard';
import { motion } from "framer-motion";
import { cn } from '#lib/utils';
import type { LocalParticipant, RemoteParticipant } from 'livekit-client';
import { useRoomContext, type TrackReference } from '@livekit/components-react';
import VideoTile from './VideoTile';

interface MainStageNewProps {
  participants: (RemoteParticipant | LocalParticipant)[];
}

interface ActiveStudentStream {
  identity: string;
  name: string;
  trackReference: TrackReference;
  isCameraOn: boolean;
  cameraOnAt: number;
}

function MainStageNew(props: MainStageNewProps) {
  const dragBoundsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const room = useRoomContext();

  const presenter = useAppSelector(
    (state) => state.liveClass.presenter,
  );
  const myIdentity = useAppSelector(
    (state) => state?.auth?.user,
  );
  const presenterIdentity = presenter?.identity ?? null;

  const presenterParticipants = props?.participants.filter((p) =>
    p.identity?.trim() &&
    String(p.identity).trim() === String(presenterIdentity).trim(),
  );

  const {
    isPresenterJoined,
    isCameraOn,
    cameraTracks: presenterCameraTracks,
    activeStudentStreams,
  } = usePresenterMediaState(myIdentity?.id, presenterIdentity);

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

  const handleFullscreenToggle = async () => {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current?.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        onFullscreenChange,
      );
    };
  }, []);

  let content: React.ReactNode;

  if (!isPresenterJoined) {
    content = (
      <div className="w-full h-full flex items-center justify-center p-4">
        <EmptyState
          icon={User}
          title="Waiting for teacher"
          description="The class hasn't started yet."
        />
      </div>
    );
  }
  else if (activeStudentStreams && activeStudentStreams?.length > 0 && studentScreenShareTracks?.length > 0) {
    content = (
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

        {activeStudentStreams[0] && activeStudentStreams[0]?.isCameraOn && activeStudentStreams.length > 0 ? (
          <motion.div
            drag
            dragMomentum={false}
            dragElastic={0}
            dragConstraints={dragBoundsRef}
            className="absolute bottom-3 right-3 w-[22%] min-w-[120px] max-w-[224px] aspect-video rounded-xl overflow-hidden border-2 border-white shadow-2xl bg-black z-50 cursor-move select-none"
          >
            <VideoTile
              tracks={activeStudentStreams[0]
                ? [activeStudentStreams[0].trackReference]
                : []}
              className="w-full h-full"
              hasScreenShare={studentScreenShareTracks?.length > 0}
              isSpeaking={presenterParticipants[0]?.isSpeaking}
              type={"student"}
            />
          </motion.div>
        ) : !isCameraOn ? (
          <div className="absolute bottom-3 right-3 w-[22%] min-w-[120px] max-w-[224px] aspect-video">
            <PresenterAudioOnlyCard hasScreenShare={studentScreenShareTracks?.length > 0} isSpeaking={presenterParticipants[0]?.isSpeaking} />
          </div>
        ) : null}
      </div>
    );
  } else if (activeStudentStreams && activeStudentStreams?.length > 0) {
    content = (
      <div className="w-full h-full flex items-center justify-center p-2 sm:p-3">
        <div className="w-full max-w-3xl aspect-video min-h-0">
          <VideoTile
            tracks={activeStudentStreams[0]
              ? [activeStudentStreams[0].trackReference]
              : []}
            type={"student"}
            className="w-full h-full"
            hasScreenShare={studentScreenShareTracks?.length > 0}
            isSpeaking={presenterParticipants[0]?.isSpeaking}
          />
        </div>
      </div>
    );
  } else if (hasScreenShare) {
    content = (
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
              hasScreenShare={hasScreenShare}
              isSpeaking={presenterParticipants[0]?.isSpeaking}
              type={presenter?.type === "TEACHER" ? "teacher" : "presenter"}
            />
          </motion.div>
        ) : !isCameraOn ? (
          <div className="absolute bottom-3 right-3 w-[22%] min-w-[120px] max-w-[224px] aspect-video">
            <PresenterAudioOnlyCard hasScreenShare={hasScreenShare} isSpeaking={presenterParticipants[0]?.isSpeaking} />
          </div>
        ) : null}
      </div>
    );
  } else if (!isCameraOn) {
    content = <PresenterAudioOnlyCard isSpeaking={presenterParticipants[0]?.isSpeaking} />;
  } else {
    content = (
      <div className="w-full h-full flex items-center justify-center p-2 sm:p-3">
        <div className="w-full max-w-3xl aspect-video min-h-0">
          <VideoTile
            tracks={presenterCameraTracks}
            className="w-full h-full"
            type={presenter?.type === "TEACHER" ? "teacher" : "presenter"}
            hasScreenShare={hasScreenShare}
            isSpeaking={presenterParticipants[0]?.isSpeaking}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
    >

      <button
        onClick={handleFullscreenToggle}
        title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        className={cn(
          "absolute top-2 right-2 z-10",
          "w-8 h-8 rounded-lg",
          "flex items-center justify-center",
          "bg-black/40 hover:bg-black/65 backdrop-blur-sm",
          "text-white transition-all duration-150",
          "focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/50"
        )}
      >
        {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
      </button>
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-full h-full rounded-xl border border-violet-200 bg-white relative overflow-hidden shadow-sm">
          {content}
        </div>
      </div>
    </div>
  );
}

export default MainStageNew;
