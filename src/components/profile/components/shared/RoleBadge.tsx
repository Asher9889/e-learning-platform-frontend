import { GraduationCap, ShieldCheck, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  role: "STUDENT" | "TEACHER" | "ADMIN";
}

const CONFIG = {
  STUDENT: { label: "Student", icon: GraduationCap, style: "bg-blue-500/10 text-blue-600" },
  TEACHER: { label: "Teacher", icon: Briefcase, style: "bg-violet-500/10 text-violet-600" },
  ADMIN: { label: "Administrator", icon: ShieldCheck, style: "bg-amber-500/10 text-amber-600" },
} as const;

export function RoleBadge({ role }: Props) {
  const { label, icon: Icon, style } = CONFIG[role];

  return (
    <div className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium", style)}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </div>
  );
}