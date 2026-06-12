import { useLocalParticipant } from "@livekit/components-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Monitor, MonitorOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScreenShareToggle() {
  const { localParticipant } = useLocalParticipant();
  const isScreenSharing = localParticipant?.isScreenShareEnabled ?? false;

  const toggle = async () => {
    if (!localParticipant) return;
    try {
      await localParticipant.setScreenShareEnabled(!isScreenSharing);
    } catch {
      // Screen share may be denied by browser
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={isScreenSharing ? "default" : "secondary"}
          size="icon"
          className={cn(
            "w-10 h-10 rounded-full",
            isScreenSharing && "bg-primary text-primary-foreground"
          )}
          onClick={toggle}
        >
          {isScreenSharing ? (
            <MonitorOff className="w-4 h-4" />
          ) : (
            <Monitor className="w-4 h-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">
        {isScreenSharing ? "Stop sharing screen" : "Share screen"}
      </TooltipContent>
    </Tooltip>
  );
}
