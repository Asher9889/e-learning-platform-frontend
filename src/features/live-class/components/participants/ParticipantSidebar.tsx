import { useParticipants } from "@livekit/components-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Users, Search } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setParticipantsOpen } from "@/features/live-class/store/liveClass.slice";
import { ParticipantCard } from "./ParticipantCard";
import { useMemo, useState } from "react";

export function ParticipantSidebar() {
  const dispatch = useAppDispatch();
  const participantsOpen = useAppSelector(
    (state) => state.liveClass.participantsOpen
  );
  const teacherIdentity = useAppSelector(
    (state) => state.liveClass.teacherIdentity
  );
  const participantIdentity = useAppSelector(
    (state) => state.liveClass.participantIdentity
  );

  const liveKitParticipants = useParticipants();
  const [searchQuery, setSearchQuery] = useState("");

  const participants = useMemo(() => {
    return liveKitParticipants
      .map((p) => ({
        identity: p.identity,
        name: p.name || p.identity,
        avatar: p.metadata ? extractAvatar(p.metadata) : undefined,
        role: (p.identity === teacherIdentity
          ? "teacher"
          : "student") as "teacher" | "student",
        isMuted: p.isMicrophoneEnabled === false,
        isCameraOff: p.isCameraEnabled === false,
        handRaised: false,
        isSpeaking: p.isSpeaking,
      }))
      .filter((p) =>
        searchQuery
          ? p.name.toLowerCase().includes(searchQuery.toLowerCase())
          : true
      );
  }, [liveKitParticipants, teacherIdentity, searchQuery]);

  if (!participantsOpen) return null;

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
        <Button
          variant="ghost"
          size="icon"
          className="w-7 h-7"
          onClick={() => dispatch(setParticipantsOpen(false))}
        >
          <X className="w-4 h-4" />
        </Button>
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
