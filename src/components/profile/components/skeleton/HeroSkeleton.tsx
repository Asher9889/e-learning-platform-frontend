import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function HeroSkeleton() {
  return (
    <Card className="overflow-hidden rounded-3xl">

      <Skeleton className="h-32 w-full rounded-none" />

      <div className="px-8 pb-8">

        <div className="-mt-14 flex items-end justify-between">

          <div className="flex gap-5">

            <Skeleton className="h-28 w-28 rounded-full" />

            <div className="space-y-3">

              <Skeleton className="h-8 w-56" />

              <Skeleton className="h-5 w-32" />

              <Skeleton className="h-5 w-64" />

              <Skeleton className="h-5 w-52" />

            </div>

          </div>

          <Skeleton className="h-10 w-32 rounded-xl" />

        </div>

      </div>

    </Card>
  );
}