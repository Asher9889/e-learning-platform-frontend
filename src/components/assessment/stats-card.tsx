import { Card } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: number;
}

export function StatsCard({
  title,
  value,
}: StatsCardProps) {
  return (
    <Card className="p-5">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">
          {title}
        </p>

        <h3 className="text-3xl font-bold">
          {value}
        </h3>
      </div>
    </Card>
  );
}