import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import AssessmentGeneratorForm from "../components/AssessmentGeneratorForm"
import QuestionPreviewCard from "../components/QuestionPreviewCard"
import AssessmentSummary from "../components/AssessmentSummary"
import EmptyPreviewState from "../components/EmptyPreviewState"
import type {
  Question,
  AssessmentSummary as AssessmentSummaryType,
} from "../types/assessment.types"
import type { AssessmentFormData } from "../schemas/assessment.schema"
import {
  BookOpen,
  Save,
  Sparkles,
  Send,
  Library,
} from "lucide-react"

const DUMMY_QUESTIONS: Question[] = [
  {
    id: "1",
    number: 1,
    type: "mcq",
    difficulty: "easy",
    marks: 2,
    text: "Which data structure follows FIFO principle?",
    options: [
      { label: "A", value: "Stack" },
      { label: "B", value: "Queue" },
      { label: "C", value: "Tree" },
      { label: "D", value: "Graph" },
    ],
    correctAnswer: "Queue",
  },
  {
    id: "2",
    number: 2,
    type: "mcq",
    difficulty: "easy",
    marks: 2,
    text: "What is the time complexity of binary search on a sorted array?",
    options: [
      { label: "A", value: "O(n)" },
      { label: "B", value: "O(log n)" },
      { label: "C", value: "O(n²)" },
      { label: "D", value: "O(1)" },
    ],
    correctAnswer: "O(log n)",
  },
  {
    id: "3",
    number: 3,
    type: "true-false",
    difficulty: "easy",
    marks: 1,
    text: "A linked list allows random access to elements in O(1) time.",
    correctAnswer: "False",
  },
  {
    id: "4",
    number: 4,
    type: "short-answer",
    difficulty: "medium",
    marks: 3,
    text: "What is a deadlock in operating systems? List any two necessary conditions for deadlock.",
    correctAnswer: "A deadlock is a situation where two or more processes are unable to proceed because each is waiting for resources held by the other. Necessary conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait.",
  },
  {
    id: "5",
    number: 5,
    type: "mcq",
    difficulty: "medium",
    marks: 2,
    text: "Which of the following is NOT a characteristic of cloud computing?",
    options: [
      { label: "A", value: "On-demand self-service" },
      { label: "B", value: "Resource pooling" },
      { label: "C", value: "Local storage only" },
      { label: "D", value: "Measured service" },
    ],
    correctAnswer: "Local storage only",
  },
  {
    id: "6",
    number: 6,
    type: "short-answer",
    difficulty: "medium",
    marks: 3,
    text: "Explain the concept of normalization in databases. Why is it important?",
    correctAnswer: "Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity. It involves dividing large tables into smaller, related tables and defining relationships between them.",
  },
  {
    id: "7",
    number: 7,
    type: "long-answer",
    difficulty: "hard",
    marks: 8,
    text: "Design a class hierarchy for a simple e-commerce system. Include classes for Product, Customer, Order, and Payment. Explain the relationships and any design patterns used.",
    correctAnswer: "",
  },
  {
    id: "8",
    number: 8,
    type: "long-answer",
    difficulty: "hard",
    marks: 10,
    text: "Compare and contrast RESTful APIs and GraphQL. Discuss the advantages and disadvantages of each approach for building modern web services.",
    correctAnswer: "",
  },
  {
    id: "9",
    number: 9,
    type: "mcq",
    difficulty: "medium",
    marks: 2,
    text: "Which sorting algorithm has the best average-case time complexity?",
    options: [
      { label: "A", value: "Bubble Sort" },
      { label: "B", value: "Insertion Sort" },
      { label: "C", value: "Merge Sort" },
      { label: "D", value: "Selection Sort" },
    ],
    correctAnswer: "Merge Sort",
  },
  {
    id: "10",
    number: 10,
    type: "case-study",
    difficulty: "hard",
    marks: 15,
    text: "A university wants to build a student enrollment system. The system needs to handle course registration, grade tracking, and transcript generation. Design the system architecture, database schema, and key API endpoints. Discuss potential scalability challenges.",
    correctAnswer: "",
  },
]

