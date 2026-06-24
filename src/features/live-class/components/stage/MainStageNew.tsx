import { useAppSelector } from '@/store/hooks';
import React, { useEffect, useRef, useState } from 'react'
import { useScreenShareTracks } from '../../hooks/useScreenShareTracks';
import { EmptyState } from "@/features/live-class/components/shared/EmptyState";
import { Maximize2, Minimize2, User } from "lucide-react";
import { ScreenShareStage } from './ScreenShareStage';
import { useTeacherMediaState } from '../../hooks/useTeacherMediaState';
import TeacherAudioOnlyCard from './AudioOnlyCard';
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
  const {
    isTeacherJoined,
    isCameraOn,
    cameraTracks: teacherCameraTracks,
    activeStudentStreams,
  } = useTeacherMediaState(myIdentity?.id, teacherIdentity?.id);

  const studentActiveStream: ActiveStudentStream | undefined = activeStudentStreams?.[0];
  const studentParticpants = props?.participants.filter((p) =>
    p.identity?.trim() &&
    String(p.identity).trim() !== String(teacherId).trim() &&
    String(p.identity).trim() !== String(myId).trim()
  )
  console.log(studentParticpants[0]?.isSpeaking, "studentParticpantsstudentParticpants2454")
  const screenShareTracks = useScreenShareTracks(teacherIdentity?.id);

  const studentScreenShareTracks = useScreenShareTracks(studentActiveStream?.identity);

  console.log(teacherParticpants[0]?.isSpeaking, "isSpeakingisSpeakingisSpeakingisSpeaking")


  const hasScreenShare = screenShareTracks.length > 0;


  const sendCameraOffCommand = async (studentId: string) => {
    await room.localParticipant.publishData(
      new TextEncoder().encode(
        JSON.stringify({
          type: "CAMERA_OFF_ALL",
          targetStudentId: studentId,
        })
      ),
      { reliable: true }
    );
  };
  useEffect(() => {
    console.log(activeStudentStreams, "student CAMERA_OFF_ALL");

    // if (activeStudentStreams && activeStudentStreams?.length <= 1) return;

    if (activeStudentStreams) {
      const studentsToDisable = activeStudentStreams.slice(1);
      studentsToDisable.forEach((student) => {
        console.log(student, "student CAMERA_OFF_ALL");
        sendCameraOffCommand(student.identity);
      });
    }

    // const studentsToDisable = activeStudentStreams && activeStudentStreams.slice(1);
    // if (studentsToDisable) {
    //   studentsToDisable.forEach((student) => {
    //     console.log(student, "student CAMERA_OFF_ALL");
    //     sendCameraOffCommand(student.identity);
    //   });
    // }

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
  console.log(studentScreenShareTracks, "studentScreenShareTracks", "activeStudentStreams", activeStudentStreams)
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
  } 
  else if (activeStudentStreams && activeStudentStreams?.length > 0 && studentScreenShareTracks?.length > 0) {
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
            tracks={studentScreenShareTracks}
            className="w-full h-full"
          />
        </div>

        {/* Floating Teacher Camera PiP */}
        {activeStudentStreams[0] && activeStudentStreams[0]?.isCameraOn && activeStudentStreams.length > 0 ? (
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
            <VideoTile
              tracks={activeStudentStreams[0]
                ? [activeStudentStreams[0].trackReference]
                : []}
              className="w-full h-full"
              hasScreenShare={studentScreenShareTracks?.length > 0}
              isSpeaking={teacherParticpants[0]?.isSpeaking}
              type={"student"}
            />
          </motion.div>
        ) : !isCameraOn ? (
          /* Audio-only pill when camera off but screen sharing */
          <div className="absolute bottom-3 right-3 w-[22%] min-w-[120px] max-w-[224px] aspect-video">
            <TeacherAudioOnlyCard hasScreenShare={studentScreenShareTracks?.length > 0} isSpeaking={teacherParticpants[0]?.isSpeaking} />
          </div>
        ) : null}
      </div>
    );
  } else if (activeStudentStreams && activeStudentStreams?.length > 0) {
    content = (
      <div className="w-full h-full flex items-center justify-center p-2 sm:p-3">
        {/*
          aspect-video inside a flex container:
          - w-full keeps it filling available width
          - max-w stops it from stretching on ultra-wide screens
          - min-h-0 prevents flex overflow on short viewports
        */}
        <div className="w-full max-w-3xl aspect-video min-h-0">
          <VideoTile
            tracks={activeStudentStreams[0]
              ? [activeStudentStreams[0].trackReference]
              : []}
            type={"student"}
            className="w-full h-full"
            hasScreenShare={studentScreenShareTracks?.length > 0}
            isSpeaking={teacherParticpants[0]?.isSpeaking}
          />
        </div>
      </div>
    );
  } else if (hasScreenShare) {
    console.log(teacherCameraTracks.length, "awdawda11212121wdawdawd", isCameraOn)

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
            <VideoTile
              tracks={teacherCameraTracks}
              className="w-full h-full"
              hasScreenShare={hasScreenShare}
              isSpeaking={teacherParticpants[0]?.isSpeaking}
              type={"teacher"}
            />
          </motion.div>
        ) : !isCameraOn ? (
          /* Audio-only pill when camera off but screen sharing */
          <div className="absolute bottom-3 right-3 w-[22%] min-w-[120px] max-w-[224px] aspect-video">
            <TeacherAudioOnlyCard hasScreenShare={hasScreenShare} isSpeaking={teacherParticpants[0]?.isSpeaking} />
          </div>
        ) : null}
      </div>
    );
  } else if (!isCameraOn) {
    content = <TeacherAudioOnlyCard isSpeaking={teacherParticpants[0]?.isSpeaking} />;
  } else {
    console.log("dasdasjdjashdjkahsd")
    content = (
      <div className="w-full h-full flex items-center justify-center p-2 sm:p-3">
        {/*
          aspect-video inside a flex container:
          - w-full keeps it filling available width
          - max-w stops it from stretching on ultra-wide screens
          - min-h-0 prevents flex overflow on short viewports
        */}
        <div className="w-full max-w-3xl aspect-video min-h-0">
          <VideoTile
            tracks={teacherCameraTracks}
            className="w-full h-full"
            type={"teacher"}
            hasScreenShare={hasScreenShare}
            isSpeaking={teacherParticpants[0]?.isSpeaking}
          />
        </div>
      </div>
    );
  }
console.log("mainStageNew111111111111")
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
          // "bg-black/40"
          "bg-black/40 hover:bg-black/65 backdrop-blur-sm",
          "text-white transition-all duration-150",
          // "opacity-0 group-hover:opacity-100",
          "focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/50"
        )}
      >
        {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
        {/* awdawd */}
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