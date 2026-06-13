import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleChat, toggleParticipants } from "@/features/live-class/store/liveClass.slice";
import { MicToggle } from "./MicToggle";
import { CameraToggle } from "./CameraToggle";
import { ScreenShareToggle } from "./ScreenShareToggle";
import { RaiseHandButton } from "./RaiseHandButton";
import { LeaveClassButton } from "./LeaveClassButton";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MessageSquare, Users, MessageSquareOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function ClassroomControls() {
  const dispatch = useAppDispatch();
  const chatOpen = useAppSelector((state) => state.liveClass.chatOpen);
  const participantsOpen = useAppSelector(
    (state) => state.liveClass.participantsOpen
  );

  return (
    <div className="flex items-center justify-center px-4 py-3">
      <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-background/80 backdrop-blur-xl border shadow-lg">
        <MicToggle />
        <CameraToggle />
        <ScreenShareToggle />

        <div className="w-px h-8 bg-border mx-1" />

        <RaiseHandButton />

        <div className="w-px h-8 bg-border mx-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "w-10 h-10 rounded-full lg:hidden",
                chatOpen && "bg-muted text-foreground"
              )}
              onClick={() => dispatch(toggleChat())}
            >
              {chatOpen ? (
                <MessageSquare className="w-4 h-4" />
              ) : (
                <MessageSquareOff className="w-4 h-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            {chatOpen ? "Close chat" : "Open chat"}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "w-10 h-10 rounded-full",
                participantsOpen && "bg-muted text-foreground"
              )}
              onClick={() => dispatch(toggleParticipants())}
            >
              <Users className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            {participantsOpen ? "Hide participants" : "Show participants"}
          </TooltipContent>
        </Tooltip>

        <div className="w-px h-8 bg-border mx-1" />

        <LeaveClassButton />
      </div>
    </div>
  );
}
