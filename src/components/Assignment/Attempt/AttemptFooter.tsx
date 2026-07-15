import { ArrowLeft, ArrowRight, Send } from "lucide-react";

import { Button } from "@/components/ui/button";

type AttemptFooterProps = {
  currentQuestion: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
};

export function AttemptFooter({
  currentQuestion,
  totalQuestions,
  onPrevious,
  onNext,
  onSubmit,
}: AttemptFooterProps) {
  const isFirst = currentQuestion === 0;
  const isLast = currentQuestion === totalQuestions - 1;

  return (
    <div className="sticky bottom-0 mt-6 rounded-2xl border bg-background/90 p-4 backdrop-blur">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          disabled={isFirst}
          onClick={onPrevious}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        {!isLast ? (
          <Button onClick={onNext}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={onSubmit}>
            <Send className="mr-2 h-4 w-4" />
            Submit Paper
          </Button>
        )}
      </div>
    </div>
  );
}