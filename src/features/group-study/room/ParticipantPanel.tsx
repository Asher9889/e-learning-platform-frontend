import { Mic, MicOff, Crown } from "lucide-react";
import type { Participant, LocalParticipant } from "livekit-client";

interface ParticipantPanelProps {
  participants: Participant[];
  localParticipant: LocalParticipant | null;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function ParticipantPanel({
  participants,
  localParticipant,
}: ParticipantPanelProps) {
  return (
    <div className="h-full overflow-y-auto bg-muted/20 p-4">
      {participants.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center text-center gap-1">
          <p className="text-sm text-muted-foreground">No participants</p>
        </div>
      ) : (
        <div className="space-y-2">
          {participants.map((participant) => {
            const isLocal = participant.identity === localParticipant?.identity;
            const metaData = JSON.parse(participant.metadata ?? "{}");
            const isCreator = metaData?.roomCreator;
            const micEnabled =
              participant.isMicrophoneEnabled ?? participant.isSpeaking;

            const displayName = participant.name || participant.identity;

            return (
              <div
                key={participant.identity}
                className="flex items-center justify-between rounded-lg border bg-background p-3 shadow-sm"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {getInitials(displayName)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-sm font-medium">
                        {displayName}
                      </span>

                      {isLocal && (
                        <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                          You
                        </span>
                      )}

                      {isCreator && (
                        <Crown className="h-3.5 w-3.5 shrink-0 text-yellow-500" />
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full ${
                    micEnabled
                      ? "bg-green-500/10 text-green-600"
                      : "bg-red-500/10 text-red-500"
                  }`}
                >
                  {micEnabled ? (
                    <Mic className="h-3.5 w-3.5" />
                  ) : (
                    <MicOff className="h-3.5 w-3.5" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}