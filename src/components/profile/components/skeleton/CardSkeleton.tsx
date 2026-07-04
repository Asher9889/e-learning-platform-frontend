import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CardSkeleton() {
  return (
    <Card className="rounded-3xl p-6">

      <Skeleton className="h-6 w-44" />

      <div className="mt-8 space-y-6">

        <Skeleton className="h-5 w-full" />

        <Skeleton className="h-5 w-3/4" />

        <Skeleton className="h-5 w-5/6" />

        <Skeleton className="h-5 w-2/3" />

      </div>

    </Card>
  );
}