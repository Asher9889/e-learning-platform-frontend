import {
  AlertTriangle,
  CheckCircle2,
  Circle,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type SubmitDialogProps = {
  open: boolean;
  totalQuestions: number;
  answeredQuestions: number;
  onCancel: () => void;
  onConfirm: () => void;
};

export function SubmitDialog({
  open,
  totalQuestions,
  answeredQuestions,
  onCancel,
  onConfirm,
}: SubmitDialogProps) {
  const remaining = totalQuestions - answeredQuestions;

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Submit Question Paper
          </AlertDialogTitle>

          <AlertDialogDescription>
            Once submitted, you won't be able to change your answers.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-3 py-4">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <span>Total Questions</span>
            <span className="font-semibold">
              {totalQuestions}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Answered
            </div>

            <span className="font-semibold text-green-700">
              {answeredQuestions}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-yellow-200 bg-yellow-50 p-3">
            <div className="flex items-center gap-2">
              <Circle className="h-4 w-4 text-yellow-600" />
              Remaining
            </div>

            <span className="font-semibold text-yellow-700">
              {remaining}
            </span>
          </div>

          {remaining > 0 && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              You still have{" "}
              <strong>{remaining}</strong> unanswered{" "}
              {remaining === 1 ? "question" : "questions"}.
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            Continue Attempt
          </AlertDialogCancel>

          <AlertDialogAction onClick={onConfirm}>
            Submit Paper
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}