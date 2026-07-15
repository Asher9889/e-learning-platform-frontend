import { Skeleton } from "@/components/ui/skeleton";

export function QuestionPaperSkeleton() {
  return (
    <div className="rounded-2xl border p-6">
      <Skeleton className="h-6 w-2/3" />

      <Skeleton className="mt-4 h-4 w-full" />

      <Skeleton className="mt-2 h-4 w-1/2" />

      <div className="mt-5 flex gap-2">
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-16 rounded-full" />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <Skeleton className="h-14 rounded-xl" />
        <Skeleton className="h-14 rounded-xl" />
      </div>

      <Skeleton className="mt-6 h-11 w-full rounded-xl" />
    </div>
  );
}