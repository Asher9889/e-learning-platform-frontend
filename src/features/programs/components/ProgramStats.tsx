import { BookOpen, Users, Award, HeadphonesIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    icon: BookOpen,
    label: "Programs",
    value: "32",
    description: "Diverse programs offered",
  },
  {
    icon: Users,
    label: "Active Students",
    value: "8,500+",
    description: "Currently enrolled learners",
  },
  {
    icon: Award,
    label: "Expert Faculty",
    value: "120+",
    description: "Industry-experienced mentors",
  },
  {
    icon: HeadphonesIcon,
    label: "Placement Support",
    value: "24/7",
    description: "Dedicated career assistance",
  },
];

export function ProgramStats() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-0 bg-muted/30 shadow-sm">
            <CardContent className="flex items-start gap-4 p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm font-medium text-foreground">{stat.label}</p>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
