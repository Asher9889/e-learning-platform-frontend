"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assessment: any;
}

export function AssessmentPreviewDialog({
  open,
  onOpenChange,
  assessment,
}: Props) {
  if (!assessment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>
            {assessment.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">

          <div className="grid grid-cols-2 gap-4">
            <Info
              label="Assessment Type"
              value={assessment.assessmentType}
            />

            <Info
              label="Difficulty"
              value={assessment.difficulty}
            />

            <Info
              label="Questions"
              value={assessment.questionCount}
            />

            <Info
              label="Total Marks"
              value={assessment.totalMarks}
            />

            <Info
              label="Status"
              value={assessment.status}
            />

            <Info
              label="Question Types"
              value={assessment.questionTypes.join(", ")}
            />
          </div>

          <Separator />

          <div>
            <h4 className="mb-2 text-sm font-semibold">
              Topics
            </h4>

            <div className="flex flex-wrap gap-2">
              {assessment.topic?.map((topic: string) => (
                <Badge key={topic} variant="secondary">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="mb-2 text-sm font-semibold">
              Sample Questions
            </h4>

            <div className="space-y-3">
              {assessment.questions
                ?.slice(0, 3)
                .map((q: any) => (
                  <div
                    key={q.id}
                    className="rounded-lg border p-3"
                  >
                    <p className="font-medium">
                      Q{q.number}. {q.question}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Marks: {q.marks}
                    </p>
                  </div>
                ))}
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">
        {label}
      </p>
      <p className="font-medium">{value}</p>
    </div>
  );
}