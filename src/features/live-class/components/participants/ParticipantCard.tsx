import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Mic, MicOff, Camera, CameraOff, Pin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ParticipantInfo } from "../../types";
// import { useSingleSpeakerSystem } from "../../hooks/useSingleSpeakerSystem";
import {  useRoomContext } from "@livekit/components-react";
import { useAppSelector } from "@/store/hooks";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import handRaiseAnimation from "@/assets/animations/hand-raise.lottie";


interface ParticipantCardProps {
  participant: ParticipantInfo;
  isLocal?: boolean;
  fadeDuration?: number;
  onPin?: (identity: string) => void;
}

export function ParticipantCard({
  participant,
  isLocal,
  onPin,
  fadeDuration
}: ParticipantCardProps) {
  // const liveKitParticipants = useParticipants();
   const myIdentity = useAppSelector(
        (state) => state?.auth?.user?.id
    );
  const teacherId = useAppSelector((state) => state.liveClass.teacherIdentity?.id);
  const room = useRoomContext();
  const initials = participant.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

 
  //  useEffect(() => {
  //       participants.forEach((participant) => {
  //           if (
  //               participant.handRaised &&
  //               !previousRaisedUsers.current.has(participant.identity)
  //           ) {
  //               if (audioRef.current) {
  //                   audioRef.current.currentTime = 0;
  //                   audioRef.current.play().catch((err) => {
  //                       console.error("🔔 Audio play failed:", err);
  //                   });
  //               }
  //               previousRaisedUsers.current.add(participant.identity);
  //           }

  //           if (!participant.handRaised) {
  //               previousRaisedUsers.current.delete(participant.identity);
  //           }
  //       });
  //   }, [participants]);
  return (
    <div
      className={
        `flex items-center gap-3 px-3 py-2.5 rounded-lg border-1 ${participant?.isSpeaking ? "border-[#4ade80] box-shadow-[#4ade8066]" : "border-[#e2e8f0] box-shadow-[rgb(0 0 0 / 0.08)]"} transition-all duration-${fadeDuration} ease-in-out `
        // "hover:bg-muted/50 group",
        // participant.isSpeaking && "ring-1 ring-green-500/50 bg-green-500/5",
        // participant.isPinned && "ring-1 ring-primary/50 bg-primary/5"

      }
      style={{
        // backgroundColor:  "#4ade80" ,
        // borderColor: participant?.isSpeaking ? "#4ade80" : "#4ade8066",
        // boxShadow: participant?.isSpeaking
        //   ? "0 0 0 2px #4ade8066"
        //   : "0 1px 3px rgb(0 0 0 / 0.08)",
        // transition: `all ${fadeDuration}ms ease`,
      }}
    >
      <div className="relative shrink-0">
        <Avatar className="w-9 h-9">
          <AvatarImage src={participant.avatar} alt={participant.name} />
          <AvatarFallback className="text-xs font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        {participant.handRaised && (
          <span className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] rounded-full bg-white flex items-center justify-center">
            <DotLottieReact
              src={handRaiseAnimation}
              autoplay
              loop
              className="w-4 h-4"
            />
          </span>
        )}
        <span className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-green-500 animate-pulse " />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium truncate">
            {participant.name}
          </span>
          {isLocal && (
            <span className="text-[10px] text-muted-foreground">(you)</span>
          )}
        </div>
        <div className="flex items-center justify-between gap-1.5 mt-0.5">
          <Badge
            variant={participant.role === "TEACHER" ? "default" : "secondary"}
            className="h-4 px-1.5 text-[10px] font-medium"
          >
            {participant.role === "TEACHER"
              ? participant.isSpeaking
                ? "Speaking Teacher"
                : "Teacher"
              : participant.isSpeaking
                ? "Speaking Student"
                : "Student"}
          </Badge>
          {/* <div className="flex-1 min-w-0">
            <p
              className={`text-[11px] font-medium mt-0.5 ${participant.handRaised
                ? "text-amber-500"
                : participant.isSpeaking
                  ? "text-green-600"
                  : "text-slate-500"
                }`}
            >
              { participant.isSpeaking
                  ? "Speaking"
                  : "Online"}
            </p>
          </div> */}
        {myIdentity === teacherId &&  <div className={`flex items-center gap-1 shrink-0 ${myIdentity === participant?.identity ? "hidden" : ""}`}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  onClick={async () => {
                    console.log("Teacher sending mute request", "CONTROLLLLLL");

                    const payload = {
                      type: "toggle-mic",
                      targetId: participant.identity,
                      enabled: !participant.isMuted,
                    };

                    console.log("Payload:", payload, "CONTROLLLLLL");

                    await room.localParticipant.publishData(
                      new TextEncoder().encode(JSON.stringify(payload)),
                      { reliable: true }
                    );

                    console.log("Mute request sent", "CONTROLLLLLL");
                  }}
                  className={cn(
                    "w-7 h-7 flex items-center justify-center rounded-md transition-colors",
                    participant.isMuted
                      ? "text-destructive"
                      : "text-muted-foreground"
                  )}
                >
                  {!participant.isMuted ? (
                    <MicOff className="w-3.5 h-3.5" />
                  ) : (
                    <Mic className="w-3.5 h-3.5" />
                  )}
                </span>
              </TooltipTrigger>
              <TooltipContent side="left">
                {!participant.isMuted ? "Muted" : "Unmuted"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  onClick={async () => {
                    console.log("Teacher sending mute request", "CONTROLLLLLL");

                    const payload = {
                      type: "toggle-video",
                      targetId: participant.identity,
                      enabled: !participant.isCameraOff,
                    };

                    console.log("Payload:", payload, "CONTROLLLLLL");

                    await room.localParticipant.publishData(
                      new TextEncoder().encode(JSON.stringify(payload)),
                      { reliable: true }
                    );

                    console.log("Mute request sent", "CONTROLLLLLL");
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground">
                  {!participant.isCameraOff ? (
                    <CameraOff className="w-3.5 h-3.5" />
                  ) : (
                    <Camera className="w-3.5 h-3.5" />
                  )}
                </span>
              </TooltipTrigger>
              <TooltipContent side="left">
                {!participant.isCameraOff ? "Camera off" : "Camera on"}
              </TooltipContent>
            </Tooltip>

            {onPin && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onPin(participant.identity)}
                    className={cn(
                      "w-7 h-7 flex items-center justify-center rounded-md transition-colors",
                      "opacity-0 group-hover:opacity-100 hover:bg-muted-foreground/10",
                      participant.isPinned && "opacity-100 text-primary"
                    )}
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  {participant.isPinned ? "Unpin" : "Pin"}
                </TooltipContent>
              </Tooltip>
            )}
          </div>}
        </div>
      </div>


    </div>
  );
}


