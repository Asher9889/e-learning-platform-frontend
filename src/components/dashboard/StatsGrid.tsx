import { Card, CardContent } from "@/components/ui/card";

export function StatsGrid({ role }: { role: string }) {
  const stats =
    role === "teacher"
      ? [
          { title: "Students", value: "120" },
          { title: "Courses", value: "8" },
          { title: "Live Classes", value: "3" },
          { title: "Earnings", value: "$1200" },
        ]
      : [
          { title: "Enrolled", value: "6" },
          { title: "Completed", value: "2" },
          { title: "Attendance", value: "92%" },
          { title: "Certificates", value: "1" },
        ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <Card key={s.title}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              {s.title}
            </p>
            <h2 className="text-2xl font-bold">
              {s.value}
            </h2>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}