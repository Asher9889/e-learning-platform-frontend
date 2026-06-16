import { useAppSelector } from '@/store/hooks';
import React, { useRef } from 'react'
import { useScreenShareTracks } from '../../hooks/useScreenShareTracks';
import { EmptyState } from "@/features/live-class/components/shared/EmptyState";
import { User } from "lucide-react";
import { ScreenShareStage } from './ScreenShareStage';
import { TeacherStage } from './TeacherStage';
import { useTeacherMediaState } from '../../hooks/useTeacherMediaState';
import TeacherAudioOnlyCard from './TeacherAudioOnlyCard';
import { motion } from "framer-motion";

function MainStageNew() {
  const dragBoundsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const teacherIdentity = useAppSelector(
    (state) => state.liveClass.teacherIdentity
  );
  const myIdententity = useAppSelector(
    (state) => state?.auth?.user
  );

  const screenShareTracks = useScreenShareTracks(teacherIdentity?.id);

  const {
    isTeacherJoined,
    isCameraOn,
    cameraTracks: teacherCameraTracks,
  } = useTeacherMediaState(myIdententity?.id, teacherIdentity?.id);

  const hasScreenShare = screenShareTracks.length > 0;

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
            />
          </motion.div>
        ) : !isCameraOn ? (
          /* Audio-only pill when camera off but screen sharing */
          <div className="absolute bottom-3 right-3 w-[22%] min-w-[120px] max-w-[224px] aspect-video">
            <TeacherAudioOnlyCard hasScreenShare={hasScreenShare} />
          </div>
        ) : null}
      </div>
    );
  } else if (!isCameraOn) {
    content = <TeacherAudioOnlyCard />;
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
      {/*
        flex-1 + min-h-0 prevents the inner card from growing past parent.
        rounded-xl + overflow-hidden clips any child that tries to escape.
      */}
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-full max-w-3xl aspect-video min-h-0">
          <div className="w-full h-full rounded-xl border border-violet-200 bg-white relative overflow-hidden shadow-sm">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainStageNew;