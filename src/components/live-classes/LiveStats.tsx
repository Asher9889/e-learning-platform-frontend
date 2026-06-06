import { Card, CardContent } from "@/components/ui/card";
import type { UserRole } from "@/types/user";

export function LiveStats({ role }: { role: UserRole }) {
  const stats =
    role === "teacher"
      ? [
          { title: "Today's Classes", value: "3" },
          { title: "Upcoming Sessions", value: "8" },
          { title: "Students Enrolled", value: "124" },
          { title: "Hours Taught", value: "48" },
        ]
      : [
          { title: "Upcoming Classes", value: "4" },
          { title: "Completed Classes", value: "26" },
          { title: "Attendance", value: "92%" },
          { title: "Certificates", value: "5" },
        ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <Card key={item.title}>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
              {item.title}
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {item.value}
            </h2>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}