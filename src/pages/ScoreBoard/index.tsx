"use client"

import { useMemo, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Loader2 } from "lucide-react"

import { StudentList } from "#components/ScoreBoard/component/student-list"
import { StudentHistoryDialog } from "#components/ScoreBoard/component/student-history-dialog"
import { ResultReviewDialog } from "#components/ScoreBoard/component/result-review-dialog"
import { AnalyticsCards } from "#components/ScoreBoard/component/analytics-cards"
import { useDashboardAnalytics } from "../ScoreBoard/hooks/use-dashboard-analytics"
import { useStudentPerformance } from "../ScoreBoard/hooks/use-student-performance"
import { useDebouncedValue } from "../Assignment/hook/useDebouncedValue"

export default function ScoreBoardPage() {
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebouncedValue(search, 400)

  const [selectedStudent, setSelectedStudent] = useState<string | undefined>()
  const [selectedResult, setSelectedResult] = useState<string | undefined>()
  const [historyOpen, setHistoryOpen] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)

  const suppressHistoryCloseRef = useRef(false)

  const { data: analytics } = useDashboardAnalytics()

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useStudentPerformance({
    search: debouncedSearch,
    limit: 20,
  })

  // flatten all fetched pages into a single array for the list
  const studentsData = useMemo(
    () => data?.pages.flatMap((page) => page.students) ?? [],
    [data]
  )

  const handleReviewOpenChange = (open: boolean) => {
    setReviewOpen(open)
    if (!open) {
      suppressHistoryCloseRef.current = true
      setTimeout(() => {
        suppressHistoryCloseRef.current = false
      }, 300)
    }
  }

  const handleHistoryOpenChange = (open: boolean) => {
    if (!open && suppressHistoryCloseRef.current) return
    setHistoryOpen(open)
  }
console.log(studentsData,"studentsData rowStudentsrowStudents",data ,"hasnext",hasNextPage)
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Student Results</h1>

      {analytics && <AnalyticsCards analytics={analytics} />}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or roll number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {!isLoading && (
        <p className="text-sm text-muted-foreground">
          {studentsData.length} student{studentsData.length !== 1 && "s"} found
        </p>
      )}

      <StudentList
        students={studentsData}
        isLoading={isLoading}
        search={debouncedSearch}
        onViewStudent={(studentId) => {
          setSelectedStudent(studentId)
          setHistoryOpen(true)
        }}
      />

      {hasNextPage && (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isFetchingNextPage ? "Loading..." : "Load more"}
          </Button>
        </div>
      )}

      <StudentHistoryDialog
        studentId={selectedStudent}
        open={historyOpen}
        onOpenChange={handleHistoryOpenChange}
        isChildDialogOpen={reviewOpen}
        onViewResult={(resultId) => {
          setSelectedResult(resultId)
          setReviewOpen(true)
        }}
      />

      <ResultReviewDialog
        resultId={selectedResult}
        open={reviewOpen}
        onOpenChange={handleReviewOpenChange}
      />
    </div>
  )
}