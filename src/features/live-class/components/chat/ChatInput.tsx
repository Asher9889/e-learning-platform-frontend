import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useRoomContext } from "@livekit/components-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addMessage } from "@/features/live-class/store/liveClass.slice";

interface ChatInputProps {
  placeholder?: string;
  type?: "message" | "question" | "announcement";
}

export function ChatInput({
  placeholder = "Type a message...",
  type = "message",
}: ChatInputProps) {
  const [content, setContent] = useState("");
  const room = useRoomContext();
  const dispatch = useAppDispatch();
  const participantIdentity = useAppSelector(
    (state) => state.liveClass.participantIdentity
  );

  const send = useCallback(() => {
    const trimmed = content.trim();
    if (!trimmed) return;

    const message = {
      id: crypto.randomUUID(),
      senderId: participantIdentity ?? "unknown",
      senderName: room.localParticipant.name || "You",
      content: trimmed,
      timestamp: Date.now(),
      type,
    };

    dispatch(addMessage(message));

    try {
      room.localParticipant.publishData(
        new TextEncoder().encode(JSON.stringify(message)),
        { reliable: true }
      );
    } catch {
      // publish failed silently
    }

    setContent("");
  }, [content, dispatch, participantIdentity, room.localParticipant, type]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex items-center gap-2 p-3 border-t">
      <Input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="h-9 text-sm"
      />
      <Button
        size="icon"
        className="w-9 h-9 shrink-0 rounded-full"
        onClick={send}
        disabled={!content.trim()}
      >
        <Send className="w-4 h-4" />
      </Button>
    </div>
  );
}
