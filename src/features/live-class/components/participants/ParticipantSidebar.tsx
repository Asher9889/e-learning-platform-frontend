import { useParticipants } from "@livekit/components-react";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {  Users, Search } from "lucide-react";
import {  useAppSelector } from "@/store/hooks";
// import { setParticipantsOpen } from "@/features/live-class/store/liveClass.slice";
import { ParticipantCard } from "./ParticipantCard";
import { useMemo, useState } from "react";
import { useSingleSpeakerSystem } from "../../hooks/useSingleSpeakerSystem";
import { RoomEvent } from "livekit-client";

export function ParticipantSidebar() {
  // const dispatch = useAppDispatch();
  // const participantsOpen = useAppSelector((state) => state.liveClass.participantsOpen);
  const teacherIdentity = useAppSelector((state) => state.liveClass.teacherIdentity);
  const participantIdentity = useAppSelector((state) => state.liveClass.participantIdentity);
  // const myIdentity = useAppSelector(
  //   (state) => state?.auth?.user?.id
  // );
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
  const [searchQuery, setSearchQuery] = useState("");
const { activeSpeaker, fadeDuration } =
    useSingleSpeakerSystem(liveKitParticipants, teacherIdentity?.id);
  console.log("[ParticipantSidebar] liveKitParticipants:", liveKitParticipants);

  const participants = useMemo(() => {
    return liveKitParticipants.filter((p) => p.identity &&
      p.identity.trim() !== "")
      .map((p) => ({
        // identity: p.identity,
        // name: p.name || p.identity,
        // avatar: p.metadata ? extractAvatar(p.metadata) : undefined,
        // role: (p.identity === teacherIdentity?.id ? "teacher" : "student") as "teacher" | "student",
        // isMuted: p.isMicrophoneEnabled === false,
        // isCameraOff: p.isCameraEnabled === false,
        // handRaised: false,
        // isSpeaking: p.isSpeaking,
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
      }))
      .filter((p) =>
        searchQuery
          ? p.name.toLowerCase().includes(searchQuery.toLowerCase())
          : true
      ).sort((a, b) => {
                if (a.handRaised && !b.handRaised) return -1;
                if (!a.handRaised && b.handRaised) return 1;

                return 0;
            });
  }, [liveKitParticipants, teacherIdentity, searchQuery, activeSpeaker]);

  // if (!participantsOpen) return null;
  console.log("participantssidebar");
  return (
    <aside className="flex flex-col w-72 border-l bg-background shrink-0">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-semibold">Participants</span>
          <span className="text-xs text-muted-foreground">
            {liveKitParticipants.length}
          </span>
        </div>
        {/* <Button
          variant="ghost"
          size="icon"
          className="w-7 h-7"
          onClick={() => dispatch(setParticipantsOpen(false))}
        >
          <X className="w-4 h-4" />
        </Button> */}
      </div>

      <div className="px-3 pt-3 pb-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search participants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-2 pb-2">
        <div className="space-y-0.5">
          {participants.map((participant) => (
            <ParticipantCard
              key={participant.identity}
              participant={participant}
              isLocal={participant.identity === participantIdentity}
              fadeDuration={fadeDuration}
            />
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}

function extractAvatar(metadata: string): string | undefined {
  try {
    const parsed = JSON.parse(metadata);
    return parsed.avatar;
  } catch {
    return undefined;
  }
}



