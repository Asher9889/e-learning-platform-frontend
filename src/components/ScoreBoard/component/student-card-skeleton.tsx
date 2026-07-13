import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function StudentCardSkeleton() {
  return (
    <Card className="overflow-hidden p-0 gap-0">
      <Skeleton className="h-1.5 w-full rounded-none" />
      <CardContent className="p-4">
        <Skeleton className="h-9 w-9 rounded-full mb-3" />
        <Skeleton className="h-4 w-28 mb-2" />
        <Skeleton className="h-3 w-36 mb-3" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </CardContent>
    </Card>
  )
}