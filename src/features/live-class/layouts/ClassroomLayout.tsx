import { RoomAudioRenderer } from "@livekit/components-react";
import { cn } from "@/lib/utils";
import { MainStage } from "@/features/live-class/components/stage/MainStage";
import { ParticipantSidebar } from "@/features/live-class/components/participants/ParticipantSidebar";
import { ChatPanel } from "@/features/live-class/components/chat/ChatPanel";
import { ClassroomControls } from "@/features/live-class/components/controls/ClassroomControls";
import { ConnectionIndicator } from "@/features/live-class/components/status/ConnectionIndicator";
import { RecordingIndicator } from "@/features/live-class/components/status/RecordingIndicator";
import { LiveBadge } from "@/features/live-class/components/status/LiveBadge";
import { useAppSelector } from "@/store/hooks";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users } from "lucide-react";

export function ClassroomLayout() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const chatOpen = useAppSelector((state) => state.liveClass.chatOpen);
  const participantsOpen = useAppSelector((state) => state.liveClass.participantsOpen);

  const showSidePanels = !isTablet && (chatOpen || participantsOpen);

  return (
    <div className="h-screen w-screen overflow-hidden bg-background flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-2 border-b shrink-0">
        <div className="flex items-center gap-3">
          <LiveBadge />
          <RecordingIndicator />
        </div>
        <div className="flex items-center gap-2">
          {isMobile && (
            <>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0">
                  <ChatPanel />
                </SheetContent>
              </Sheet>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <Users className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72 p-0">
                  <ParticipantSidebar />
                </SheetContent>
              </Sheet>
            </>
          )}
          <ConnectionIndicator />
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Stage area */}
        <div
          className={cn(
            "flex-1 flex flex-col min-w-0",
            showSidePanels && "mr-0"
          )}
        >
          <div className="flex-1 p-4 flex items-center justify-center">
            <div className="w-full h-full max-w-6xl">
              <MainStage />
            </div>
          </div>

          {/* Controls dock */}
          <div className="shrink-0">
            <ClassroomControls />
          </div>
        </div>

        {/* Right panels - desktop only */}
        {!isTablet && (
          <div className="flex shrink-0">
            {participantsOpen && <ParticipantSidebar />}
            {chatOpen && <ChatPanel />}
          </div>
        )}
      </div>

      {/* Global audio renderer */}
      <RoomAudioRenderer />
    </div>
  );
}
