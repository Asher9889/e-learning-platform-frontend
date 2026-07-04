import { Card } from "@/components/ui/card";
import { CardTitle, type CardAccent } from "./CardTitle";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCENT_BAR: Record<CardAccent, string> = {
  blue: "bg-blue-500",
  violet: "bg-violet-500",
  amber: "bg-amber-500",
  slate: "bg-slate-500",
};

interface Props {
  title: string;
  icon: LucideIcon;
  accent?: CardAccent;
  children: React.ReactNode;
}

export function SectionCard({ title, icon, accent = "slate", children }: Props) {
  return (
    <Card className="relative overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-md">
      <span className={cn("absolute inset-x-0 top-0 h-1", ACCENT_BAR[accent])} />

      <div className="px-6 pt-6">
        <CardTitle title={title} icon={icon} accent={accent} />
      </div>

      <div className="mt-5 divide-y px-6 pb-6">{children}</div>
    </Card>
  );
}