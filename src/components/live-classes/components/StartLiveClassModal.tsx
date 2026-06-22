import { useState } from "react";
import { Radio, Copy, Check, ExternalLink, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "#components/ui/dialog";
import { Button } from "#components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
// import { useStartLiveClass } from "../hooks/useLiveClass";
import type { ILiveSession } from "../../../pages/Live-Classes/types";

interface StartLiveClassModalProps {
  liveClass: ILiveSession;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStarted?: (url: string) => void;
}

const StartLiveClassModal = ({liveClass, open, onOpenChange,onStarted }: StartLiveClassModalProps) => {

  const [copied, setCopied] = useState(false);
  const [isStarted, ] = useState(false);


  

  const handleStart = async () => { // go live now
    // setIsStarted(true);
    // onStarted?.(liveClass.meetingUrl || "https://live.example.com/room-123");
    console.log(liveClass,"selcetd class")
    if(!liveClass?.roomName) return;
    onStarted?.(liveClass?.roomName);

    
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 mb-2">
            <Radio className="h-6 w-6 text-red-500" />
          </div>
          <DialogTitle className="text-lg">
            {isStarted ? "You're Live!" : "Ready to Start?"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {isStarted
              ? "Your live class is now active. Students can join using the link below."
              : `Start "${liveClass.title}" now. Students will be notified.`}
          </DialogDescription>
        </DialogHeader>

        {!isStarted ? (
          <div className="mt-4 space-y-4">
            <Alert className="border-amber-500/20 bg-amber-500/5">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <AlertDescription className="text-xs text-amber-700 dark:text-amber-400">
                Once started, the class will be live for up to {liveClass.durationMinutes} minutes.
              </AlertDescription>
            </Alert>

            <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Recording</span>
                <span className="font-medium">{liveClass.isRecordingEnabled ? "Enabled" : "Off"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Chat</span>
                <span className="font-medium">{liveClass.isChatEnabled ? "Enabled" : "Off"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Screen Share</span>
                <span className="font-medium">{liveClass.isScreenShareAllowed ? "Allowed" : "Restricted"}</span>
              </div>
            </div>

            <Button
              className="w-full gap-2 bg-red-500 hover:bg-red-600"
              size="lg"
              onClick={handleStart}
              disabled={false}
            >
              <Radio className="h-4 w-4" />
              Go Live Now
            </Button>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Meeting Link
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 truncate rounded-lg bg-muted px-3 py-2.5 text-xs">
                  {"https://live.example.com/room-123"}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 shrink-0"
                  onClick={() => handleCopy("https://live.example.com/room-123")}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Passcode
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded-lg bg-muted px-3 py-2.5 text-xs font-mono tracking-widest">
                  { "ABC123"}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 shrink-0"
                  onClick={() => handleCopy("ABC123")}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              className="w-full gap-2"
              size="lg"
              onClick={() => window.open("https://live.example.com/room-123", "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
              Enter Live Room
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StartLiveClassModal;