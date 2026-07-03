import { useState } from "react"
import { useGetBatches } from "@/pages/Batches/hooks/useGetBatches"
import { mapToLabelValue } from "@/lib/utils"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Users, Loader2, Send } from "lucide-react"
import { usePublishAssessment } from "../hooks/usePublishAssessment"
import type { Question } from "../types/assessment.types"
import type { AssessmentFormData } from "../schemas/assessment.schema"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  config: AssessmentFormData
  questions: Question[]
  title: string
  instructions: string
  assessmentResult: {
    questions: Question[]
    summary: { totalQuestions: number; totalMarks: number; estimatedMinutes: number }
  }
  onPublished?: () => void
}

export default function PublishAssessmentDialog({
  open,
  onOpenChange,
  config,
  questions,
  title,
  instructions,
  assessmentResult,
  onPublished,
}: Props) {
  const [batchId, setBatchId] = useState("")

  const { data: batchesData, isLoading: batchesLoading } = useGetBatches(config.programId)
  const batches = batchesData?.batches || []
  const batchOptions = mapToLabelValue(batches, "name", "id")
  const selectedBatchLabel = batches.find((b) => b.id === batchId)?.name

  const { mutate: publish, isPending: isPublishing } = usePublishAssessment()

  const handlePublish = () => {
    publish(
      {
        title,
        instructions,
        assessmentType: config.assessmentType,
        programId: config.programId,
        subjectId: config.subjectId,
        topic: config.topic,
        difficulty: config.difficulty,
        questionTypes: config.questionTypes,
        questionCount: config.questionCount,
        totalMarks: config.totalMarks || assessmentResult.summary.totalMarks,
        additionalInstructions: config.additionalInstructions,
        questions,
        batchId: batchId || undefined,
        allStudents: !batchId,
      },
      {
        onSuccess: () => {
          onOpenChange(false)
          setBatchId("")
          onPublished?.()
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Publish Assessment</DialogTitle>
          <DialogDescription>
            Choose the audience for this assessment before publishing.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <label className="text-sm font-medium">Batch (optional)</label>
            <Select
              value={batchId || "__all__"}
              disabled={batchesLoading}
              onValueChange={(v) => setBatchId(v === "__all__" ? "" : v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    batchesLoading
                      ? "Loading batches..."
                      : "All students in this program"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All students in this program</SelectItem>
                {batchOptions.map((b) => (
                  <SelectItem key={b.value} value={b.value}>
                    {b.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-start gap-2 mt-1.5">
              <Users className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <p className="text-xs text-muted-foreground">
                {!batchId
                  ? "All students enrolled in this program can access this assessment."
                  : `Only students in the "${selectedBatchLabel}" batch can access this assessment.`}
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/30 p-3 space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Assessment summary</p>
            <div className="flex gap-4 text-sm">
              <span>{assessmentResult.summary.totalQuestions} questions</span>
              <span>{assessmentResult.summary.totalMarks} marks</span>
              <span>~{assessmentResult.summary.estimatedMinutes} min</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPublishing}>
            Cancel
          </Button>
          <Button onClick={handlePublish} disabled={isPublishing} className="gap-2">
            {isPublishing ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
            {isPublishing ? "Publishing..." : "Publish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
