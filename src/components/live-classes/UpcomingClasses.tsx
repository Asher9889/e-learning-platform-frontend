import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScheduleClassDialog } from "./ScheduleClassDialog";
import type { UserRole } from "@/types/user";

export function UpcomingClasses({
  role,
  classes,
  onAddClass,
}: { role: UserRole , classes: any[]; onAddClass: (data: any) => void }) {
  const isInstructor = role === "instructor";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          Upcoming Classes
        </CardTitle>

        {isInstructor && (
          <ScheduleClassDialog
            onAddClass={onAddClass}
          />
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {classes.map((item) => (
          <div
            key={item.id}
            className="flex justify-between rounded-xl border p-4"
          >
            <div>
              <h3 className="font-semibold">
                {item.title}
              </h3>

              <p className="text-sm text-muted-foreground">
                {item.date} • {item.time}
              </p>
            </div>

            <Button
              variant={
                isInstructor
                  ? "outline"
                  : "default"
              }
            >
              {isInstructor
                ? "Edit"
                : "Join"}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}