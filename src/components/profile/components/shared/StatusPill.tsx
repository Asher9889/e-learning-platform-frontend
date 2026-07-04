import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  ACTIVE: "bg-emerald-500/10 text-emerald-600",
  INACTIVE: "bg-slate-500/10 text-slate-600",
  BLOCKED: "bg-red-500/10 text-red-600",
} as const;

const STATUS_DOT = {
  ACTIVE: "bg-emerald-500",
  INACTIVE: "bg-slate-500",
  BLOCKED: "bg-red-500",
} as const;

interface Props {
  status: keyof typeof STATUS_STYLES;
  className?: string;
}

export function StatusPill({ status, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium capitalize",
        STATUS_STYLES[status],
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[status])} />
      {status.toLowerCase()}
    </span>
  );
}