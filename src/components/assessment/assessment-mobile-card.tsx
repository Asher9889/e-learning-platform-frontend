import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";


import { StatusBadge } from "./status-badge";
import  PublishDialog  from "./publish-dialog";
import type { Assessment } from "@/pages/Assessments/types/assessment.types";
import { useState } from "react";

interface AssessmentMobileCardProps {
  assessment: Assessment;
  onView: (assessment: Assessment) => void;
  onPublish: (assessment: Assessment) => void;
}

export function AssessmentMobileCard({
  assessment,
  onView,
  onPublish,
}: AssessmentMobileCardProps) {
  const [publishOpen, setPublishOpen] = useState(false);
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold">
            {assessment.title}
          </h3>

          <p className="text-sm text-muted-foreground">
            {assessment.assessmentType}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">
              Difficulty
            </p>

            <p>{assessment.difficulty}</p>
          </div>

          <div>
            <p className="text-muted-foreground">
              Questions
            </p>

            <p>{assessment.questionCount}</p>
          </div>

          <div>
            <p className="text-muted-foreground">
              Marks
            </p>

            <p>{assessment.totalMarks}</p>
          </div>

          <div>
            <p className="text-muted-foreground">
              Status
            </p>

            <StatusBadge
              status={assessment.status}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onView(assessment)
            }
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>

          {assessment.status ===
            "DRAFT" && (
            <PublishDialog
             open={publishOpen}
        onOpenChange={setPublishOpen}
              title={assessment.title}
              onPublish={() =>
                onPublish(
                  assessment
                )
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}