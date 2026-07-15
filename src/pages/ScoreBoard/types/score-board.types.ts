export interface DashboardAnalytics {
  totalStudents: number
  totalAttempts: number
  averageScore: number
  passRate: number
}

export interface StudentPerformance {
  studentId: string
  studentName: string
  
  testsAttempted: number

  averageScore: number

  highestScore: number

  lowestScore: number

  lastAttemptAt: string
}

export interface StudentPerformanceResponse {
  students: StudentPerformance[]
}

export interface StudentHistoryItem {
  resultId: string

  assessmentId: string

  assessmentTitle: string

  obtainedMarks: number

  totalMarks: number

  percentage: number

  submittedAt: string
}

export interface StudentHistoryResponse {
  results: StudentHistoryItem[]
}