{/* ══════════════ STUDENTS STRIP (responsive grid cards) ══════════════ */ }
// <div
//     className="grid gap-2"
//     style={{
//         gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
//     }}
// >
//     {participants.map((s) => {
//         console.log(
//             s.name,
//             "cameraEnabled:awdawd",
//             s.isCameraOff,
//             "actual:",
//             liveKitParticipants.find(
//                 (p) => p.identity === s.identity
//             )?.isCameraEnabled
//         );
//         return (
//             <div
//                 key={s.identity}
//                 className="rounded-xl bg-white border px-3 py-2.5 flex items-center gap-2.5 min-w-0"
//                 style={{
//                     borderColor: s.isSpeaking ? "#4ade80" : "#e2e8f0",
//                     boxShadow: s.isSpeaking
//                         ? "0 0 0 2px #4ade8066"
//                         : "0 1px 3px rgb(0 0 0 / 0.08)",
//                     transition: `all ${fadeDuration}ms ease`,
//                 }}
//             >
//                 Avatar + status overlay
//                 <div className="relative shrink-0">
//                     <div className="w-[38px] h-[38px] rounded-full overflow-hidden bg-gradient-to-br from-slate-500 to-slate-300 flex items-center justify-center">
//                         {s.avatar ? (
//                             <img
//                                 src={s.avatar}
//                                 alt={s.name}
//                                 className="w-full h-full object-cover"
//                             />
//                         ) : (
//                             <span className="text-white font-semibold text-sm">
//                                 {s.name.charAt(0).toUpperCase()}
//                             </span>
//                         )}
//                     </div>

