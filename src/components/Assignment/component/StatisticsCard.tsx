import {
  CheckCircle2,
  XCircle,
  CircleDashed,
  ListChecks,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type StatisticsCardProps = {
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
};

export function StatisticsCard({
  totalQuestions,
  correctCount,
  wrongCount,
  skippedCount,
}: StatisticsCardProps) {
  const stats = [
    {
      label: "Correct",
      value: correctCount,
      icon: CheckCircle2,
      className:
        "border-green-200 bg-green-50 text-green-700",
    },
    {
      label: "Wrong",
      value: wrongCount,
      icon: XCircle,
      className:
        "border-red-200 bg-red-50 text-red-700",
    },
    {
      label: "Skipped",
      value: skippedCount,
      icon: CircleDashed,
      className:
        "border-yellow-200 bg-yellow-50 text-yellow-700",
    },
    {
      label: "Total",
      value: totalQuestions,
      icon: ListChecks,
      className:
        "border-border bg-muted/40",
    },
  ];

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle>
          Performance Summary
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className={`flex items-center justify-between rounded-xl border p-4 ${item.className}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5" />

                  <span className="font-medium">
                    {item.label}
                  </span>
                </div>

                <span className="text-lg font-bold">
                  {item.value}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}