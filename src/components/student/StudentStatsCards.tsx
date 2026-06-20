import { Users, UserCheck, UserX, UserPlus } from "lucide-react";

interface StatsData {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  newlyAddedThisMonth: number;
}

interface StatsCardsProps {
  stats?: StatsData;
}

const items = [
  {
    label: "Total",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    getValue: (s?: StatsData) => s?.totalStudents ?? "—",
  },
  {
    label: "Active",
    icon: UserCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    getValue: (s?: StatsData) => s?.activeStudents ?? "—",
  },
  {
    label: "Inactive",
    icon: UserX,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    getValue: (s?: StatsData) => s?.inactiveStudents ?? "—",
  },
  {
    label: "New This Month",
    icon: UserPlus,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    getValue: (s?: StatsData) => s?.newlyAddedThisMonth ?? "—",
  },
];

export function StudentStatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className={`flex items-center gap-3 rounded-lg border ${item.border} bg-white px-3.5 py-2.5`}
        >
          <div className={`rounded-md ${item.bg} p-1.5`}>
            <item.icon className={`h-4 w-4 ${item.color}`} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-muted-foreground leading-none mb-0.5">{item.label}</p>
            <p className="text-base font-bold leading-none">{item.getValue(stats)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
