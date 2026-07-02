import { Skeleton } from "@/components/ui/skeleton";

const NotificationSkeleton = () => {
    return (
        <div className="p-3 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-3 w-40" />
                        <Skeleton className="h-2 w-full" />
                        <Skeleton className="h-2 w-24" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NotificationSkeleton;