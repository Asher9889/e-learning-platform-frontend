import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function QuickActions({ role }: { role: string | undefined }) {
  const navidate = useNavigate();
  return (
    <div className="space-y-2">
      <h2 className="font-semibold">
        Quick Actions
      </h2>

      <div className="flex flex-wrap gap-2">
        {role === "ADMIN" ? (
          <>

            <Button onClick={() => navidate("/live-classes")} >
              Browse Live Class
            </Button>
            <Button variant="outline" onClick={() => navidate("/programs")}>Browse Program</Button>

            <Button variant="outline" onClick={() => navidate("/subjects")}>
              Browse Subject
            </Button>
            <Button variant="outline" onClick={() => navidate("/batches")}>
              Browse Batch
            </Button>
          </>
        ) :role === "TEACHER" ? (
          <>
            <Button variant="outline" onClick={() => navidate("/live-classes")}>
              Browse Live Class
            </Button>
          </>
        ): (
          <>
            <Button variant="outline"  onClick={() => navidate("/live-classes")} >
              Browse Live Class
            </Button>
            <Button  onClick={() => navidate("/group-study")} >Browse Group Study</Button>

          </>
        )}
      </div>
    </div>
  );
}