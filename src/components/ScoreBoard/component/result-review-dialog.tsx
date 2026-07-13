"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useResultDetail } from "@/pages/ScoreBoard/hooks/use-result-detail"

interface Props {
  resultId?: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ResultReviewDialog({
  resultId,
  open,
  onOpenChange,
}: Props) {
  const { data, isLoading } = useResultDetail(resultId)
  const reviews = data?.reviews ?? []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl"   onOpenAutoFocus={(e) => e.preventDefault()}
  onCloseAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Result review</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[70vh]">
          <div className="space-y-4">
            {isLoading &&
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-r-xl border p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-10" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}

            {!isLoading && reviews.length === 0 && (
              <p className="text-center py-10 text-muted-foreground">
                No questions found for this result.
              </p>
            )}

            {!isLoading &&
              reviews.map((review: any, index: number) => (
                <div
                  key={index}
                  className={cn(
                    "border rounded-r-xl p-5",
                    review.isCorrect ? "border-l-4 border-l-green-500" : "border-l-4 border-l-red-500"
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-muted-foreground">
                      Q{review.number}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-medium px-2.5 py-0.5 rounded-full",
                        review.isCorrect
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      )}
                    >
                      {review.isCorrect ? "correct" : "wrong"} · {review.marks}/{review.maxMarks ?? 2}
                    </span>
                  </div>

                  <p className="text-sm mb-3">{review.question}</p>

                  <div className="flex gap-2 mb-1.5">
                    {review.isCorrect ? (
                      <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    ) : (
                      <X className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <p
                      className={cn(
                        "text-sm",
                        review.isCorrect ? "text-green-700" : "text-red-700"
                      )}
                    >
                      {review.selectedAnswer}
                    </p>
                  </div>

                  {!review.isCorrect && (
                    <div className="flex gap-2">
                      <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-muted-foreground">
                        {review.correctAnswer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}