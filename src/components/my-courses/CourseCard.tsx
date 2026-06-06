import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function CourseCard({
  course,
  role,
}: any) {
  return (
    <Card className="hover:shadow-md transition">
      <CardContent className="p-4 space-y-3">
        <h3 className="font-semibold">
          {course.title}
        </h3>

        {/* STUDENT VIEW */}
        {role === "student" && (
          <>
            <p className="text-sm">
              Progress: {course.progress}%
            </p>

            <div className="h-2 bg-gray-200 rounded">
              <div
                className="h-2 bg-blue-500 rounded"
                style={{
                  width: `${course.progress}%`,
                }}
              />
            </div>

            <Button className="w-full">
              Continue Learning
            </Button>
          </>
        )}

        {/* INSTRUCTOR VIEW */}
        {role === "teacher" && (
          <>
            <p className="text-sm text-muted-foreground">
              Students: {course.students}
            </p>

            <p className="text-sm text-muted-foreground">
              Revenue: ${course.revenue}
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="w-full flex-1"
              >
                Edit
              </Button>

              <Button className="w-full flex-1">
                View
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}