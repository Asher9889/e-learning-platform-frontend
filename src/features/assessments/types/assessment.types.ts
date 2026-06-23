import { ASSESSMENT_DIFFICULTIES, ASSESSMENT_TYPE, QUESTION_TYPES } from "../constants/assesments.contants"

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

export interface PublishAssessmentPayload {
  title: string
  instructions: string
  assessmentType: AssessmentType
  programId: string
  subjectId: string
  topic: string[]
  difficulty: Difficulty
  questionTypes: QuestionType[]
  questionCount: number
  totalMarks: number
  additionalInstructions?: string
  questions: Question[]
  batchId?: string
  allStudents: boolean
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
  { value: QUESTION_TYPES.MCQ, label: "MCQ" },
  { value: QUESTION_TYPES.TRUE_FALSE, label: "True / False" },
  { value: QUESTION_TYPES.SHORT_ANSWER, label: "Short Answer" },
  { value: QUESTION_TYPES.LONG_ANSWER, label: "Long Answer" },
  { value: QUESTION_TYPES.CASE_STUDY, label: "Case Study" },
]

export const DIFFICULTIES: Difficulty[] = ["EASY", "MEDIUM", "HARD", "MIXED"]
