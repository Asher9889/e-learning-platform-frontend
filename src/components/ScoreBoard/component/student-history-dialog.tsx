"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useStudentHistory } from "@/pages/ScoreBoard/hooks/use-student-history"

interface Props {
  studentId?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onViewResult: (resultId: string) => void
  isChildDialogOpen?: boolean // true jab ResultReviewDialog isके upar khula ho
}

function getPercentageStyle(pct: number) {
  if (pct >= 75) return "bg-green-100 text-green-700 hover:bg-green-100"
  if (pct >= 50) return "bg-amber-100 text-amber-700 hover:bg-amber-100"
  return "bg-red-100 text-red-700 hover:bg-red-100"
}

export function StudentHistoryDialog({
  studentId,
  open,
  onOpenChange,
  onViewResult,
  isChildDialogOpen,
}: Props) {
  const { data, isLoading } = useStudentHistory(studentId)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="!w-[50%] !max-w-none overflow-y-auto"
        onEscapeKeyDown={(e) => {
          if (isChildDialogOpen) e.preventDefault()
        }}
        onPointerDownOutside={(e) => {
          if (isChildDialogOpen) e.preventDefault()
        }}
        onInteractOutside={(e) => {
          if (isChildDialogOpen) e.preventDefault()
        }}
      >
        <SheetHeader>
          <SheetTitle>Assessment history</SheetTitle>
        </SheetHeader>

        <div className="px-4 pb-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assessment</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>%</TableHead>
                <TableHead>Date</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-10 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-14" /></TableCell>
                  </TableRow>
                ))}

              {!isLoading && data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No assessments attempted yet.
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                data?.map((result: any) => (
                  <TableRow key={result.resultId}>
                    <TableCell className="font-medium">
                      {result.assessmentTitle}
                    </TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {result.obtainedMarks}/{result.totalMarks}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn("font-normal", getPercentageStyle(result.percentage))}
                      >
                        {result.percentage}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {new Date(result.submittedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewResult(result.resultId)}
                      >
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </SheetContent>
    </Sheet>
  )
}