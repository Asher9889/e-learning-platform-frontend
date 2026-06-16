import { useState, useCallback, useRef } from "react";
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
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);
  const participantIdentity = useAppSelector(
    (state) => state.liveClass.participantIdentity
  );

  const send = useCallback(async () => {
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
    await room.localParticipant.setAttributes({
      typing: "false",
    });

    isTypingRef.current = false;
    setContent("");

  }, [content, dispatch, participantIdentity, room.localParticipant, type]);


  const updateTypingStatus = async () => {
    if (!isTypingRef.current) {
      isTypingRef.current = true;

      await room.localParticipant.setAttributes({
        typing: "true",
      });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(async () => {
      isTypingRef.current = false;

      await room.localParticipant.setAttributes({
        typing: "false",
      });
    }, 1500);
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // const handleChange = async (
  //   e: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const value = e.target.value;
  //   setContent(value);

  //   room.localParticipant.setAttributes({
  //     typing: "true",
  //   });

  //   if (typingTimeoutRef.current) {
  //     clearTimeout(typingTimeoutRef.current);
  //   }

  //   typingTimeoutRef.current = setTimeout(() => {
  //     room.localParticipant.setAttributes({
  //       typing: "false",
  //     });
  //   }, 1500);
  // };
  return (
    <div className="flex items-center gap-2 p-3 border-t">
      <Input
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          updateTypingStatus();
        }}
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
