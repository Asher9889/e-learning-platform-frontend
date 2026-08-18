import { useState } from "react";
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
} from "@/components/ui/alert-dialog";
import { PhoneOff, AlertTriangle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface EndClassButtonProps {
  onConfirm: () => Promise<void>;
  endingLiveClass: boolean;
}

export function EndClassButton({ onConfirm, endingLiveClass }: EndClassButtonProps) {
  const [open, setOpen] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenChange = (nextOpen: boolean) => {
    if (endingLiveClass) return;
    setOpen(nextOpen);
    setError(null);
  };

  const handleEndClass = async (e: React.MouseEvent) => {
    e.preventDefault(); // prevents AlertDialogAction from closing the dialog
    try {
      setError(null);
      await onConfirm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to end class. Please try again.");
    } finally {
      // setIsLoading(false);
    }
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => setOpen(true)}
            size="icon"
            className="h-9 w-9 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 shadow-sm transition-colors duration-150"
          >
            <PhoneOff size={15} className="stroke-[2.25]" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          End class for everyone
        </TooltipContent>
      </Tooltip>

      <AlertDialog open={open} onOpenChange={handleOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/10">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <AlertDialogTitle>End Live Class?</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="space-y-2 pt-2">
              <p>This will end the live class for every participant.</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Students will immediately lose access to the live session.</li>
                <li>If recording is enabled, recording processing will begin automatically.</li>
              </ul>
              <p className="font-medium text-foreground">This action cannot be undone.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>

          {error && (
            <div className="px-4 py-3 rounded-md bg-destructive/10 border border-destructive/20 text-sm text-destructive">
              {error}
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={endingLiveClass}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleEndClass}
              disabled={endingLiveClass}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {endingLiveClass ? (
                <>
                  <Spinner />
                  Ending live class...
                </>
              ) : (
                "End Class"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
