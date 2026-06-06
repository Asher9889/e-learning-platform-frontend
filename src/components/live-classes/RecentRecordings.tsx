import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@/types/user";
const recordings = [
  {
    id: 1,
    title: "React Fundamentals",
    duration: "1h 25m",
    views: 120,
  },
  {
    id: 2,
    title: "JavaScript ES2025",
    duration: "58m",
    views: 95,
  },
];

export function RecentRecordings({
  role,
}: { role: UserRole }) {
  const isInstructor = role === "instructor";

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isInstructor
            ? "Recent Recordings"
            : "Class Recordings"}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {recordings.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-4 rounded-xl border p-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h3 className="font-semibold">
                {item.title}
              </h3>

              <p className="text-sm text-muted-foreground">
                Duration: {item.duration}
              </p>

              {isInstructor && (
                <p className="text-xs text-muted-foreground">
                  {item.views} Views
                </p>
              )}
            </div>

            <div className="flex gap-2">
              {isInstructor ? (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                  >
                    Analytics
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                  >
                    Share
                  </Button>
                </>
              ) : (
                <>
                  <Button size="sm">
                    Watch
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                  >
                    Download Notes
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}