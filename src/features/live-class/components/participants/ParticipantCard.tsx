import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Mic, MicOff, Camera, CameraOff, Hand, Pin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ParticipantInfo } from "../../types";

interface ParticipantCardProps {
  participant: ParticipantInfo;
  isLocal?: boolean;
  onPin?: (identity: string) => void;
}

export function ParticipantCard({
  participant,
  isLocal,
  onPin,
}: ParticipantCardProps) {
  const initials = participant.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

    console.log("[ParticipantCard] participant:", participant);

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
        "hover:bg-muted/50 group",
        participant.isSpeaking && "ring-1 ring-green-500/50 bg-green-500/5",
        participant.isPinned && "ring-1 ring-primary/50 bg-primary/5"
      )}
    >
      <div className="relative shrink-0">
        <Avatar className="w-9 h-9">
          <AvatarImage src={participant.avatar} alt={participant.name} />
          <AvatarFallback className="text-xs font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        {participant.handRaised && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-500 text-[10px] text-white">
            <Hand className="w-2.5 h-2.5" />
          </span>
        )}
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
        <div className="flex items-center gap-1.5 mt-0.5">
          <Badge
            variant={participant.role === "teacher" ? "default" : "secondary"}
            className="h-4 px-1.5 text-[10px] font-medium"
          >
            {participant.role === "teacher" ? "Teacher" : "Student"}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className={cn(
                "w-7 h-7 flex items-center justify-center rounded-md transition-colors",
                participant.isMuted
                  ? "text-destructive"
                  : "text-muted-foreground"
              )}
            >
              {participant.isMuted ? (
                <MicOff className="w-3.5 h-3.5" />
              ) : (
                <Mic className="w-3.5 h-3.5" />
              )}
            </span>
          </TooltipTrigger>
          <TooltipContent side="left">
            {participant.isMuted ? "Muted" : "Unmuted"}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <span className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground">
              {participant.isCameraOff ? (
                <CameraOff className="w-3.5 h-3.5" />
              ) : (
                <Camera className="w-3.5 h-3.5" />
              )}
            </span>
          </TooltipTrigger>
          <TooltipContent side="left">
            {participant.isCameraOff ? "Camera off" : "Camera on"}
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
      </div>
    </div>
  );
}
