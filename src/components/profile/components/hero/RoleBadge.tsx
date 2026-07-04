import { GraduationCap, ShieldCheck, Briefcase } from "lucide-react";

interface Props {
  role: "STUDENT" | "TEACHER" | "ADMIN";
}

export function RoleBadge({ role }: Props) {
  const config = {
    STUDENT: {
      label: "Student",
      icon: GraduationCap,
    },

    TEACHER: {
      label: "Teacher",
      icon: Briefcase,
    },

    ADMIN: {
      label: "Administrator",
      icon: ShieldCheck,
    },
  };

  const Item = config[role];

  const Icon = Item.icon;

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
      <Icon className="h-4 w-4" />

      {Item.label}
    </div>
  );
}