export default function CreateAssessmentPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [lastConfig, setLastConfig] = useState<AssessmentFormData | null>(null)
  const [assessmentResult, setAssessmentResult] = useState<{
    questions: Question[]
    summary: AssessmentSummaryType
  } | null>(null)

  const handleGenerate = useCallback(async (data: AssessmentFormData) => {
    setLastConfig(data)
    setIsGenerating(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    const questions = DUMMY_QUESTIONS.map((q, i) => ({
      ...q,
      number: i + 1,
    }))

    const summary: AssessmentSummaryType = {
      totalQuestions: questions.length,
      totalMarks: questions.reduce((sum, q) => sum + q.marks, 0),
      estimatedMinutes: Math.ceil(questions.length * 2.5),
      difficultyDistribution: {
        easy: questions.filter((q) => q.difficulty === "easy").length,
        medium: questions.filter((q) => q.difficulty === "medium").length,
        hard: questions.filter((q) => q.difficulty === "hard").length,
      },
    }

    setAssessmentResult({ questions, summary })
    setIsGenerating(false)
  }, [])

  const handleEdit = useCallback((id: string) => {
    console.log("Edit question:", id)
  }, [])

  const handleDelete = useCallback((id: string) => {
    setAssessmentResult((prev) => {
      if (!prev) return prev
      const filtered = prev.questions.filter((q) => q.id !== id)
      const updated = filtered.map((q, i) => ({ ...q, number: i + 1 }))
      const summary: AssessmentSummaryType = {
        totalQuestions: updated.length,
        totalMarks: updated.reduce((sum, q) => sum + q.marks, 0),
        estimatedMinutes: Math.ceil(updated.length * 2.5),
        difficultyDistribution: {
          easy: updated.filter((q) => q.difficulty === "easy").length,
          medium: updated.filter((q) => q.difficulty === "medium").length,
          hard: updated.filter((q) => q.difficulty === "hard").length,
        },
      }
      return { questions: updated, summary }
    })
  }, [])

  const handleRegenerate = useCallback((id: string) => {
    console.log("Regenerate question:", id)
  }, [])

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="size-4" />
            <span>Assessments</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            AI Assessment Generator
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create quizzes, assignments and question papers in seconds using AI.
          </p>
        </div>
        <Button variant="outline" size="sm" className="shrink-0 gap-2">
          <Library className="size-4" />
          View Assessment Library
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[35%_65%]">
        <div>
          <AssessmentGeneratorForm
            onSubmit={handleGenerate}
            isGenerating={isGenerating}
          />
        </div>

        <div className="space-y-6">
          {isGenerating ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-4">
                <h3 className="text-base font-semibold text-foreground">
                  Generated Assessment Preview
                </h3>
                <p className="text-sm text-muted-foreground">
                  AI is crafting your assessment...
                </p>
              </div>
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-8 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : assessmentResult ? (
            <>
              <div className="rounded-xl border border-border bg-card p-4">
                <h3 className="text-base font-semibold text-foreground">
                  Generated Assessment Preview
                </h3>
                <p className="text-sm text-muted-foreground">
                  Review and edit before publishing.
                </p>
              </div>

              <div className="space-y-3">
                {assessmentResult.questions.map((question) => (
                  <QuestionPreviewCard
                    key={question.id}
                    question={question}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onRegenerate={handleRegenerate}
                  />
                ))}
              </div>

              <AssessmentSummary summary={assessmentResult.summary} />

              <div className="sticky bottom-0 rounded-xl border border-border bg-card p-4 shadow-lg">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Save className="size-4" />
                    Save Draft
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => lastConfig && handleGenerate(lastConfig)}
                  >
                    <Sparkles className="size-4" />
                    Generate Again
                  </Button>
                  <Button
                    size="sm"
                    className="gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md hover:from-indigo-600 hover:to-indigo-700"
                  >
                    <Send className="size-4" />
                    Publish Assessment
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-xl border border-border bg-card p-4">
                <h3 className="text-base font-semibold text-foreground">
                  Generated Assessment Preview
                </h3>
                <p className="text-sm text-muted-foreground">
                  Review and edit before publishing.
                </p>
              </div>
              <EmptyPreviewState />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
