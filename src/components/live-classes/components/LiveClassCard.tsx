import { Video, Users, Clock, Calendar, Radio } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ILiveSession } from "../../../pages/Live-Classes/types";

interface LiveClassCardProps {
  liveClass: ILiveSession;
  onStart?: (id: string) => void;
  onJoin?: (roomName: string) => void;
  variant?: "UPCOMING" | "LIVE" | "ENDED";
}

const LiveClassCard = ({
  liveClass,
  onStart,
  onJoin,
  variant = "UPCOMING",
}: LiveClassCardProps) => {
  const isLive = variant === "LIVE";
  const isUpcoming = variant === "UPCOMING";

  const scheduledAt = liveClass.scheduledAt ? new Date(liveClass.scheduledAt) : null;

  console.log("LiveClassCard Rendered", { liveClass, variant });
  return (
    <Card
      className={cn(
        "group relative overflow-hidden border transition-all hover:shadow-md",
        isLive && "border-primary/30 bg-primary/5"
      )}
    >
      {isLive && (
        <div className="absolute right-3 top-3 flex items-center gap-1.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
          </span>
          <Badge variant="destructive" className="h-5 text-[10px] font-semibold uppercase tracking-wider">
            Live Now
          </Badge>
        </div>
      )}

      <CardContent className="p-5">
        <div className="mb-3 flex items-start gap-3">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
              isLive
                ? "bg-red-500/10 text-red-500"
                : "bg-primary/10 text-primary"
            )}
          >
            <Video className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-foreground">
              {liveClass.title}
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {liveClass.subject.name}
            </p>
          </div>
        </div>

        {liveClass.description && (
          <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {liveClass.description}
          </p>
        )}

        <div className="mb-4 flex flex-wrap gap-2">
          <div className="flex items-center gap-1 rounded-md bg-muted/60 px-2 py-1 text-[11px] text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {scheduledAt?.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <div className="flex items-center gap-1 rounded-md bg-muted/60 px-2 py-1 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            {liveClass.durationMinutes} min
          </div>
          <div className="flex items-center gap-1 rounded-md bg-muted/60 px-2 py-1 text-[11px] text-muted-foreground">
            <Users className="h-3 w-3" />
            {liveClass.maxParticipants}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isUpcoming && onStart && (
            <Button
              size="sm"
              className="h-8 flex-1 gap-1.5 text-xs font-medium"
              onClick={() => onStart(liveClass.id)}
            >
              <Radio className="h-3.5 w-3.5" />
              Start Class
            </Button>
          )}
          {isLive && onJoin && (
            <Button
              size="sm"
              variant="destructive"
              className="h-8 flex-1 gap-1.5 text-xs font-medium cursor-pointer"
              
              onClick={() => onJoin(liveClass?.roomName!)}
            >
              <Video className="h-3.5 w-3.5" />
              Join Room
            </Button>
          )}
          {!isLive && !isUpcoming && (
            <Badge variant="secondary" className="h-8 flex-1 justify-center text-xs">
              Ended
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveClassCard;