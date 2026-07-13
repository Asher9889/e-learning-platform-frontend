import { Award } from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

type ScoreCardProps = {
  obtainedMarks: number;
  totalMarks: number;
};

export function ScoreCard({
  obtainedMarks,
  totalMarks,
}: ScoreCardProps) {
  const percentage =
    totalMarks === 0
      ? 0
      : Math.round(
          (obtainedMarks / totalMarks) * 100
        );

  const getPerformance = () => {
    if (percentage >= 90) {
      return {
        label: "Excellent 🎉",
        description:
          "Outstanding performance.",
      };
    }

    if (percentage >= 75) {
      return {
        label: "Very Good 👏",
        description:
          "You performed really well.",
      };
    }

    if (percentage >= 60) {
      return {
        label: "Good 👍",
        description:
          "Nice work. Keep improving.",
      };
    }

    if (percentage >= 40) {
      return {
        label: "Average 🙂",
        description:
          "You can do better with more practice.",
      };
    }

    return {
      label: "Needs Improvement 📚",
      description:
        "Practice more and try again.",
    };
  };

  const performance = getPerformance();

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Award className="h-7 w-7 text-primary" />
          </div>

          <p className="text-sm text-muted-foreground">
            Your Score
          </p>

          <h2 className="mt-2 text-5xl font-bold">
            {obtainedMarks}
            <span className="text-2xl text-muted-foreground">
              {" "}
              / {totalMarks}
            </span>
          </h2>

          <div className="mt-4 text-2xl font-semibold">
            {percentage}%
          </div>

          <div className="mt-4 text-lg font-semibold">
            {performance.label}
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            {performance.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}