//                     Speaking indicator (green pulse dot)
//                     {s.isSpeaking && (
//                         <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse border-2 border-white" />
//                     )}

//                     {/* Hand raised indicator (overrides speaking dot visually if both — hand takes priority on the corner) */}
//                     {s.handRaised && (
//                         <span className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] rounded-full bg-white flex items-center justify-center">
//                             <DotLottieReact
//                                 src={handRaiseAnimation}
//                                 autoplay
//                                 loop
//                                 className="w-4 h-4"
//                             />
//                         </span>
//                     )}
//                 </div>

//                 Name + status text
//                 <div className="flex-1 min-w-0">
//                     <p className="text-sm font-medium truncate">{s.name}</p>
//                     <p
//                         className={`text-[11px] font-medium mt-0.5 ${s.handRaised
//                             ? "text-amber-500"
//                             : s.isSpeaking
//                                 ? "text-green-600"
//                                 : "text-slate-500"
//                             }`}
//                     >
//                         {s.handRaised
//                             ? "Hand raised"
//                             : s.isSpeaking
//                                 ? "Speaking"
//                                 : "Online"}
//                     </p>
//                 </div>

//                 Mic / Video controls
//               {myIdentity === teacherId &&  <div className="flex items-center gap-1 shrink-0">
//                     <button
//                         type="button"
//                         onClick={async () => {
//                             console.log("Teacher sending mute request", "CONTROLLLLLL");

//                             const payload = {
//                                 type: "toggle-mic",
//                                 targetId: s.identity,
//                                 enabled: !s.isMuted,
//                             };

//                             console.log("Payload:", payload, "CONTROLLLLLL");

//                             await room.localParticipant.publishData(
//                                 new TextEncoder().encode(JSON.stringify(payload)),
//                                 { reliable: true }
//                             );

//                             console.log("Mute request sent", "CONTROLLLLLL");
//                         }}
//                         aria-label={!s.isMuted ? `Unmute ${s.name}` : `Mute ${s.name}`}
//                         className={`w-[26px] h-[26px] rounded-md flex items-center justify-center ${!s.isMuted
//                             ? "bg-red-50 text-red-500"
//                             : "bg-slate-100 text-slate-600"
//                             }`}
//                     >
//                         {!s.isMuted ? <MicOff size={14} /> : <Mic size={14} />}
//                     </button>

//                     <button
//                         type="button"
//                         onClick={async () => {
//                             console.log("Teacher sending mute request", "CONTROLLLLLL");

//                             const payload = {
//                                 type: "toggle-video",
//                                 targetId: s.identity,
//                                 enabled: !s.isCameraOff,
//                             };

//                             console.log("Payload:", payload, "CONTROLLLLLL");

//                             await room.localParticipant.publishData(
//                                 new TextEncoder().encode(JSON.stringify(payload)),
//                                 { reliable: true }
//                             );

//                             console.log("Mute request sent", "CONTROLLLLLL");
//                         }}
//                         aria-label={
//                             !s.isCameraOff
//                                 ? `Turn on ${s.name}'s video`
//                                 : `Turn off ${s.name}'s video`
//                         }
//                         className={`w-[26px] h-[26px] rounded-md flex items-center justify-center ${!s.isCameraOff
//                             ? "bg-red-50 text-red-500"
//                             : "bg-slate-100 text-slate-600"
//                             }`}
//                     >
//                         {!s.isCameraOff ? <VideoOff size={14} /> : <Video size={14} />}
//                     </button>
//                 </div>}
//             </div>
//         )
//     }
//     )}
// </div>