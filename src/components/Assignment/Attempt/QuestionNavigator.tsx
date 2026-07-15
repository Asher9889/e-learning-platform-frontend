import { CheckCircle2, Circle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type QuestionNavigatorProps = {
  totalQuestions: number;
  currentQuestion: number;
  answers: Record<string, string>;
  questionIds: string[];
  onJump: (index: number) => void;
};

export function QuestionNavigator({
  totalQuestions,
  currentQuestion,
  answers,
  questionIds,
  onJump,
}: QuestionNavigatorProps) {
  const answeredCount = questionIds.filter(
    (id) => !!answers[id]
  ).length;

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="text-base">
          Question Palette
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-5 gap-2">
          {questionIds.map((id, index) => {
            const answered = !!answers[id];
            const active = currentQuestion === index;

            return (
              <button
                key={id}
                onClick={() => onJump(index)}
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-xl border text-sm font-semibold transition-all",

                  active &&
                    "border-primary bg-primary text-primary-foreground",

                  !active &&
                    answered &&
                    "border-green-600 bg-green-50 text-green-700",

                  !active &&
                    !answered &&
                    "hover:border-primary hover:bg-primary/5"
                )}
              >
                {index + 1}
              </button>
            );
          })}
        </div>

        <div className="space-y-3 border-t pt-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Answered
            </span>

            <span className="font-semibold">
              {answeredCount}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Circle className="h-4 w-4 text-muted-foreground" />
              Remaining
            </span>

            <span className="font-semibold">
              {totalQuestions - answeredCount}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span>Total</span>

            <span className="font-semibold">
              {totalQuestions}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}