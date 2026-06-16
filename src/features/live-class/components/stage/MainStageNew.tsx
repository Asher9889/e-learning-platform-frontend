import { useAppSelector } from '@/store/hooks';
import React, { useEffect, useRef, useState } from 'react'
import { useScreenShareTracks } from '../../hooks/useScreenShareTracks';
import { EmptyState } from "@/features/live-class/components/shared/EmptyState";
import { Maximize2, Minimize2, User } from "lucide-react";
import { ScreenShareStage } from './ScreenShareStage';
import { TeacherStage } from './TeacherStage';
import { useTeacherMediaState } from '../../hooks/useTeacherMediaState';
import TeacherAudioOnlyCard from './TeacherAudioOnlyCard';
import { motion } from "framer-motion";
import { cn } from '#lib/utils';
import type { LocalParticipant, RemoteParticipant } from 'livekit-client';
interface MainStageNewProps {
  participants:(RemoteParticipant | LocalParticipant)[] ;
}
function MainStageNew(props: MainStageNewProps) {
  const dragBoundsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const teacherIdentity = useAppSelector(
    (state) => state.liveClass.teacherIdentity
  );
  const myIdentity = useAppSelector(
    (state) => state?.auth?.user
  );
const myId = myIdentity?.id;
const teacherId = teacherIdentity?.id;

const teacherParticpants = props?.participants.filter((p) =>
  p.identity?.trim() &&
  String(p.identity).trim() === String(teacherId).trim()
);

const studentParticpants = props?.participants.filter((p) =>
  p.identity?.trim() &&
  String(p.identity).trim() !== String(teacherId).trim() &&
  String(p.identity).trim() !== String(myId).trim()
)
      console.log(studentParticpants[0]?.isSpeaking,"studentParticpantsstudentParticpants2454")
  const screenShareTracks = useScreenShareTracks(teacherIdentity?.id);
console.log(teacherParticpants[0]?.isSpeaking,"isSpeakingisSpeakingisSpeakingisSpeaking")
  const {
    isTeacherJoined,
    isCameraOn,
    cameraTracks: teacherCameraTracks,
  } = useTeacherMediaState(myIdentity?.id, teacherIdentity?.id);

  const hasScreenShare = screenShareTracks.length > 0;

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
        onFullscreenChange
      );
    };
  }, []);
  let content: React.ReactNode;

  if (!isTeacherJoined) {
    content = (
      <div className="w-full h-full flex items-center justify-center p-4">
        <EmptyState
          icon={User}
          title="Waiting for teacher"
          description="The class hasn't started yet."
        />
      </div>
    );
  } else if (hasScreenShare) {
    content = (
      /* dragBoundsRef is directly on this div — motion.div is a direct child
         so Framer Motion calculates bounds correctly */
      <div
        ref={dragBoundsRef}
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
      >
        {/* Main Screen Share — fills available space */}
        <div className="w-full h-full">
          <ScreenShareStage
            tracks={screenShareTracks}
            className="w-full h-full"
          />
        </div>

        {/* Floating Teacher Camera PiP */}
        {isCameraOn && teacherCameraTracks.length > 0 ? (
          <motion.div
            drag
            dragMomentum={false}
            dragElastic={0}
            dragConstraints={dragBoundsRef}
            /* 
              w-[22%] min-w-[120px] max-w-[224px] — scales with container
              so it never overflows on small screens
            */
            className="absolute bottom-3 right-3 w-[22%] min-w-[120px] max-w-[224px] aspect-video rounded-xl overflow-hidden border-2 border-white shadow-2xl bg-black z-50 cursor-move select-none"
          >
            <TeacherStage
              tracks={teacherCameraTracks}
              className="w-full h-full"
              hasScreenShare={hasScreenShare}
              isSpeaking={teacherParticpants[0]?.isSpeaking}
            />
          </motion.div>
        ) : !isCameraOn ? (
          /* Audio-only pill when camera off but screen sharing */
          <div className="absolute bottom-3 right-3 w-[22%] min-w-[120px] max-w-[224px] aspect-video">
            <TeacherAudioOnlyCard hasScreenShare={hasScreenShare}  isSpeaking={teacherParticpants[0]?.isSpeaking}/>
          </div>
        ) : null}
      </div>
    );
  } else if (!isCameraOn) {
    content = <TeacherAudioOnlyCard isSpeaking={teacherParticpants[0]?.isSpeaking}/>;
  } else {
    content = (
      <div className="w-full h-full flex items-center justify-center p-2 sm:p-3">
        {/*
          aspect-video inside a flex container:
          - w-full keeps it filling available width
          - max-w stops it from stretching on ultra-wide screens
          - min-h-0 prevents flex overflow on short viewports
        */}
        <div className="w-full max-w-3xl aspect-video min-h-0">
          <TeacherStage
            tracks={teacherCameraTracks}
            className="w-full h-full"
            hasScreenShare={hasScreenShare}
            isSpeaking={teacherParticpants[0]?.isSpeaking}
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
          "opacity-0 group-hover:opacity-100",
          "focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/50"
        )}
      >
        {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
      </button>
      {/*
        flex-1 + min-h-0 prevents the inner card from growing past parent.
        rounded-xl + overflow-hidden clips any child that tries to escape.
      */}
      <div className="w-full h-full flex items-center justify-center">
        {/* <div className="w-full max-w-3xl aspect-video min-h-0"> */}
        <div className="w-full h-full rounded-xl border border-violet-200 bg-white relative overflow-hidden shadow-sm">
          {content}
        </div>
        {/* </div> */}
      </div>
    </div>
  );
}

export default MainStageNew;