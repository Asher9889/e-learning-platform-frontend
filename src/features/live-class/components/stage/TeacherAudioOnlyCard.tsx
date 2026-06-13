import React from 'react'
import { Users } from "lucide-react";

function AudioBars({ className = "" }: { className?: string }) {
    return (
        <div className={`flex items-end gap-[2px] ${className}`}>
            {[6, 12, 8, 15, 6].map((h, i) => (
                <div
                    key={i}
                    className="w-[3px] rounded-sm bg-emerald-500"
                    style={{
                        height: `${h}px`,
                        animation: `audioPulse 0.8s ${i * 0.15}s ease-in-out infinite`,
                    }}
                />
            ))}
        </div>
    );
}
function TeacherAudioOnlyCard() {
  return (
      <div className="flex-1 rounded-xl border border-violet-200 bg-white relative overflow-hidden min-h-0 shadow-sm">
             {/* Subtle radial tint */}
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_40%_50%,rgba(139,92,246,0.06)_0%,transparent_70%)]" />

             {/* Avatar */}
             <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 sm:gap-3">
                 <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 lg:w-[90px] lg:h-[90px] rounded-full bg-gradient-to-br from-violet-500 to-violet-400 flex items-center justify-center text-2xl sm:text-3xl font-bold border-[3px] border-violet-300 shadow-md text-white">
                     RS
                 </div>
                 <p className="relative z-10 text-[11px] sm:text-[13px] text-slate-400">Camera connecting…</p>
             </div>

             {/* Name overlay */}
             <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 flex items-center gap-1.5 sm:gap-2 bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-md border border-slate-200 shadow-sm">
                 <span className="text-[12px] sm:text-[13px] font-semibold text-slate-800">Rajeev Sir</span>
                 <span className="text-[9px] sm:text-[10px] text-violet-600 font-semibold uppercase tracking-wide bg-violet-50 border border-violet-200 px-1.5 py-0.5 rounded hidden sm:inline">
                     Teacher
                 </span>
             </div>

             {/* Audio bars */}
             <div className="absolute bottom-4 right-3 sm:bottom-5 sm:right-4">
                 <AudioBars />
             </div>

             {/* Student count chip — mobile only */}
             <div className="absolute top-3 right-3 sm:hidden flex items-center gap-1 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full border border-slate-200">
                 <Users size={10} className="text-slate-500" />
                 <span className="text-[10px] text-slate-500 font-medium">18</span>
             </div>
         </div>
  )
}

export default TeacherAudioOnlyCard