import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { UserRole } from "@/types/user.types";



export function AttendanceSummary({ role }: { role: UserRole }) {
  const isTeacher = role === "teacher";

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isTeacher
            ? "Attendance Overview"
            : "My Attendance"}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {isTeacher ? (
          <>
            <div>
              <p className="text-sm text-muted-foreground">
                Present
              </p>
              <p className="text-2xl font-bold">
                85
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Absent
              </p>
              <p className="text-2xl font-bold">
                12
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Attendance Rate
              </p>
              <p className="text-2xl font-bold">
                87%
              </p>
            </div>
          </>
        ) : (
          <>
            <div>
              <p className="text-sm text-muted-foreground">
                Classes Attended
              </p>
              <p className="text-2xl font-bold">
                26
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Missed
              </p>
              <p className="text-2xl font-bold">
                2
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Attendance %
              </p>
              <p className="text-2xl font-bold">
                92%
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}