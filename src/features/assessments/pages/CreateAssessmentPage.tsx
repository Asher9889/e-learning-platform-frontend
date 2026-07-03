import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import AssessmentGeneratorForm from "../components/AssessmentGeneratorForm"
import QuestionPreviewCard from "../components/QuestionPreviewCard"
import AssessmentSummary from "../components/AssessmentSummary"
import EmptyPreviewState from "../components/EmptyPreviewState"
import PublishAssessmentDialog from "../components/PublishAssessmentDialog"
import { useGenerateAssessment } from "../hooks/useGenerateAssessment"
import { useCreateAssessmentDraft } from "../hooks/useCreateAssessmentDraft"
import type { Question, AssessmentSummary as AssessmentSummaryType, CreateAssessmentPayload } from "../types/assessment.types"
import type { AssessmentFormData } from "../schemas/assessment.schema"
import {
  BookOpen,
  Save,
  // Sparkles,
  Send,
  AlertCircle,
  RotateCcw,
} from "lucide-react"

export default function CreateAssessmentPage() {
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [lastConfig, setLastConfig] = useState<AssessmentFormData | null>(null)
  const [assessmentResult, setAssessmentResult] = useState<{
    title: string
    instructions: string
    questions: Question[]
    summary: AssessmentSummaryType
  } | null>(null)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [publishOpen, setPublishOpen] = useState(false)

  const { mutateAsync: generateAssessment, isPending: isGenerating } = useGenerateAssessment()
  const { mutateAsync: saveDraft, isPending: isSavingDraft } = useCreateAssessmentDraft()

  const computeSummary = useCallback((questions: Question[]): AssessmentSummaryType => ({
    totalQuestions: questions.length,
    totalMarks: questions.reduce((sum, q) => sum + q.marks, 0),
    estimatedMinutes: Math.ceil(questions.length * 2.5),
    difficultyDistribution: {
      easy: questions.filter((q) => q.difficulty === "EASY").length,
      medium: questions.filter((q) => q.difficulty === "MEDIUM").length,
      hard: questions.filter((q) => q.difficulty === "HARD").length,
    },
  }), [])

  const handleGenerate = useCallback(async (formData: AssessmentFormData) => {
    setLastConfig(formData)
    setGenerationError(null)

    const payload = {
      assessmentType: formData.assessmentType,
      programId: formData.programId,
      subjectId: formData.subjectId,
      topic: formData.topic,
      difficulty: formData.difficulty,
      questionTypes: formData.questionTypes,
      questionCount: formData.questionCount,
      totalMarks: formData.totalMarks,
      additionalInstructions: formData.additionalInstructions,
    }

    try {
      const response = await generateAssessment(payload);
      const questions = response.questions.map((q, i) => ({
        ...q,
        id: q.id || crypto.randomUUID(),
        number: i + 1,
      }))
      setAssessmentResult({
        title: response.title,
        instructions: response.instructions,
        questions,
        summary: computeSummary(questions),
      })
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : "Failed to generate assessment")
    }
  }, [generateAssessment, computeSummary])

  const handleEdit = useCallback((id: string, updates: Partial<Question>) => {
    setAssessmentResult((prev) => {
      if (!prev) return prev
      const questions = prev.questions.map((q) =>
        q.id === id ? { ...q, ...updates } : q
      )
      return { ...prev, questions, summary: computeSummary(questions) }
    })
  }, [computeSummary])

  const handleTitleChange = useCallback((title: string) => {
    setAssessmentResult((prev) => prev ? { ...prev, title } : prev)
  }, [])

  const handleInstructionsChange = useCallback((instructions: string) => {
    setAssessmentResult((prev) => prev ? { ...prev, instructions } : prev)
  }, [])

  const handleDelete = useCallback((id: string) => {
    setAssessmentResult((prev) => {
      if (!prev) return prev
      const questions = prev.questions
        .filter((q) => q.id !== id)
        .map((q, i) => ({ ...q, number: i + 1 }))
      return { ...prev, questions, summary: computeSummary(questions) }
    })
  }, [computeSummary])

  const handleRegenerate = useCallback((id: string) => {
    console.log("Regenerate question:", id)
  }, [])

  const handleDragStart = useCallback((index: number) => {
    setDragIndex(index)
  }, [])

  const handleDragOver = useCallback((index: number) => {
    if (dragIndex === null || dragIndex === index) return
    setAssessmentResult((prev) => {
      if (!prev) return prev
      const items = [...prev.questions]
      const [moved] = items.splice(dragIndex, 1)
      items.splice(index, 0, moved)
      const renumbered = items.map((q, i) => ({ ...q, number: i + 1 }))
      return { ...prev, questions: renumbered, summary: computeSummary(renumbered) }
    })
    setDragIndex(index)
  }, [dragIndex, computeSummary])

  const clearPreview = useCallback(() => {
    setAssessmentResult(null)
    setLastConfig(null)
    setGenerationError(null)
  }, [])

  const handleSaveDraft = useCallback(async () => {
    if (!lastConfig || !assessmentResult) return

    const payload: CreateAssessmentPayload = {
      title: assessmentResult.title,
      instructions: assessmentResult.instructions,
      assessmentType: lastConfig.assessmentType,
      programId: lastConfig.programId,
      subjectId: lastConfig.subjectId,
      topic: lastConfig.topic,
      difficulty: lastConfig.difficulty,
      questionTypes: lastConfig.questionTypes,
      questionCount: lastConfig.questionCount,
      totalMarks: lastConfig.totalMarks || assessmentResult.summary.totalMarks,
      additionalInstructions: lastConfig.additionalInstructions,
      questions: assessmentResult.questions,
      batchId: undefined,
      allStudents: false,
    }

    await saveDraft(payload)
    clearPreview()
  }, [lastConfig, assessmentResult, saveDraft, clearPreview])

  const handleDragEnd = useCallback(() => {
    setDragIndex(null)
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

              <div className="rounded-xl border border-border bg-card p-4 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Title</label>
                  <Input
                    value={assessmentResult.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="text-base font-semibold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Instructions</label>
                  <Textarea
                    value={assessmentResult.instructions}
                    onChange={(e) => handleInstructionsChange(e.target.value)}
                    className="resize-none"
                    rows={2}
                  />
                </div>
              </div>

              <div className="space-y-3">
                {assessmentResult.questions.map((question, i) => (
                  <QuestionPreviewCard
                    key={question.id}
                    question={question}
                    index={i}
                    isDragging={dragIndex === i}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onRegenerate={handleRegenerate}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                  />
                ))}
              </div>

              <AssessmentSummary summary={assessmentResult.summary} />

              <div className="sticky bottom-0 rounded-xl border border-border bg-card p-4 shadow-lg">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    disabled={isSavingDraft}
                    onClick={handleSaveDraft}
                  >
                    <Save className="size-4" />
                    {isSavingDraft ? "Saving..." : "Save Draft"}
                  </Button>
                  {/* <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => lastConfig && handleGenerate(lastConfig)}
                  >
                    <Sparkles className="size-4" />
                    Generate Again
                  </Button> */}
                  <Button
                    size="sm"
                    className="gap-2 bg-linear-to-r from-indigo-500 to-indigo-600 text-white shadow-md hover:from-indigo-600 hover:to-indigo-700"
                    onClick={() => setPublishOpen(true)}
                  >
                    <Send className="size-4" />
                    Publish Assessment
                  </Button>
                </div>
              </div>

              {lastConfig && assessmentResult && (
                <PublishAssessmentDialog
                  open={publishOpen}
                  onOpenChange={setPublishOpen}
                  config={lastConfig}
                  questions={assessmentResult.questions}
                  assessmentResult={assessmentResult}
                  title={assessmentResult.title}
                  instructions={assessmentResult.instructions}
                  onPublished={clearPreview}
                />
              )}
            </>
          ) : generationError ? (
            <>
              <div className="rounded-xl border border-border bg-card p-4">
                <h3 className="text-base font-semibold text-foreground">
                  Generated Assessment Preview
                </h3>
                <p className="text-sm text-muted-foreground">
                  Review and edit before publishing.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-red-300 bg-red-50/50 p-12 text-center dark:border-red-800 dark:bg-red-950/20">
                <AlertCircle className="mb-3 size-10 text-red-500" />
                <h3 className="mb-1 text-lg font-semibold text-red-700 dark:text-red-400">
                  Generation Failed
                </h3>
                <p className="mb-4 max-w-sm text-sm text-red-600 dark:text-red-300">
                  {generationError}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/40"
                  onClick={() => lastConfig && handleGenerate(lastConfig)}
                >
                  <RotateCcw className="size-4" />
                  Try Again
                </Button>
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
