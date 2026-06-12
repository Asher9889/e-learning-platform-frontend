import { cn } from "@/lib/utils";

interface LiveBadgeProps {
  className?: string;
}

export function LiveBadge({ className }: LiveBadgeProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide",
        "bg-red-500 text-white shadow-sm",
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
      LIVE
    </div>
  );
}
