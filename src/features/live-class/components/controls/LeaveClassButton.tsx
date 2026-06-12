import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRoomContext } from "@livekit/components-react";
import { useAppDispatch } from "@/store/hooks";
import { resetClassroom } from "@/features/live-class/store/liveClass.slice";

export function LeaveClassButton() {
  const navigate = useNavigate();
  const room = useRoomContext();
  const dispatch = useAppDispatch();

  const handleLeave = () => {
    room.disconnect();
    dispatch(resetClassroom());
    navigate("/live-classes");
  };

  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              className="w-10 h-10 rounded-full"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="top">Leave class</TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Leave class?</AlertDialogTitle>
          <AlertDialogDescription>
            You will be disconnected from the live class. You can rejoin later
            if the class is still active.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleLeave}>
            Leave class
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
