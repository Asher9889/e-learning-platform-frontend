import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type CardAccent = "blue" | "violet" | "amber" | "slate";

const ACCENT_CHIP: Record<CardAccent, string> = {
  blue: "bg-blue-500/10 text-blue-600",
  violet: "bg-violet-500/10 text-violet-600",
  amber: "bg-amber-500/10 text-amber-600",
  slate: "bg-slate-500/10 text-slate-600",
};

interface Props {
  title: string;
  icon: LucideIcon;
  accent?: CardAccent;
}

export function CardTitle({ title, icon: Icon, accent = "slate" }: Props) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", ACCENT_CHIP[accent])}>
        <Icon className="h-4 w-4" />
      </div>
      <h3 className="font-semibold tracking-tight">{title}</h3>
    </div>
  );
}