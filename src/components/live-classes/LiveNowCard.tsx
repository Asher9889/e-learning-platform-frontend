import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@/types/user.types";



export function LiveNowCard({ role }: { role: UserRole }) {
  const isInstructor = role === "instructor";

  return (
    <Card>
      <CardContent className="p-6">
        <Badge className="mb-4">
          🔴 LIVE NOW
        </Badge>

        <h2 className="text-2xl font-bold">
          Advanced React Masterclass
        </h2>

        <p className="mt-2 text-muted-foreground">
          Started 10 minutes ago
        </p>

        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          {isInstructor ? (
            <>
              <span>👨‍🎓 67 Students Watching</span>
              <span>💬 24 Messages</span>
              <span>✋ 5 Questions</span>
            </>
          ) : (
            <>
              <span>👨‍🏫 Instructor: John Doe</span>
              <span>👨‍🎓 67 Students Online</span>
            </>
          )}
        </div>

        <div className="mt-6 flex gap-2">
          <Button>
            {isInstructor
              ? "Manage Session"
              : "Join Session"}
          </Button>

          {isInstructor && (
            <Button variant="destructive">
              End Session
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}