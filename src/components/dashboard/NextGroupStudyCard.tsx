import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "#components/ui/skeleton";
import { Users, Lock, Radio, BookOpen } from "lucide-react";

interface RoomCreatedBy {
  id: string;
  name: string;
  profileImage?: string;
}

interface Room {
  id: string;
  name: string;
  description?: string;
  subject?: string;
  createdBy: RoomCreatedBy;
  isPrivate: boolean;
  status: string; // "LIVE" | "ENDED" | etc.
  roomName: string;
  startedAt?: string | null;
  endedAt?: string | null;
  createdAt: string;
  memberCount: number;
}



function RoomCard({ room }: { room: Room }) {
  const isLive = room.status === "LIVE";

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-bold truncate">{room.name}</h2>
              {room.isPrivate && (
                <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              )}
            </div>
            {room.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {room.description}
              </p>
            )}
          </div>

          {isLive ? (
            <Badge className="bg-red-500 hover:bg-red-500 text-white shrink-0 gap-1">
              <Radio className="h-3 w-3" />
              LIVE
            </Badge>
          ) : (
            <Badge variant="secondary" className="shrink-0">
              {room.status}
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          {room.subject && (
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {room.subject}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {room.memberCount}
          </span>
        </div>

        <p className="text-xs text-muted-foreground">
          Created by {room.createdBy?.name ?? "Unknown"}
        </p>
      </CardContent>
    </Card>
  );
}

function RoomCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-24" />
      </CardContent>
    </Card>
  );
}

export function NextGroupStudyCard({
  data,
}: {
  data?: Room[] | null;
}) {

    console.log(data,"NextGroupStudyCard")
  // loading state
  if (data === null) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <RoomCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // no data / empty state
  if (!data  || data.length === 0) {
    return (
      <Card>
        <CardContent className="p-4 space-y-2 flex flex-col items-center text-center py-8">
          <Users className="h-8 w-8 text-muted-foreground" />
          <h2 className="font-bold">No Rooms Found</h2>
          <p className="text-sm text-muted-foreground">
            There are no rooms to show right now.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
}