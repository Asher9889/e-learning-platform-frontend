import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function NextClassCard({ role }: { role: string }) {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <h2 className="font-bold">
          Next Live Class
        </h2>

        <p className="text-lg">
          React Hooks Deep Dive
        </p>

        <p className="text-sm text-muted-foreground">
          Today 7:00 PM
        </p>

        <Button className="w-full">
          {role === "teacher"
            ? "Start Class"
            : "Join Class"}
        </Button>
      </CardContent>
    </Card>
  );
}