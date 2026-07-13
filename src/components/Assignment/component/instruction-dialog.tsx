import {
  BookOpen,
  ClipboardList,
  Award,
  CircleHelp,
  FileText,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { DifficultyBadge } from "./difficulty-badge";
import type { QuestionPaper } from "@/pages/Assignment/types/question-paper.types";

type Props = {
  open: boolean;
  paper: QuestionPaper | null;
  onClose: () => void;
  onStart: () => void;
};

export function InstructionDialog({
  open,
  paper,
  onClose,
  onStart,
}: Props) {
  if (!paper) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{paper.title}</DialogTitle>

          <DialogDescription>
            Read all instructions carefully before starting.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <DifficultyBadge difficulty={paper.difficulty} />

            <Badge variant="secondary">
              {paper.questionTypes.join(", ")}
            </Badge>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border p-4">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-primary" />

                <span className="text-sm text-muted-foreground">
                  Questions
                </span>
              </div>

              <p className="mt-2 text-2xl font-bold">
                {paper.questionCount}
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />

                <span className="text-sm text-muted-foreground">
                  Total Marks
                </span>
              </div>

              <p className="mt-2 text-2xl font-bold">
                {paper.totalMarks}
              </p>
            </div>
          </div>

          <div>
            <h4 className="mb-2 flex items-center gap-2 font-semibold">
              <BookOpen className="h-4 w-4" />
              Topics
            </h4>

            <div className="flex flex-wrap gap-2">
              {paper.topic.map((topic) => (
                <Badge key={topic} variant="outline">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-2 flex items-center gap-2 font-semibold">
              <CircleHelp className="h-4 w-4" />
              Instructions
            </h4>

            <p className="rounded-xl bg-muted p-4 text-sm leading-6">
              {paper.instructions}
            </p>
          </div>

          {paper.additionalInstructions && (
            <div>
              <h4 className="mb-2 flex items-center gap-2 font-semibold">
                <FileText className="h-4 w-4" />
                Additional Instructions
              </h4>

              <p className="rounded-xl border p-4 text-sm">
                {paper.additionalInstructions}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={onStart}>
            Start Paper
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}