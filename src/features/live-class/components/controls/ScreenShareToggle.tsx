import { useLocalParticipant } from "@livekit/components-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {  Monitor, MonitorOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { useEffect } from "react";

export function ScreenShareToggle() {
  const { localParticipant , isCameraEnabled} = useLocalParticipant();
  const isScreenSharing = localParticipant?.isScreenShareEnabled ?? false;
const myIdentity = useAppSelector(
        (state) => state?.auth?.user?.id
    );
    const teacherIdentity = useAppSelector((state) => state.liveClass.teacherIdentity);
    // const myId = myIdentity;
    const teacherId = teacherIdentity?.id;
  const toggle = async () => {
    if (!localParticipant) return;
    try {
      await localParticipant.setScreenShareEnabled(!isScreenSharing);
    } catch {
      // Screen share may be denied by browser
    }
  };
  

useEffect(() => {
  if (
    isScreenSharing &&
    !isCameraEnabled &&
    myIdentity !== teacherId
  ) {
    localParticipant.setScreenShareEnabled(false);
  }
}, [
  isCameraEnabled,
  isScreenSharing,
  localParticipant,
  myIdentity,
  teacherId,
]);
const getDisabled = () => {
  
  if (myIdentity === teacherId) {
    return false;
  }

  return !isCameraEnabled;
};
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={isScreenSharing ? "default" : "secondary"}
          size="icon"
          disabled={getDisabled()}
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
