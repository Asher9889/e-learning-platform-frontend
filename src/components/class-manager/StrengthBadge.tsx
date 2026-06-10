import { cn } from "@/lib/utils";

interface StrengthBadgeProps {
  strength: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function StrengthBadge({ strength, className, size = "md" }: StrengthBadgeProps) {
  const getColor = (value: number) => {
    if (value >= 40) return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800";
    if (value >= 25) return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800";
    return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800";
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-0.5",
    lg: "text-base px-3 py-1",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-medium",
        getColor(strength),
        sizeClasses[size],
        className
      )}
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      {strength}
    </span>
  );
}
