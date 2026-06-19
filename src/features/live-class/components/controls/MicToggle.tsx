import { useLocalParticipant } from "@livekit/components-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Mic, MicOff } from "lucide-react";
import { useAppSelector } from "@/store/hooks";

export function MicToggle() {
  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant();
const myIdentity = useAppSelector(
        (state) => state?.auth?.user?.id
    );
    const teacherIdentity = useAppSelector((state) => state.liveClass.teacherIdentity);
    // const myId = myIdentity;
    const teacherId = teacherIdentity?.id;
  const toggle = () => {
    localParticipant?.setMicrophoneEnabled(!isMicrophoneEnabled);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={isMicrophoneEnabled ? "secondary" : "destructive"}
          size="icon"
           disabled={myIdentity !== teacherId}
          className="w-10 h-10 rounded-full"
          onClick={toggle}
        >
          {isMicrophoneEnabled ? (
            <Mic className="w-4 h-4" />
          ) : (
            <MicOff className="w-4 h-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">
        {isMicrophoneEnabled ? "Mute microphone" : "Unmute microphone"}
      </TooltipContent>
    </Tooltip>
  );
}
