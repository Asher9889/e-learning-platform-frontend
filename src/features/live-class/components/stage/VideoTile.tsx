// import React from 'react'

// function VideoTile() {
//   return (
//     <div>VideoTile</div>
//   )
// }

// 



import { useRef, useState, useCallback, useEffect } from "react";
import {  ParticipantName, VideoTrack } from "@livekit/components-react";
import type { TrackReference } from "@livekit/components-react";
import { cn } from "@/lib/utils";
import { Maximize2, Minimize2 } from "lucide-react";
import { capitalizeFirstLetter } from "@/utils/helper";

interface ScreenStageProps {
  tracks: TrackReference[];
  className?: string;
  isSpeaking?:boolean;
  hasScreenShare?: boolean;
  type: string;
}
  function VideoTile({ tracks, className ,hasScreenShare,isSpeaking,type}: ScreenStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
console.log(hasScreenShare,"ScreenStage Rendered",isSpeaking);

  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  }, []);

  // Sync state when user presses Escape to exit fullscreen


  useEffect(() => {
  const handleFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement);
  };

  document.addEventListener(
    "fullscreenchange",
    handleFullscreenChange
  );

  return () => {
    document.removeEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );
  };
}, []);
  return (
    <div
      ref={containerRef}
      className={cn("relative w-full h-full group", className)}
    >
      {tracks.slice(0, 1).map((track) => (
        <div key={track.participant.identity} className="relative w-full h-full">
          {/* <ParticipantTile
            trackRef={track}
            className="w-full h-full [&>video]:object-cover [&>video]:w-full [&>video]:h-full rounded-xl"
            
          /> */}
          <VideoTrack trackRef={track}   className="w-full h-full [&>video]:object-cover [&>video]:w-full [&>video]:h-full rounded-xl"/>

          {/* Name overlay — bottom left */}
         {/* { !hasScreenShare &&  */}
         <div className="absolute bottom-2 left-2 max-w-[calc(100%-3.5rem)] flex items-center gap-1.5">
            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md min-w-0">
              <ParticipantName
                participant={track.participant}
                className="font-medium text-white drop-shadow-sm truncate [font-size:clamp(10px,1.5cqw,13px)]"
              />
              <span className="shrink-0 text-violet-300 font-semibold uppercase tracking-wide [font-size:clamp(8px,1.1cqw,10px)]">
                {capitalizeFirstLetter(type)}
              </span>
            </div>
          </div> 
          {/* }  */}

          {/* Fullscreen button — top right, appears on hover */}
          <button
            onClick={toggleFullscreen}
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
        </div>
      ))}
    </div>
  );
}

export default VideoTile