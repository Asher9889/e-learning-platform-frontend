import { useLocalParticipant } from "@livekit/components-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Video, VideoOff } from "lucide-react";

export function CameraToggle() {
  const { localParticipant, isCameraEnabled } = useLocalParticipant();

  const toggle = () => {
    localParticipant?.setCameraEnabled(!isCameraEnabled);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={isCameraEnabled ? "secondary" : "destructive"}
          size="icon"
          className="w-10 h-10 rounded-full"
          onClick={toggle}
        >
          {isCameraEnabled ? (
            <Video className="w-4 h-4" />
          ) : (
            <VideoOff className="w-4 h-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">
        {isCameraEnabled ? "Turn off camera" : "Turn on camera"}
      </TooltipContent>
    </Tooltip>
  );
}
