import type { Participant } from "livekit-client";
import { ParticipantTile } from "./ParticipantTile";

interface ParticipantListProps {
  participants: Participant[];
  creatorIdentity?: string;
}

export function ParticipantList({
  participants,
  creatorIdentity,
}: ParticipantListProps) {
  return (
    <div className="rounded-xl border bg-background/90 p-2.5 shadow-xl backdrop-blur-md">
      <div className="flex flex-wrap gap-2">
        {participants.map((p) => (
          <ParticipantTile
            key={p.sid || p.identity}
            participant={p}
            isCreator={p.identity === creatorIdentity}
          />
        ))}
      </div>
    </div>
  );
}