import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { AssessmentSummary as AssessmentSummaryType } from "../types/assessment.types"
import { Clock, FileQuestion, Target } from "lucide-react"

interface AssessmentSummaryProps {
  summary: AssessmentSummaryType
}

export default function AssessmentSummary({ summary }: AssessmentSummaryProps) {
  const total = summary.difficultyDistribution.easy +
    summary.difficultyDistribution.medium +
    summary.difficultyDistribution.hard

  const easyPct = total > 0 ? Math.round((summary.difficultyDistribution.easy / total) * 100) : 0
  const mediumPct = total > 0 ? Math.round((summary.difficultyDistribution.medium / total) * 100) : 0
  const hardPct = total > 0 ? Math.round((summary.difficultyDistribution.hard / total) * 100) : 0

  return (
    <Card>
      <CardContent className="grid grid-cols-2 gap-4 pt-4 md:grid-cols-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <FileQuestion className="size-3.5" />
            Total Questions
          </div>
          <p className="text-2xl font-bold text-foreground">{summary.totalQuestions}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Target className="size-3.5" />
            Total Marks
          </div>
          <p className="text-2xl font-bold text-foreground">{summary.totalMarks}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="size-3.5" />
            Est. Time
          </div>
          <p className="text-2xl font-bold text-foreground">{summary.estimatedMinutes} min</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            Difficulty Split
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-8 text-green-600">Easy</span>
              <Progress value={easyPct} className="h-1.5 [&>[data-slot=progress-bar]]:bg-green-400" />
              <span className="w-8 text-right text-muted-foreground">{easyPct}%</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-8 text-amber-600">Med</span>
              <Progress value={mediumPct} className="h-1.5 [&>[data-slot=progress-bar]]:bg-amber-400" />
              <span className="w-8 text-right text-muted-foreground">{mediumPct}%</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-8 text-red-600">Hard</span>
              <Progress value={hardPct} className="h-1.5 [&>[data-slot=progress-bar]]:bg-red-400" />
              <span className="w-8 text-right text-muted-foreground">{hardPct}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
