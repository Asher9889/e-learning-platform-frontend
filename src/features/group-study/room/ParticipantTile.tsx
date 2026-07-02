import { cn } from "#lib/utils";
import { getInitials } from "@/utils/helper";
import { Crown, Mic, MicOff } from "lucide-react";

export function ParticipantTile({
  participant,
  isCreator,
}: any) {
  const micPub = participant.getTrackPublication("microphone" as any);
  const isMicOn = !!micPub && !micPub.isMuted;

  return (
    <div className="relative">
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary transition-all",
          participant.isSpeaking && "ring-2 ring-green-500 ring-offset-2"
        )}
      >
        {getInitials(participant.name || participant.identity)}
      </div>

      {isCreator && (
        <Crown
          className="absolute -right-1 -top-1 h-4 w-4 text-yellow-500"
          fill="currentColor"
        />
      )}

      <div
        className={cn(
          "absolute -bottom-1 -right-1 rounded-full border bg-background p-1",
          isMicOn ? "text-green-600" : "text-muted-foreground"
        )}
      >
        {isMicOn ? (
          <Mic className="h-3 w-3" />
        ) : (
          <MicOff className="h-3 w-3" />
        )}
      </div>

      <div className="mt-1 max-w-12 truncate text-center text-[10px]">
        {participant.name || participant.identity}
      </div>
    </div>
  );
}