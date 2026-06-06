import { Card, CardContent } from "@/components/ui/card";

export function CoursesStats({
  role,
  courses,
}: any) {
  const stats =
    role === "instructor"
      ? [
          {
            title: "Total Courses",
            value: courses.length,
          },
          {
            title: "Total Students",
            value: courses.reduce(
              (a: number, c: any) =>
                a + c.students,
              0
            ),
          },
          {
            title: "Revenue",
            value: `$${courses.reduce(
              (a: number, c: any) =>
                a + c.revenue,
              0
            )}`,
          },
        ]
      : [
          {
            title: "Enrolled Courses",
            value: courses.length,
          },
          {
            title: "Avg Progress",
            value: `${Math.round(
              courses.reduce(
                (a: number, c: any) =>
                  a + c.progress,
                0
              ) / courses.length
            )}%`,
          },
          {
            title: "Completed",
            value: courses.filter(
              (c: any) =>
                c.progress === 100
            ).length,
          },
        ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
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