import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { ChatMessage as ChatMessageType } from "../../types";

interface ChatMessageProps {
  message: ChatMessageType;
  isOwn?: boolean;
}

export function ChatMessage({ message, isOwn }: ChatMessageProps) {
  const initials = message.senderName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={cn(
        "flex gap-2.5 px-4 py-2",
        isOwn && "flex-row-reverse"
      )}
    >
      <Avatar className="w-7 h-7 shrink-0 mt-0.5">
        <AvatarImage src={message.senderAvatar} alt={message.senderName} />
        <AvatarFallback className="text-[10px] font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className={cn("flex flex-col max-w-[85%]", isOwn && "items-end")}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">{message.senderName}</span>
          <span className="text-[10px] text-muted-foreground">{time}</span>
        </div>
        <div
          className={cn(
            "mt-0.5 rounded-2xl px-3 py-1.5 text-sm",
            isOwn
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground"
          )}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
}
