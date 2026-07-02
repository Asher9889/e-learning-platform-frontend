import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Lock, Globe, LogIn } from "lucide-react";
import {  ROOM_STATUS, type IGroupStudyRoom } from "../types/group-study.types";
import { cn } from "@/lib/utils";

interface RoomCardProps {
  room: IGroupStudyRoom;
  onJoin: (roomName: string) => void;
  isJoining?: boolean;
}

const statusStyles: Record<string, string> = {
  [ROOM_STATUS.LIVE]: "bg-green-100 text-green-700 border-green-300",
  [ROOM_STATUS.ACTIVE]: "bg-amber-100 text-amber-700 border-amber-300",
  [ROOM_STATUS.ENDED]: "bg-gray-100 text-gray-500 border-gray-300",
};

export function RoomCard({ room, onJoin, isJoining }: RoomCardProps) {
  const isEnded = room.status === ROOM_STATUS.ENDED;

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-tight">{room.name}</CardTitle>
          <Badge variant="outline" className={cn("shrink-0", statusStyles[room.status])}>
            {room.status === ROOM_STATUS.LIVE && (
              <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            )}
            {room.status}
          </Badge>
        </div>
        {room.subject && <p className="text-xs text-muted-foreground">{room.subject}</p>}
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        {room.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{room.description}</p>
        )}

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {room?.members?.length} member{room?.members?.length !== 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1">
            {room.isPrivate ? <Lock className="h-3.5 w-3.5" /> : <Globe className="h-3.5 w-3.5" />}
            {room.isPrivate ? "Private" : "Public"}
          </span>
        </div>

        <p className="text-xs text-muted-foreground">
          Created by{" "}
          <span className="font-medium text-foreground">{room.createdBy?.personalInfo?.name}</span>
        </p>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          size="sm"
          disabled={isEnded || isJoining}
          onClick={() => onJoin(room.roomName)}
        >
          <LogIn className="mr-1.5 h-4 w-4" />
          {isEnded ? "Ended" : isJoining ? "Joining..." : "Join Room"}
        </Button>
      </CardFooter>
    </Card>
  );
}
