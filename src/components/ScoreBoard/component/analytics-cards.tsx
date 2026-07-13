import { Card } from "@/components/ui/card"

interface Props {
  analytics: {
    totalStudents: number
    totalAttempts: number
    averageScore: number
    passRate: number
  }
}

export function AnalyticsCards({
  analytics,
}: Props) {
  const items = [
    {
      title: "Students",
      value: analytics.totalStudents,
    },
    {
      title: "Attempts",
      value: analytics.totalAttempts,
    },
    {
      title: "Average Score",
      value: `${analytics.averageScore}%`,
    },
    {
      title: "Pass Rate",
      value: `${analytics.passRate}%`,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {items.map((item) => (
        <Card
          key={item.title}
          className="p-6"
        >
          <p className="text-sm text-muted-foreground">
            {item.title}
          </p>

          <p className="mt-2 text-3xl font-bold">
            {item.value}
          </p>
        </Card>
      ))}
    </div>
  )
}