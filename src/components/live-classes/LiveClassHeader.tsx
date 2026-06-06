import { Button } from "@/components/ui/button";
import {  Video } from "lucide-react";
import { ScheduleClassDialog } from "./ScheduleClassDialog";
import type { UserRole } from "@/types/user.types";



export function LiveClassHeader({ role , onAddClass }: { role: UserRole; onAddClass: (data: any) => void }) {
  const isTeacher = role === "teacher";

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold">
          Live Classes
        </h1>

        <p className="text-muted-foreground">
          {isTeacher
            ? "Manage your live sessions and students."
            : "Join live sessions and track attendance."}
        </p>
      </div>

      <div className="flex gap-2">
        {isTeacher ? (
          <>
             <ScheduleClassDialog
            onAddClass={onAddClass}
          />

            <Button>
              <Video className="mr-2 h-4 w-4" />
              Start Instant Class
            </Button>
          </>
        ) : (
          <Button>
            <Video className="mr-2 h-4 w-4" />
            Join Next Class
          </Button>
        )}
      </div>
    </div>
  );
}