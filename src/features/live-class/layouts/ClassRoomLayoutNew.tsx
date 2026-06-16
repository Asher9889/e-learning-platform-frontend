// import React from 'react'

// function ClassRoomLayoutNew() {
//   return (
//     <div>ClassRoomLayoutNew</div>
//   )
// }

// export default ClassRoomLayoutNew
import { useEffect, useRef, useMemo } from "react";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import {
//     Mic,
//     MicOff,
//     Video,
//     VideoOff,
//     Monitor,
//     Hand,
//     PhoneOff,
//     Send,
//     Users,
//     MessageSquare,
// } from "lucide-react";
import { LiveBadge } from "../components/status/LiveBadge";
// import { RecordingIndicator } from "../components/status/RecordingIndicator";
import { ConnectionIndicator } from "../components/status/ConnectionIndicator";
import { ChatPanel } from "../components/chat/ChatPanel";
import { RoomAudioRenderer, useParticipants } from "@livekit/components-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import MainStageNew from "../components/stage/MainStageNew";
import { ClassroomControls } from "../components/controls/ClassroomControls";
import { useMediaQuery } from "#hooks/use-media-query";
import { setChatOpen } from "../store/liveClass.slice";
// import { RoomEvent } from "livekit-client";
import notificationSound from "@/assets/sounds/notification.mp3";
// import { useRoomContext } from "@livekit/components-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import handRaiseAnimation from "@/assets/animations/hand-raise.lottie";
import { useSingleSpeakerSystem } from "../hooks/useSingleSpeakerSystem";
// ─── Types ────────────────────────────────────────────────────────────────────

interface Student {
    id: string;
    name: string;
    initials: string;
    gradient: string;
    status: "speaking" | "online" | "hand" | "muted";
}

// interface ChatMessage {
//     id: string;
//     user: string;
//     role?: "teacher";
//     time: string;
//     text: string;
//     color: string;
// }

// ─── Data ─────────────────────────────────────────────────────────────────────

// const STUDENTS: Student[] = [
//     { id: "1", name: "Priya", initials: "P", gradient: "from-orange-400 to-red-400", status: "speaking" },
//     { id: "2", name: "Arjun", initials: "A", gradient: "from-sky-400 to-blue-500", status: "online" },
//     { id: "3", name: "Sneha", initials: "S", gradient: "from-violet-400 to-purple-500", status: "online" },
//     { id: "4", name: "Rahul", initials: "R", gradient: "from-emerald-400 to-teal-500", status: "hand" },
//     { id: "5", name: "Meera", initials: "M", gradient: "from-amber-400 to-yellow-400", status: "online" },
//     { id: "6", name: "Karan", initials: "K", gradient: "from-slate-400 to-slate-500", status: "muted" },
// ];

// const INITIAL_MESSAGES: ChatMessage[] = [
//     { id: "1", user: "Priya", time: "10:32", text: "Sir, can you explain the quadratic formula again?", color: "text-violet-600" },
//     { id: "2", user: "Rajeev Sir", role: "teacher", time: "10:33", text: "Sure Priya, let me write it on the board.", color: "text-blue-600" },
//     { id: "3", user: "Arjun", time: "10:34", text: "👍 Thank you sir", color: "text-emerald-600" },
//     { id: "4", user: "Sneha", time: "10:35", text: "Sir I have a doubt about the discriminant value", color: "text-pink-600" },
//     { id: "5", user: "Rahul", time: "10:36", text: "Same doubt as Sneha 🙋", color: "text-violet-600" },
//     { id: "6", user: "Rajeev Sir", role: "teacher", time: "10:37", text: "Good question! When discriminant b²−4ac > 0, we get 2 real roots. Let me demonstrate.", color: "text-blue-600" },
// ];

// ─── Sub-components ───────────────────────────────────────────────────────────

// function LiveDot() {
//     return (
//         <span className="relative flex h-2 w-2 shrink-0">
//             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
//             <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
//         </span>
//     );
// }

// function AudioBars({ className = "" }: { className?: string }) {
//     return (
//         <div className={`flex items-end gap-[2px] ${className}`}>
//             {[6, 12, 8, 15, 6].map((h, i) => (
//                 <div
//                     key={i}
//                     className="w-[3px] rounded-sm bg-emerald-500"
//                     style={{
//                         height: `${h}px`,
//                         animation: `audioPulse 0.8s ${i * 0.15}s ease-in-out infinite`,
//                     }}
//                 />
//             ))}
//         </div>
//     );
// }

function StudentStatusLabel({ status }: { status: Student["status"] }) {
    if (status === "speaking") return <span className="text-[10px] text-emerald-600 font-medium">● Speaking</span>;
    if (status === "online") return <span className="text-[10px] text-emerald-500 font-medium">● Online</span>;
    if (status === "hand") return <span className="text-[10px] text-amber-500">✋ Raised</span>;
    return <span className="text-[10px] text-slate-400">🔇 Muted</span>;
}

// ─── Chat Panel ───────────────────────────────────────────────────────────────

// function ChatPanel({
//     messages,
//     message,
//     setMessage,
//     onSend,
// }: {
//     messages: ChatMessage[];
//     message: string;
//     setMessage: (v: string) => void;
//     onSend: () => void;
// }) {
//     const bottomRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [messages]);

//     return (
//         <div className="flex flex-col flex-1 overflow-hidden">
//             <ScrollArea className="flex-1 px-3 py-3">
//                 <div className="flex flex-col gap-3.5">
//                     {messages.map((msg) => (
//                         <div key={msg.id}>
//                             <div className="flex items-center gap-1.5 mb-0.5">
//                                 <span className={`text-[12px] font-semibold ${msg.color}`}>{msg.user}</span>
//                                 {msg.role === "teacher" && (
//                                     <span className="text-[9px] bg-violet-100 text-violet-600 font-semibold px-1.5 py-0.5 rounded uppercase tracking-wide">
//                                         Teacher
//                                     </span>
//                                 )}
//                                 <span className="text-[10px] text-slate-400">{msg.time}</span>
//                             </div>
//                             <p className="text-[13px] text-slate-600 leading-relaxed">{msg.text}</p>
//                         </div>
//                     ))}
//                     <div ref={bottomRef} />
//                 </div>
//             </ScrollArea>

//             <Separator className="bg-slate-100" />

//             <div className="flex gap-2 p-3">
//                 <Input
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     onKeyDown={(e) => e.key === "Enter" && onSend()}
//                     placeholder="Type a message…"
//                     className="flex-1 bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 text-[13px] rounded-lg h-9 focus-visible:ring-violet-400/40"
//                 />
//                 <Button
//                     size="icon"
//                     onClick={onSend}
//                     className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg w-9 h-9 shrink-0"
//                 >
//                     <Send size={14} />
//                 </Button>
//             </div>
//         </div>
//     );
// }

// ─── Main Component ───────────────────────────────────────────────────────────
function extractAvatar(metadata: string): string | undefined {
    try {
        const parsed = JSON.parse(metadata);
        return parsed.avatar;
    } catch {
        return undefined;
    }
}
export default function ClassRoomLayoutNew() {
    // const [seconds, setSeconds] = useState(42 * 60 + 17);
    // const [message, setMessage] = useState("");
    const isTablet = useMediaQuery("(max-width: 1024px)");
    const isMobile = useMediaQuery("(max-width: 768px)");
    const dispatch = useAppDispatch();
    // const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);

    // const [raisedHands, setRaisedHands] = useState<
    //     Record<string, boolean>
    // >({});
    const previousRaisedUsers = useRef(new Set<string>());
    // const room = useRoomContext();
    // const [chatOpen, setChatOpen] = useState(false);
    const chatOpen = useAppSelector((state) => state.liveClass.chatOpen);
    const title = useAppSelector(
        (state) => state.liveClass.title
    );
    const liveKitParticipants = useParticipants();
    // const participantIdentities = useMemo(
    //     () => liveKitParticipants.map(p => p.identity).join(","),
    //     [liveKitParticipants]
    // );
    const myIdentity = useAppSelector(
        (state) => state?.auth?.user?.id
    );
    const teacherIdentity = useAppSelector((state) => state.liveClass.teacherIdentity);
    // const myId = myIdentity;
    const teacherId = teacherIdentity?.id;
    const { activeSpeaker, fadeDuration } =
        useSingleSpeakerSystem(liveKitParticipants, teacherId);


    // useEffect(() => {
    //     const check = () => {
    //         setIsMobile(window.innerWidth < 640);
    //         setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    //     };
    //     check();
    //     window.addEventListener("resize", check);
    //     return () => window.removeEventListener("resize", check);
    // }, []);

    // useEffect(() => {
    //     const handleData = (
    //         payload: Uint8Array,
    //         participant?: any
    //     ) => {
    //         try {
    //             const data = JSON.parse(
    //                 new TextDecoder().decode(payload)
    //             );

    //             if (data.type === "hand_raise") {
    //                 setRaisedHands((prev) => ({
    //                     ...prev,
    //                     [participant?.identity]: data.raised,
    //                 }));
    //             }
    //         } catch (err) {
    //             console.error(err);
    //         }
    //     };

    //     room.on(RoomEvent.DataReceived, handleData);

    //     return () => {
    //         room.off(RoomEvent.DataReceived, handleData);
    //     };
    // }, [room]);

    const participants = useMemo(() => {
        return liveKitParticipants
            .filter((p) => p.identity &&
                p.identity.trim() !== "" && p.identity !== teacherIdentity?.id && p.identity !== myIdentity)
            .map((p) => ({
                identity: p.identity,
                name: p.name || p.identity,
                avatar: p.metadata ? extractAvatar(p.metadata) : undefined,
                role: (p.identity === teacherIdentity?.id ? "TEACHER" : "STUDENT") as "TEACHER" | "STUDENT",
                isMuted: p.isMicrophoneEnabled === false,
                isCameraOff: p.isCameraEnabled === false,
                handRaised: p.attributes?.handRaised === "true",
                // isSpeaking: p.isSpeaking,
                audioLevel: p.audioLevel || 0,
                isSpeaking: p.identity === activeSpeaker,
            })).sort((a, b) => {
                if (a.handRaised && !b.handRaised) return -1;
                if (!a.handRaised && b.handRaised) return 1;

                return 0;
            });
        // .filter((p) =>
        //     searchQuery
        //         ? p.name.toLowerCase().includes(searchQuery.toLowerCase())
        //         : true
        // );
    }, [liveKitParticipants, teacherIdentity, myIdentity, activeSpeaker]);

    // Timer
    // useEffect(() => {
    //     const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    //     return () => clearInterval(id);
    // }, []);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audioRef.current = new Audio(notificationSound);
        audioRef.current.volume = 0.8;
        audioRef.current.load();

        const unlock = () => {
            audioRef.current?.play().then(() => {
                audioRef.current?.pause();
                audioRef.current!.currentTime = 0;
            }).catch(() => { });
            document.removeEventListener("click", unlock);
            document.removeEventListener("touchstart", unlock);
        };

        document.addEventListener("click", unlock, { once: true });
        document.addEventListener("touchstart", unlock, { once: true });
    }, []);
    // const formatTime = (s: number) => {
    //     const h = Math.floor(s / 3600);
    //     const m = Math.floor((s % 3600) / 60);
    //     const sec = s % 60;
    //     return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    // };

    // const handleSend = () => {
    //     if (!message.trim()) return;
    //     setMessages((prev) => [
    //         ...prev,
    //         {
    //             id: Date.now().toString(),
    //             user: "You",
    //             time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    //             text: message.trim(),
    //             color: "text-violet-600",
    //         },
    //     ]);
    //     setMessage("");
    // };
    useEffect(() => {
        participants.forEach((participant) => {
            if (
                participant.handRaised &&
                !previousRaisedUsers.current.has(participant.identity)
            ) {
                if (audioRef.current) {
                    audioRef.current.currentTime = 0;
                    audioRef.current.play().catch((err) => {
                        console.error("🔔 Audio play failed:", err);
                    });
                }
                previousRaisedUsers.current.add(participant.identity);
            }

            if (!participant.handRaised) {
                previousRaisedUsers.current.delete(participant.identity);
            }
        });
    }, [participants]);
    const totalSudents = liveKitParticipants
        .filter((p) => p.identity &&
            p.identity.trim() !== "" && p.identity !== teacherIdentity?.id) || [];
    const visibleStudents = isMobile
        ? participants.slice(0, 3)
        : isTablet
            ? participants.slice(0, 4)
            : participants;
    // const tabTriggerClass =
    //     "flex-1 rounded-none py-2.5 text-xs font-semibold tracking-wide text-slate-400 " +
    //     "data-[state=active]:text-violet-600 data-[state=active]:border-b-2 " +
    //     "data-[state=active]:border-violet-500 data-[state=active]:bg-transparent " +
    //     "data-[state=active]:shadow-none";


    console.log(visibleStudents, "visibleStudentsvisibleStudentsvisibleStudents", liveKitParticipants)
    return (
        <>
            <style>{`
        @keyframes audioPulse {
          0%, 100% { transform: scaleY(0.4); opacity: 0.5; }
          50%       { transform: scaleY(1);   opacity: 1;   }
        }
      `}</style>

            <div className="flex flex-col h-[100dvh] bg-slate-100 text-slate-900 font-sans overflow-hidden">

                {/* ══════════════ HEADER ══════════════ */}
                <header className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 bg-white border-b border-slate-200 shrink-0 gap-2">
                    <p className="text-xs sm:text-sm font-semibold tracking-wide truncate min-w-0">
                        <span className="text-slate-400 hidden sm:inline">Title: </span>
                        <span className="text-violet-600">{title}</span>
                        {/* <p className="hidden sm:inline truncate text-xs">Class started · 10:00 AM</p> */}

                    </p>
                    {/* <span className="font-mono text-[12px] sm:text-[13px] text-violet-600 font-semibold shrink-0">
                        {formatTime(seconds)}
                    </span> */}
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <LiveBadge />
                        <ConnectionIndicator />
                        <span className="text-[11px] sm:text-xs text-slate-400 hidden sm:inline">{totalSudents?.length} students</span>
                    </div>
                </header>
                {/* ══════════════ FOOTER ══════════════ */}
                {/* <footer className="flex items-center justify-between px-3 sm:px-6 py-2 sm:py-2.5 bg-white border-t border-slate-200 text-[11px] sm:text-xs text-slate-400 shrink-0 gap-2">
          
          
        </footer> */}
                {/* ══════════════ BODY ══════════════ */}
                <div className="flex flex-1 overflow-hidden">

                    {/* ── Main Area ── */}
                    <main className="flex flex-col flex-1 p-2 sm:p-3 lg:p-4 gap-2 sm:gap-3 overflow-hidden min-w-0">

                        {/* Teacher video */}
                        <MainStageNew participants={liveKitParticipants} />

                        {/* Controls */}
                        {/* <div className="flex items-center justify-center gap-2 sm:gap-2.5 py-0.5 sm:py-1">
                            <Button
                                size="icon"
                                variant="outline"
                                onClick={() => setMicOn((v) => !v)}
                                className={`rounded-full w-9 h-9 sm:w-10 sm:h-10 border-slate-200 ${micOn
                                    ? "bg-white text-slate-600 hover:bg-slate-50"
                                    : "bg-red-50 border-red-200 text-red-500 hover:bg-red-100"
                                    }`}
                            >
                                {micOn ? <Mic size={14} /> : <MicOff size={14} />}
                            </Button>

                            <Button
                                size="icon"
                                variant="outline"
                                onClick={() => setCamOn((v) => !v)}
                                className={`rounded-full w-9 h-9 sm:w-10 sm:h-10 border-slate-200 ${camOn
                                    ? "bg-white text-slate-600 hover:bg-slate-50"
                                    : "bg-white text-slate-400 hover:bg-slate-50"
                                    }`}
                            >
                                {camOn ? <Video size={14} /> : <VideoOff size={14} />}
                            </Button>

                            <Button
                                size="icon"
                                variant="outline"
                                className="rounded-full w-9 h-9 sm:w-10 sm:h-10 bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hidden xs:flex"
                            >
                                <Monitor size={14} />
                            </Button>

                            <Button
                                size="icon"
                                variant="outline"
                                className="rounded-full w-9 h-9 sm:w-10 sm:h-10 bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                            >
                                <Hand size={14} />
                            </Button>

                            Chat trigger — mobile/tablet bottom sheet comment
                            <Sheet open={chatOpen} onOpenChange={setChatOpen}>
                                <SheetTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="rounded-full w-9 h-9 sm:w-10 sm:h-10 bg-white border-slate-200 text-slate-600 hover:bg-slate-50 lg:hidden flex"
                                    >
                                        <MessageSquare size={14} />
                                    </Button>
                                </SheetTrigger>
                                
                                <SheetContent side="right" className="w-80 p-0">
                                    <ChatPanel />
                                </SheetContent>
                            </Sheet>

                            <Button
                                size="icon"
                                variant="outline"
                                className="rounded-full w-9 h-9 sm:w-10 sm:h-10 bg-red-50 border-red-200 text-red-500 hover:bg-red-100"
                            >
                                <PhoneOff size={14} />
                            </Button>
                        </div> */}
                        <Sheet open={chatOpen} onOpenChange={() => dispatch(setChatOpen(false))}>
                            <SheetTrigger asChild>
                                {/* <Button
                                        size="icon"
                                        variant="outline"
                                        className="rounded-full w-9 h-9 sm:w-10 sm:h-10 bg-white border-slate-200 text-slate-600 hover:bg-slate-50 lg:hidden flex"
                                    >
                                        <MessageSquare size={14} />
                                    </Button> */}
                            </SheetTrigger>

                            <SheetContent side="right" className="w-80 p-0">
                                <ChatPanel />
                            </SheetContent>
                        </Sheet>
                        <ClassroomControls />
                        {/* Students strip */}
                        <div className="flex gap-1.5 sm:gap-2">
                            {visibleStudents.map((s) => (

                                <div
                                    key={s.identity}
                                    className="flex-1 rounded-lg bg-white border px-2 py-1.5 sm:px-2.5 sm:py-2 flex items-center gap-1.5 sm:gap-2 min-w-0 shadow-sm"
                                    style={{
                                        borderColor: s.isSpeaking ? "#4ade80" : "#e2e8f0",
                                        boxShadow: s.isSpeaking
                                            ? "0 0 0 1.5px #4ade8066"
                                            : "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                                        // Smooth transition on border/shadow — duration matches hook fade
                                        transition: `border-color ${fadeDuration}ms ease, box-shadow ${fadeDuration}ms ease`,
                                    }}
                                >
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-slate-500 to-slate-300 flex items-center justify-center text-[11px] sm:text-[13px] font-semibold text-white shrink-0">
                                        {s.avatar ? (
                                            <img
                                                src={s.avatar}
                                                alt={s.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = "none";
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-500 to-slate-300 flex items-center justify-center text-[11px] sm:text-[13px] font-semibold text-white">
                                                {s.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-w-0 hidden sm:block">
                                        <div className="flex items-center gap-1">
                                            <p className="text-[11px] sm:text-[12px] font-semibold text-slate-700 truncate">
                                                {s.name}
                                            </p>

                                            {s.handRaised && (
                                                <DotLottieReact src={handRaiseAnimation} autoplay loop />
                                            )}

                                            {/* Speaking indicator — fades in/out via opacity transition */}
                                            <span
                                                className="ml-1 flex items-center gap-[2px]"
                                                style={{
                                                    opacity: s.isSpeaking ? 1 : 0,
                                                    transition: `opacity ${fadeDuration}ms ease`,
                                                    // pointer-events none when hidden so it doesn't block clicks
                                                    pointerEvents: s.isSpeaking ? "auto" : "none",
                                                }}
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                <span className="text-[10px] text-green-600 font-medium">speaking</span>
                                            </span>
                                        </div>

                                        <StudentStatusLabel status="online" />
                                    </div>
                                </div>
                            ))}

                            {participants.length > visibleStudents.length && (
                                <div className="shrink-0 rounded-lg bg-white border border-slate-200 px-2 py-1.5 flex items-center justify-center shadow-sm">
                                    <span className="text-[11px] text-slate-400 font-medium">
                                        +{participants.length - visibleStudents.length}
                                    </span>
                                </div>
                            )}
                        </div>
                    </main>

                    {/* ── Desktop Sidebar (lg+) ── */}
                    {/* <aside className="hidden lg:flex w-[280px] xl:w-[300px] flex-col border-l border-slate-200 bg-white shrink-0"> */}
                    {/* <Tabs defaultValue="chat" className="flex flex-col flex-1 overflow-hidden">
                            <TabsList className="w-full rounded-none border-b border-slate-200 bg-transparent h-auto p-0">
                                {["Chat", "Q&A", "Poll"].map((t) => (
                                    <TabsTrigger key={t} value={t.toLowerCase()} className={tabTriggerClass}>
                                        {t}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            <TabsContent value="chat" className="flex-1 overflow-hidden flex flex-col mt-0 data-[state=active]:flex">
                                <ChatPanel />
                            </TabsContent>
                            <TabsContent value="q&a" className="flex-1 flex items-center justify-center mt-0">
                                <p className="text-xs text-slate-400">No questions yet</p>
                            </TabsContent>
                            <TabsContent value="poll" className="flex-1 flex items-center justify-center mt-0">
                                <p className="text-xs text-slate-400">No active poll</p>
                            </TabsContent>
                        </Tabs> */}
                    <aside className="hidden lg:flex w-[280px] xl:w-[300px] flex-col border-l border-slate-200 bg-white shrink-0">
                        <ChatPanel />
                    </aside>

                    {/* </aside> */}
                </div>

                <RoomAudioRenderer />
            </div>
        </>
    );
}