"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Student {
  studentId: string,
  studentName:string
  batchName:string
  programName:string
  averageScore: number
  highestScore: number
  lowestScore: number
  testsAttempted: number
  lastAttemptAt: string
}

interface Props {
  student: Student
  onView: () => void
  rank:number
}

function getTier(avgScore: number) {
  if (avgScore >= 75) {
    return {
      bar: "bg-green-500",
      avatar: "bg-green-100 text-green-700",
      badge: "bg-green-100 text-green-700 hover:bg-green-100",
      score: "text-green-700",
    }
  }
  if (avgScore >= 50) {
    return {
      bar: "bg-amber-500",
      avatar: "bg-amber-100 text-amber-700",
      badge: "bg-amber-100 text-amber-700 hover:bg-amber-100",
      score: "text-amber-700",
    }
  }
  return {
    bar: "bg-red-500",
    avatar: "bg-red-100 text-red-700",
    badge: "bg-red-100 text-red-700 hover:bg-red-100",
    score: "text-red-700",
  }
}

function formatLastAttempt(dateStr: string) {
  const date = new Date(dateStr)
  const diffMs = Date.now() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
}

export function StudentCard({ student, onView }: Props) {
  const tier = getTier(student.averageScore)
  // no name field in the data — short id as a fallback identifier
  // const shortId = student.studentId?.slice(-6).toUpperCase()

  return (
    <Card
      onClick={onView}
      className="relative overflow-hidden cursor-pointer hover:shadow-sm transition-shadow p-0 gap-0"
    >
      <div className={cn("h-1.5 w-full", tier.bar)} />

      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3 justify-between">
          <div className="flex gap-3 mb-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className={cn("text-xs font-medium", tier.avatar)}>
              {student.studentName?.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">{student.studentName}</p>
            <p className="text-xs text-muted-foreground">
              {student.testsAttempted}{" "}
              {student.testsAttempted === 1 ? "test" : "tests"} attempted
            </p>
          </div>
          </div>
          <div className="flex flex-col items-center  gap-2">
              <p className="font-medium text-sm truncate">{student.programName}</p>
              <p className="text-xs text-muted-foreground">{student.batchName}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className={cn("text-lg font-semibold", tier.score)}>
            {student?.averageScore}%
          </span>
          <Badge variant="secondary" className={cn("font-normal", tier.badge)}>
            avg score
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-muted rounded-md px-2 py-1.5 text-center">
            <p className="text-[10px] text-muted-foreground">highest</p>
            <p className="text-sm font-medium text-green-700">
              {student.highestScore}%
            </p>
          </div>
          <div className="bg-muted rounded-md px-2 py-1.5 text-center">
            <p className="text-[10px] text-muted-foreground">lowest</p>
            <p className="text-sm font-medium text-red-700">
              {student.lowestScore}%
            </p>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground">
          Last attempt: {formatLastAttempt(student.lastAttemptAt)}
        </p>
      </CardContent>
    </Card>
  )
}