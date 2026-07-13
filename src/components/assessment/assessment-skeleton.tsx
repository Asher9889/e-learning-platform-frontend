import { Skeleton } from "@/components/ui/skeleton";

export function AssessmentSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({
        length: 6,
      }).map((_, index) => (
        <div
          key={index}
          className="
            flex
            items-center
            justify-between
            rounded-lg
            border
            p-4
          "
        >
          <div className="space-y-2">
            <Skeleton className="h-4 w-[240px]" />
            <Skeleton className="h-4 w-[120px]" />
          </div>

          <Skeleton className="h-9 w-24" />
        </div>
      ))}
    </div>
  );
}