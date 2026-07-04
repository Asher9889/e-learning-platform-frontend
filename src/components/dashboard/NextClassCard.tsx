import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "#components/ui/skeleton";
import { CalendarClock } from "lucide-react";

interface LiveClass {
  _id: string;
  title: string;
  description?: string;
  scheduledAt: string;
  durationMinutes?: number;
  status: string;
  programId?: { name?: string };
}
export function NextClassCard({
  role,
  liveClass,
}: {
  role: string | undefined;
  liveClass?: LiveClass | null;
}) {

  console.log(liveClass,"liveClass0147554")
 if (liveClass === null) {
    return (
      <Card>
        <CardContent className="p-4 space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-9 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!liveClass) {
    return (
      <Card>
        <CardContent className="p-4 space-y-2 flex flex-col items-center text-center py-8">
          <CalendarClock className="h-8 w-8 text-muted-foreground" />
          <h2 className="font-bold">No Upcoming Class</h2>
          <p className="text-sm text-muted-foreground">
            You have no live classes scheduled right now.
          </p>
        </CardContent>
      </Card>
    );
  }

  const scheduledDate = new Date(liveClass.scheduledAt);
  const dateLabel = scheduledDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
  const timeLabel = scheduledDate.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const isToday = scheduledDate.toDateString() === new Date().toDateString();

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <h2 className="font-bold">Next Live Class</h2>

        <p className="text-lg">{liveClass.title}</p>

        {liveClass.programId?.name && (
          <p className="text-sm text-muted-foreground">
            {liveClass.programId.name}
          </p>
        )}

        <p className="text-sm text-muted-foreground">
          {isToday ? "Today" : dateLabel} {timeLabel}
          {liveClass.durationMinutes ? ` · ${liveClass.durationMinutes} min` : ""}
        </p>

        <Button className="w-full">
          {role === "TEACHER" ? "Start Class" : "Join Class"}
        </Button>
      </CardContent>
    </Card>
  );
}