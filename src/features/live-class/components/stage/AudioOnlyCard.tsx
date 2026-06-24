import { Users } from "lucide-react";
import { useAppSelector } from '@/store/hooks';
import { getInitials } from '@/utils/helper';
import { cn } from "@/lib/utils";

interface AudioOnlyCardProps {
  hasScreenShare?: boolean;
  isSpeaking?: boolean
}

function AudioBars({ className = "" ,isSpeaking}: { className?: string, isSpeaking?:boolean}) {
  console.log(isSpeaking ,"isSpeakingaudio")
  return (
    <div className={`flex items-end gap-[2px] ${className}`}>
      {[6, 12, 8, 15, 6].map((h, i) => (
        <div
          key={i}
          className="w-[3px] rounded-sm bg-emerald-500"
          style={{
            height: `${h}px`,
            animation: isSpeaking ? `audioPulse 0.8s ${i * 0.15}s ease-in-out infinite`: '',
          }}
        />
      ))}
    </div>
  );
}

function AudioOnlyCard({ hasScreenShare = false,isSpeaking }: AudioOnlyCardProps) {
  console.log(isSpeaking ,"isSpeakingaudio AudioOnlyCard")
  const recordedVideoId = useAppSelector((state) => state.liveClass);

  const teacherIdentity = useAppSelector(
    (state) => state.liveClass.teacherIdentity
  );
  console.log(recordedVideoId,"recordedVideoId")
//  if (recordedVideoId && recordedVideoId !== null) {
//     const fileUrl = getMaterialFileUrl("materials/content_library/videos/2d1db554-1b98-4212-b107-ff9057ccf888.mp4")
//     console.log(fileUrl,"fileUrl")
//     return (
//       <video
//         controls
//         className="max-h-[70vh] max-w-full rounded-lg"
//       >
//         <source src={fileUrl} type={"video/mp4"} />
//         Your browser does not support the video element.
//       </video>
//     )
//   }
  /* ── Compact version — shown as PiP over screen share ── */
  if (hasScreenShare) {
    return (
      <div className="w-full h-full rounded-xl bg-white border border-violet-200 overflow-hidden relative shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.12),transparent)]" />

        {/* Centered avatar */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          {/*
            Avatar: scales between 28px (tiny PiP) and 48px (larger PiP)
            using clamp so it never overflows the card
          */}
          <div
            className="rounded-full bg-gradient-to-br from-violet-500 to-violet-400 flex items-center justify-center text-white font-semibold shrink-0"
            style={{ width: 'clamp(28px, 25%, 48px)', height: 'clamp(28px, 25%, 48px)', fontSize: 'clamp(10px, 2cqw, 14px)' }}
          >
            {getInitials(teacherIdentity?.name || "")}
          </div>
          <p className="text-[10px] text-slate-500 leading-none">Camera Off</p>
        </div>

        {/* Bottom bar — name + audio bars, both clipped safely */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-2 pb-1.5 gap-1 min-w-0">
          <p className="text-[11px] font-medium text-slate-700 truncate min-w-0">
            {teacherIdentity?.name}
          </p>
          <AudioBars className="shrink-0" isSpeaking={isSpeaking}/>
        </div>
      </div>
    );
  }

  /* ── Full-stage version — camera is off, no screen share ── */
  return (
    <div className="w-full h-full rounded-xl border border-violet-200 bg-white relative overflow-hidden shadow-sm">
      {/* Subtle radial tint */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_40%_50%,rgba(139,92,246,0.06)_0%,transparent_70%)]" />

      {/* Centered avatar + label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 sm:gap-3 px-4">
        <div
          className="relative z-10 rounded-full bg-gradient-to-br from-violet-500 to-violet-400 flex items-center justify-center font-bold border-[3px] border-violet-300 shadow-md text-white shrink-0"
          /*
            Avatar size scales with container via clamp:
            - minimum 48px (very small viewport)
            - preferred 12% of viewport width
            - maximum 90px
          */
          style={{
            width: 'clamp(48px, 12vw, 90px)',
            height: 'clamp(48px, 12vw, 90px)',
            fontSize: 'clamp(16px, 3vw, 30px)',
          }}
        >
          {getInitials(teacherIdentity?.name || "")}
        </div>
        <p className="relative z-10 text-[11px] sm:text-[13px] text-slate-400">
          Camera is off
        </p>
      </div>

      {/*
        Name overlay — bottom left.
        max-w-[calc(100%-5rem)] leaves room for audio bars on the right.
        truncate + title tooltip for very long names.
      */}
      <div
        className={cn(
          "absolute bottom-3 left-3 sm:bottom-4 sm:left-4",
          "flex items-center gap-1.5",
          "bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5",
          "rounded-md border border-slate-200 shadow-sm",
          "max-w-[calc(100%-5rem)] min-w-0"   // never overflows into audio bars
        )}
      >
        <span
          className="text-[11px] sm:text-[13px] font-semibold text-slate-800 truncate min-w-0"
          title={teacherIdentity?.name}
        >
          {teacherIdentity?.name}
        </span>
        <span className="text-[9px] sm:text-[10px] text-violet-600 font-semibold uppercase tracking-wide bg-violet-50 border border-violet-200 px-1.5 py-0.5 rounded hidden sm:inline shrink-0">
          Teacher
        </span>
      </div>

      {/* Audio bars — bottom right, always visible */}
      <div className="absolute bottom-4 right-3 sm:bottom-5 sm:right-4 shrink-0">
        <AudioBars isSpeaking={isSpeaking}/>
      </div>

      {/* Student count chip — mobile only */}
      <div className="absolute top-3 right-3 sm:hidden flex items-center gap-1 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full border border-slate-200">
        <Users size={10} className="text-slate-500" />
        <span className="text-[10px] text-slate-500 font-medium">18</span>
      </div>
    </div>
  );
}

export default AudioOnlyCard;