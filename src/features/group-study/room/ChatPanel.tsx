import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import type { IChatMessage } from "../hooks/use-livekit-room";
import { useAppSelector } from "@/store/hooks";

interface ChatPanelProps {
  messages: IChatMessage[];
  onSend: (message: string) => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function ChatPanel({ messages, onSend }: ChatPanelProps) {
  const [message, setMessage] = useState("");
  const userId = useAppSelector((state) => state?.auth?.user?.id);
  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message);
    setMessage("");
  };

  return (
    <div className="flex h-full flex-col bg-muted/20">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center gap-2">
            <p className="text-sm text-muted-foreground">No messages yet</p>
            <p className="text-xs text-muted-foreground/70">
              Say hi to get the conversation going 👋
            </p>
          </div>
        )}

        {messages.map((msg) => {
          const isMine = msg.senderId === userId;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                isMine ? "flex-row-reverse" : ""
              }`}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {getInitials(msg.senderName)}
              </div>

              <div
                className={`min-w-0 flex-1 flex flex-col ${
                  isMine ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`flex items-baseline gap-2 ${
                    isMine ? "flex-row-reverse" : ""
                  }`}
                >
                  <span className="text-xs font-semibold truncate">
                    {isMine ? "You" : msg.senderName}
                  </span>
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div
                  className={`mt-1 inline-block max-w-[80%] rounded-lg px-3 py-2 text-sm break-words shadow-sm ${
                    isMine
                      ? "rounded-tr-sm bg-primary text-primary-foreground"
                      : "rounded-tl-sm bg-background border"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t bg-background p-3 flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-full border bg-muted/40 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />

        <Button
          onClick={handleSend}
          size="icon"
          className="shrink-0 rounded-full"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}