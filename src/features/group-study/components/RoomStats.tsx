import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGroupStudyStats } from "../hooks/use-group-study";
import { Users, Radio, BookOpen, Activity } from "lucide-react";

export function RoomStats() {
  const { data: stats, isLoading } = useGroupStudyStats();
console.log(stats,"s4211tatsstatsstatsstatsstatsstats")
  const items = [
    { label: "Total Rooms", value: stats?.totalRooms ?? 0, icon: BookOpen },
    { label: "Live Now", value: stats?.liveRooms ?? 0, icon: Radio },
    { label: "Total Members", value: stats?.totalMembers ?? 0, icon: Users },
    { label: "Avg Members / Room", value: stats?.avgMembers ?? 0, icon: Activity },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-md bg-primary/10 p-2">
              <item.icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              {isLoading ? (
                <Skeleton className="h-5 w-10" />
              ) : (
                <p className="text-lg font-semibold leading-none">{item.value}</p>
              )}
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
