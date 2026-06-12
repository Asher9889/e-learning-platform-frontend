import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setActiveTab,
  setChatOpen,
} from "@/features/live-class/store/liveClass.slice";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import type { ChatTab } from "../../types";

export function ChatPanel() {
  const dispatch = useAppDispatch();
  const chatOpen = useAppSelector((state) => state.liveClass.chatOpen);
  const activeTab = useAppSelector((state) => state.liveClass.activeTab);
  const messages = useAppSelector((state) => state.liveClass.messages);
  const participantIdentity = useAppSelector(
    (state) => state.liveClass.participantIdentity
  );

  if (!chatOpen) return null;

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

  return (
    <aside className="flex flex-col w-80 border-l bg-background shrink-0">
      <Tabs
        value={activeTab}
        onValueChange={(v) => dispatch(setActiveTab(v as ChatTab))}
        className="flex flex-col flex-1 min-h-0"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
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
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7 shrink-0 ml-2"
            onClick={() => dispatch(setChatOpen(false))}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="flex-1 flex flex-col mt-0 min-h-0">
            <ScrollArea className="flex-1 py-2">
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
                filteredMessages(tab.value).map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    isOwn={msg.senderId === participantIdentity}
                  />
                ))
              )}
            </ScrollArea>
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
          </TabsContent>
        ))}
      </Tabs>
    </aside>
  );
}
