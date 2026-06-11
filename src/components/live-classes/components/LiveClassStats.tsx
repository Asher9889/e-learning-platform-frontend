import { Video, Users, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent } from "#components/ui/card";

interface Stats {
  totalClasses: number;
  totalStudents: number;
  hoursTaught: number;
  avgAttendance: number;
}

interface LiveClassStatsProps {
  stats: Stats;
}

const LiveClassStats = ({ stats }: LiveClassStatsProps) => {
  const items = [
    {
      label: "Total Classes",
      value: stats.totalClasses,
      icon: Video,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Total Students",
      value: stats.totalStudents.toLocaleString(),
      icon: Users,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Hours Taught",
      value: stats.hoursTaught,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      label: "Avg. Attendance",
      value: `${stats.avgAttendance}%`,
      icon: TrendingUp,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="border-border/50">
          <CardContent className="flex items-center gap-3 p-4">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.bg}`}>
              <item.icon className={`h-4.5 w-4.5 ${item.color}`} />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-lg font-bold leading-none text-foreground">
                {item.value}
              </span>
              <span className="text-[11px] font-medium text-muted-foreground">
                {item.label}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LiveClassStats;