import type { ASSESSMENT_DIFFICULTIES, ASSESSMENT_TYPE, QUESTION_TYPES } from "../constants/assesments.contants"

export type AssessmentType = typeof ASSESSMENT_TYPE[keyof typeof ASSESSMENT_TYPE]

export type Difficulty = typeof ASSESSMENT_DIFFICULTIES[keyof typeof ASSESSMENT_DIFFICULTIES]

export type QuestionType = typeof QUESTION_TYPES[keyof typeof QUESTION_TYPES]

export interface Question {
  id: string
  number: number
  question: string
  type: QuestionType
  marks: number
  difficulty: Difficulty
  options?: string[]
  correctAnswer?: string
  explanation?: string
}

export interface AssessmentPayload {
  assessmentType: AssessmentType
  programId: string
  subjectId: string
  topic: string[]
  difficulty: Difficulty
  questionTypes: QuestionType[]
  questionCount: number
  totalMarks?: number
  additionalInstructions?: string
}

export interface AssessmentApiResponse {
  success: boolean
  statusCode: number
  message: string
  data: {
    title: string
    instructions: string
    assessmentType: AssessmentType
    program: { id: string; name: string }
    subjectId: { id: string; name: string }
    topic: string[]
    difficulty: Difficulty
    questionTypes: QuestionType[]
    questionCount: number
    totalMarks: number
    additionalInstructions: string
    status: "DRAFT" | "PUBLISHED"
    createdBy: string
    questions: Question[]
  }
}

export interface AssessmentSummary {
  totalQuestions: number
  totalMarks: number
  estimatedMinutes: number
  difficultyDistribution: {
    easy: number
    medium: number
    hard: number
  }
}

export const ASSESSMENT_TYPES: {
  value: AssessmentType
  label: string
  description: string
  icon: string
}[] = [
  {
    value: "QUIZ",
    label: "Quiz",
    description: "Short objective questions.",
    icon: "ClipboardCheck",
  },
  {
    value: "ASSIGNMENT",
    label: "Assignment",
    description: "Long-form descriptive questions.",
    icon: "FileText",
  },
  {
    value: "QUESTION-PAPER",
    label: "Question Paper",
    description: "Structured exam format.",
    icon: "BookOpen",
  },
]

export const QUESTION_TYPE_OPTIONS: {
  value: QuestionType
  label: string
}[] = [
  { value: "MCQ", label: "MCQ" },
  { value: "TRUE-FALSE", label: "True / False" },
  { value: "SHORT-ANSWER", label: "Short Answer" },
  { value: "LONG-ANSWER", label: "Long Answer" },
  { value: "CASE-STUDY", label: "Case Study" },
]

export const DIFFICULTIES: Difficulty[] = ["EASY", "MEDIUM", "HARD", "MIXED"]
