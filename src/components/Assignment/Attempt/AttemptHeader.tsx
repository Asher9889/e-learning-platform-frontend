import { BookOpen, ClipboardCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type AttemptHeaderProps = {
  title: string;
  currentQuestion: number;
  totalQuestions: number;
};

export function AttemptHeader({
  title,
  currentQuestion,
  totalQuestions,
}: AttemptHeaderProps) {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />

            <h1 className="text-2xl font-bold tracking-tight">
              {title}
            </h1>
          </div>

          <p className="text-sm text-muted-foreground">
            Answer all questions carefully before submitting your paper.
          </p>
        </div>

        <div className="rounded-xl bg-primary/5 px-4 py-3">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-primary" />

            <span className="text-sm font-medium">
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Progress
          </span>

          <span className="font-medium">
            {Math.round(progress)}%
          </span>
        </div>

        <Progress value={progress} />
      </div>
    </div>
  );
}