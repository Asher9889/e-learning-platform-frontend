import { useEffect, useRef, useMemo } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LiveBadge } from "../components/status/LiveBadge";
import { ConnectionIndicator } from "../components/status/ConnectionIndicator";
import { ChatPanel } from "../components/chat/ChatPanel";
import { RoomAudioRenderer, useParticipants } from "@livekit/components-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import MainStageNew from "../components/stage/MainStageNew";
import { ClassroomControls } from "../components/controls/ClassroomControls";
import { useMediaQuery } from "#hooks/use-media-query";
import { setChatOpen } from "../store/liveClass.slice";
import { useRoomContext } from "@livekit/components-react";
import { useSingleSpeakerSystem } from "../hooks/useSingleSpeakerSystem";
import { RoomEvent } from "livekit-client";
import { ParticipantSidebar } from "../components/participants/ParticipantSidebar";
import { setParticipantsOpen } from "@/features/live-class/store/liveClass.slice";
import { Button } from "#components/ui/button";
import { PhoneOff } from "lucide-react";
import { useEndLiveClass } from "@/pages/Live-Classes/hooks/useLiveClass";
import { useIngressParticipant } from "../hooks/useIngressParticipant";
import { sileo } from "sileo";
import { useNavigate } from "react-router-dom";

function extractAvatar(metadata: string): string | undefined {
    try {
        const parsed = JSON.parse(metadata);
        return parsed.avatar;
    } catch {
        return undefined;
    }
}
export default function ClassRoomLayoutNew() {
    // const isTablet = useMediaQuery("(max-width: 1024px)");
    // const isMobile = useMediaQuery("(max-width: 768px)");
    const dispatch = useAppDispatch();

    const navigate = useNavigate()
    const room = useRoomContext();

    const { mutate } = useEndLiveClass();

    useIngressParticipant(); // Watch for ingress participants and update presenter state accordingly

    const classId = useAppSelector((state) => state.liveClass.classId);
    const participantsOpen = useAppSelector((state) => state.liveClass.participantsOpen);
    const chatOpen = useAppSelector((state) => state.liveClass.chatOpen);
    const title = useAppSelector((state) => state.liveClass.title);

    const previousRaisedUsers = useRef(new Set<string>());

    const liveKitParticipants = useParticipants({
        updateOnlyOn: [
            RoomEvent.ParticipantConnected,
            RoomEvent.ParticipantDisconnected,
            RoomEvent.ActiveSpeakersChanged,
            RoomEvent.TrackMuted,
            RoomEvent.TrackUnmuted,

            RoomEvent.LocalTrackPublished,
            RoomEvent.LocalTrackUnpublished,

            RoomEvent.TrackPublished,
            RoomEvent.TrackUnpublished,

            RoomEvent.ParticipantAttributesChanged,
            RoomEvent.ParticipantMetadataChanged,
        ],
    });

    const myIdentity = useAppSelector((state) => state?.auth?.user?.id);
    const teacherIdentity = useAppSelector((state) => state.liveClass.teacherIdentity);

    const teacherId = teacherIdentity?.id;
    const { activeSpeaker } = useSingleSpeakerSystem(liveKitParticipants, teacherId);

    const participants = useMemo(() => {
        return liveKitParticipants
            .filter((p) => p.identity &&
                p.identity.trim() !== "" && p.identity !== teacherIdentity?.id && p.identity !== myIdentity)
            .map((p) => ({
                identity: p.identity,
                name: p.name || p.identity,
                avatar: p.metadata ? extractAvatar(p.metadata) : undefined,
                role: (p.identity === teacherIdentity?.id ? "TEACHER" : "STUDENT") as "TEACHER" | "STUDENT",
                isMuted: p.isMicrophoneEnabled,
                isCameraOff: p.isCameraEnabled,
                handRaised: p.attributes?.handRaised === "true",
                // isSpeaking: p.isSpeaking,
                audioLevel: p.audioLevel || 0,
                isSpeaking: p.identity === activeSpeaker,
            })).sort((a, b) => {
                if (a.handRaised && !b.handRaised) return -1;
                if (!a.handRaised && b.handRaised) return 1;

                return 0;
            });

    }, [liveKitParticipants, teacherIdentity, myIdentity, activeSpeaker]);

    const audioRef = useRef<HTMLAudioElement | null>(null);

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
    useEffect(() => {
        const handleData = async (payload: Uint8Array, participant: any) => {
            const text = new TextDecoder().decode(payload);

            const data = JSON.parse(text);

            if (
                data.type === "CAMERA_OFF_ALL" &&
                data.targetStudentId === room.localParticipant.identity
            ) {
                room.localParticipant.setCameraEnabled(false);
            }
            if (
                data.type === "toggle-mic" &&
                data.targetId === room.localParticipant.identity
            ) {

                await room.localParticipant.setMicrophoneEnabled(
                    data.enabled
                );

            }
            if (
                data.type === "toggle-video" &&
                data.targetId === room.localParticipant.identity
            ) {

                await Promise.all([
                    room.localParticipant.setCameraEnabled(data.enabled),
                    room.localParticipant.setAttributes({
                        cameraOnAt: Date.now().toString(),
                    }),
                ]);

            }
        };

        const handleMetadata = (metadata: string) => {
            const data = JSON.parse(metadata);

            if (data.status === "ENDED") {
                console.log("Room ended event received");

                room.disconnect();

                sileo.info({
                    title: "Live Class ended",
                });

                navigate("/live-classes");
            }
        };

        room.on(RoomEvent.DataReceived, handleData);
        room.on("roomMetadataChanged", handleMetadata);

        return () => {
            room.off(RoomEvent.DataReceived, handleData);
            room.off("roomMetadataChanged", handleMetadata);
        };
    }, [room]);


    const totalSudents = liveKitParticipants.filter((p) => p.identity && p.identity.trim() !== "" && p.identity !== teacherIdentity?.id) || [];
    // const visibleStudents = isMobile ? participants.slice(0, 3) : isTablet ? participants.slice(0, 4) : participants;
    
    const handleEndClass = () => {
        if (!classId) return
        console.log("awdawdawdawdad")
        mutate(classId, {
            onSuccess: (response) => {
                console.log("Class ended:", response);
            },
            onError: (error) => {
                console.error(error);
            },
        });
    };

    return (
        <><style>{`
        @keyframes audioPulse {
          0%, 100% { transform: scaleY(0.4); opacity: 0.5; }
          50%      { transform: scaleY(1);   opacity: 1;   }
        }
      `}</style>

            <div className="flex flex-col h-dvh bg-slate-100 text-slate-900 font-sans overflow-hidden">

                {/* ══════════════ HEADER ══════════════ */}
                <header className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 bg-white border-b border-slate-200 shrink-0 gap-2">
                    <p className="text-xs sm:text-sm font-semibold tracking-wide truncate min-w-0">
                        <span className="text-slate-400 hidden sm:inline">Title: </span>
                        <span className="text-violet-600">{title}</span>
                        {/* <p className="hidden sm:inline truncate text-xs">Class started · 10:00 AM</p> */}

                    </p>

                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <LiveBadge />
                        <ConnectionIndicator />
                        <Button
                            onClick={handleEndClass}
                            size="icon"

                            className="bg-red-50 border border-red-200 text-red-600 hover:bg-red-100"
                            title="End Meeting for Everyone"
                        >
                            <PhoneOff size={16} />
                        </Button>
                        <span className="text-[11px] sm:text-xs text-slate-400 hidden sm:inline">{totalSudents?.length} students</span>
                    </div>
                </header>

                {/* ══════════════ Main Body ══════════════ */}

                <div className="flex flex-1 overflow-hidden">

                    {/* ── Main Area ── */}
                    <main className="flex flex-col flex-1 p-2 sm:p-3 lg:p-4 gap-2 sm:gap-3 overflow-hidden min-w-0">

                        {/* Teacher video */}
                        <MainStageNew participants={liveKitParticipants} />


                        <Sheet open={chatOpen} onOpenChange={() => dispatch(setChatOpen(false))}>
                            <SheetTrigger asChild>
                            </SheetTrigger>

                            <SheetContent side="right" className="w-80 p-0">
                                <ChatPanel />
                            </SheetContent>

                        </Sheet>
                        <Sheet open={participantsOpen} onOpenChange={() => dispatch(setParticipantsOpen(false))}>
                            <SheetTrigger asChild>

                            </SheetTrigger>

                            <SheetContent side="right" className="w-80 p-0">
                                <ParticipantSidebar />
                            </SheetContent>

                        </Sheet>
                        <ClassroomControls />
                        {/* Students strip */}

                    </main>
                    <aside className="hidden lg:flex w-70 xl:w-75 flex-col border-l border-slate-200 bg-white shrink-0">
                        <ChatPanel />
                    </aside>

                    <aside className="hidden lg:flex w-70 xl:w-75 flex-col border-l border-slate-200 bg-white shrink-0">
                        <ParticipantSidebar />
                    </aside>
                </div>

                <RoomAudioRenderer />
            </div>
        </>
    );
}