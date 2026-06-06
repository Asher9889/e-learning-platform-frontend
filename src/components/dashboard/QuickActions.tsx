import { Button } from "@/components/ui/button";

export function QuickActions({ role }: { role: string }) {
  return (
    <div className="space-y-2">
      <h2 className="font-semibold">
        Quick Actions
      </h2>

      <div className="flex flex-wrap gap-2">
        {role === "teacher" ? (
          <>
            <Button>+ Create Course</Button>
            <Button variant="outline">
              Schedule Class
            </Button>
            <Button variant="outline">
              Upload Recording
            </Button>
          </>
        ) : (
          <>
            <Button>Browse Courses</Button>
            <Button variant="outline">
              Join Live Class
            </Button>
          </>
        )}
      </div>
    </div>
  );
}