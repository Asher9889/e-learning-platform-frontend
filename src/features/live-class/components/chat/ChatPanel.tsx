import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { Button } from "@/components/ui/button";
// import { X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setActiveTab,
  // setChatOpen,
} from "@/features/live-class/store/liveClass.slice";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import type { ChatTab } from "../../types";
import { useEffect, useRef } from "react";
// import { useMediaQuery } from "#hooks/use-media-query";
import { useParticipants } from "@livekit/components-react";
import { useRoomContext } from "@livekit/components-react";
export function ChatPanel() {
  // const isTablet = useMediaQuery("(max-width: 1024px)");
  // const isMobile = useMediaQuery("(max-width: 768px)");

  const dispatch = useAppDispatch();
  const participants = useParticipants();
const room = useRoomContext();
  // const chatOpen = useAppSelector((state) => state.liveClass.chatOpen);
  const activeTab = useAppSelector((state) => state.liveClass.activeTab);
  const messages = useAppSelector((state) => state.liveClass.messages);
  const bottomRef = useRef<HTMLDivElement>(null);
  const participantIdentity = useAppSelector(
    (state) => state.liveClass.participantIdentity
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, activeTab]);
  const filteredMessages = (tab: ChatTab) =>
    messages.filter((m) => {
      if (tab === "chat") return m.type === "message";
      if (tab === "qa") return m.type === "question";
      return m.type === "announcement";
    });

  const tabs: { value: ChatTab; label: string }[] = [
    { value: "chat", label: "Chat" },
    { value: "qa", label: "Q&A" },
    { value: "announcements", label: "Announcements" },
  ];
  // if (!chatOpen) return null;
const typingUsers = participants.filter(
  (p) =>
    p.attributes?.typing === "true" &&
    p.identity !== room.localParticipant.identity
);
  return (
    <aside className="flex flex-col w-80 border-l h-full w-full bg-background shrink-0 ">
      <Tabs
        value={activeTab}
        onValueChange={(v) => dispatch(setActiveTab(v as ChatTab))}
        className="flex flex-col flex-1 min-h-0"
      >
        <div className="flex items-center justify-center px-4 py-3 border-b shrink-0">
          <TabsList className="h-8">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="text-xs h-7 px-3"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        {/* {(isTablet || isMobile) &&  <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7 shrink-0 ml-2"
            onClick={() => dispatch(setChatOpen(false))}
          >
            <X className="w-4 h-4" />
          </Button>} */}
        </div>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="flex-1 flex flex-col mt-0 min-h-0">
            <ScrollArea className="flex-1 min-h-0 py-2">
              {filteredMessages(tab.value).length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <p className="text-sm text-muted-foreground">
                    {tab.value === "chat"
                      ? "No messages yet"
                      : tab.value === "qa"
                        ? "No questions yet"
                        : "No announcements yet"}
                  </p>
                </div>
              ) : (
                <>
                {filteredMessages(tab.value).map((msg) => (
                  <>
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    isOwn={msg.senderId === participantIdentity}
                  />
                   <div ref={bottomRef} />
                   </>
                ))}
                <div ref={bottomRef} />
                </>
              )}
            </ScrollArea>
            <div className="shrink-0 border-t">
 {typingUsers.length > 0 && (
    <div className="px-3 py-2 text-xs text-muted-foreground italic">
      {typingUsers.length === 1
        ? `${typingUsers[0].name} is typing...`
        : `${typingUsers.length} students are typing...`}
    </div>
  )}
              <ChatInput
                placeholder={
                  tab.value === "chat"
                    ? "Type a message..."
                    : tab.value === "qa"
                      ? "Ask a question..."
                      : "Make an announcement..."
                }
                type={tab.value === "qa" ? "question" : tab.value === "announcements" ? "announcement" : "message"}
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </aside>
  );
}
