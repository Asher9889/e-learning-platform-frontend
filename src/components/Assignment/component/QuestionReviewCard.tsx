import {
  CheckCircle2,
  XCircle,
  CircleDashed,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type QuestionReviewCardProps = {
  number: number;
  question: string;
  explanation?: string;
  correctAnswer: string;
  selectedAnswer?: string;
};

export function QuestionReviewCard({
  number,
  question,
  explanation,
  correctAnswer,
  selectedAnswer,
}: QuestionReviewCardProps) {
  const skipped = !selectedAnswer;

  const isCorrect =
    selectedAnswer === correctAnswer;

  const getStatus = () => {
    if (skipped) {
      return {
        label: "Skipped",
        icon: CircleDashed,
        className:
          "bg-yellow-50 text-yellow-700 border-yellow-200",
      };
    }

    if (isCorrect) {
      return {
        label: "Correct",
        icon: CheckCircle2,
        className:
          "bg-green-50 text-green-700 border-green-200",
      };
    }

    return {
      label: "Incorrect",
      icon: XCircle,
      className:
        "bg-red-50 text-red-700 border-red-200",
      };
  };

  const status = getStatus();
  const Icon = status.icon;

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-base">
            Question {number}
          </CardTitle>

          <div
            className={`flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${status.className}`}
          >
            <Icon className="h-4 w-4" />
            {status.label}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div>
          <h4 className="mb-2 font-medium">
            Question
          </h4>

          <p className="text-sm text-muted-foreground">
            {question}
          </p>
        </div>

        <div>
          <h4 className="mb-2 font-medium">
            Your Answer
          </h4>

          <div
            className={`rounded-lg border p-3 text-sm ${
              skipped
                ? "border-yellow-200 bg-yellow-50"
                : isCorrect
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }`}
          >
            {selectedAnswer || "Not Answered"}
          </div>
        </div>

        <div>
          <h4 className="mb-2 font-medium">
            Correct Answer
          </h4>

          <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm">
            {correctAnswer}
          </div>
        </div>

        {explanation && (
          <div>
            <h4 className="mb-2 font-medium">
              Explanation
            </h4>

            <div className="rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground">
              {explanation}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}