import type { ASSESSMENT_DIFFICULTIES, ASSESSMENT_TYPE, QUESTION_TYPES } from "../constants/assesments.contants"



export type AssessmentType = typeof ASSESSMENT_TYPE[keyof typeof ASSESSMENT_TYPE]

export type Difficulty = typeof ASSESSMENT_DIFFICULTIES[keyof typeof ASSESSMENT_DIFFICULTIES]

export type QuestionType = typeof QUESTION_TYPES[keyof typeof QUESTION_TYPES]

export interface QuestionOption {
  label: string
  value: string
}

export interface Question {
  id: string
  number: number
  type: QuestionType
  difficulty: Difficulty
  marks: number
  text: string
  options?: QuestionOption[]
  correctAnswer?: string
}

export interface AssessmentConfig {
  assessmentType: AssessmentType
  subject: string
  topic: string
  difficulty: Difficulty
  questionTypes: QuestionType[]
  questionCount: number
  totalMarks: number
  additionalInstructions: string
}

export interface AssessmentResult {
  config: AssessmentConfig
  questions: Question[]
  generatedAt: string
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

export const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Computer Science",
  "Data Structures",
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
