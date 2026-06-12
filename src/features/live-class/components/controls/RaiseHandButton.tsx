import { useRoomContext } from "@livekit/components-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Hand } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setHandRaised } from "@/features/live-class/store/liveClass.slice";
import { cn } from "@/lib/utils";

export function RaiseHandButton() {
  const dispatch = useAppDispatch();
  const handRaised = useAppSelector((state) => state.liveClass.handRaised);
  const room = useRoomContext();

  const toggle = async () => {
    const newState = !handRaised;
    dispatch(setHandRaised(newState));

    try {
      await room.localParticipant.publishData(
        new TextEncoder().encode(
          JSON.stringify({ type: "hand_raise", raised: newState })
        ),
        { reliable: true }
      );
    } catch {
      // fallback silently
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={handRaised ? "default" : "secondary"}
          size="icon"
          className={cn(
            "w-10 h-10 rounded-full",
            handRaised && "bg-yellow-500 hover:bg-yellow-600 text-white"
          )}
          onClick={toggle}
        >
          <Hand className="w-4 h-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">
        {handRaised ? "Lower hand" : "Raise hand"}
      </TooltipContent>
    </Tooltip>
  );
}
