import { useState, useRef, useEffect, type DragEvent } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { Question } from "../types/assessment.types"
import {
  GripVertical,
  ChevronDown,
  Edit,
  Trash2,
  RefreshCw,
  HelpCircle,
  CheckCircle2,
  FileText,
  AlignLeft,
  CaseSensitive,
  Save,
  X,
  Plus,
} from "lucide-react"

const typeIcons: Record<string, typeof HelpCircle> = {
  MCQ: HelpCircle,
  "TRUE-FALSE": CheckCircle2,
  "SHORT-ANSWER": FileText,
  "LONG-ANSWER": AlignLeft,
  "CASE-STUDY": CaseSensitive,
}

const typeLabels: Record<string, string> = {
  MCQ: "MCQ",
  "TRUE-FALSE": "True / False",
  "SHORT-ANSWER": "Short Answer",
  "LONG-ANSWER": "Long Answer",
  "CASE-STUDY": "Case Study",
}

const difficultyColors: Record<string, string> = {
  EASY: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  MEDIUM: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  HARD: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
}

interface QuestionPreviewCardProps {
  question: Question
  index: number
  isDragging?: boolean
  onEdit: (id: string, updates: Partial<Question>) => void
  onDelete: (id: string) => void
  onRegenerate: (id: string) => void
  onDragStart?: (index: number) => void
  onDragOver?: (index: number) => void
  onDragEnd?: () => void
}

export default function QuestionPreviewCard({
  question,
  index,
  isDragging,
  onEdit,
  onDelete,
  onRegenerate,
  onDragStart,
  onDragOver,
  onDragEnd,
}: QuestionPreviewCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<Question>>({})
  const cardRef = useRef<HTMLDivElement>(null)

  const TypeIcon = typeIcons[question.type]

  useEffect(() => {
    if (editing) setIsOpen(true)
  }, [editing])

  const startEdit = () => {
    setEditForm({
      question: question.question,
      type: question.type,
      marks: question.marks,
      difficulty: question.difficulty,
      options: question.options ? [...question.options] : undefined,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
    })
    setEditing(true)
  }

  const cancelEdit = () => {
    setEditing(false)
    setEditForm({})
  }

  const saveEdit = () => {
    onEdit(question.id, editForm)
    setEditing(false)
    setEditForm({})
  }

  const updateField = (field: string, value: unknown) => {
    setEditForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleOptionChange = (optIndex: number, value: string) => {
    const opts = [...(editForm.options ?? [])]
    opts[optIndex] = value
    updateField("options", opts)
  }

  const handleDragStart = (e: DragEvent) => {
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", String(index))
    if (cardRef.current) {
      e.dataTransfer.setDragImage(cardRef.current, 20, 20)
    }
    onDragStart?.(index)
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    onDragOver?.(index)
  }

  const renderOptions = (opts: string[], correct?: string, editing?: boolean) => {
    if (editing) {
      return (
        <div className="mb-3 space-y-2">
          {opts.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="radio"
                name={`correct-${question.id}`}
                checked={editForm.correctAnswer === opt}
                onChange={() => updateField("correctAnswer", opt)}
                className="size-4 accent-indigo-500"
              />
              <Input
                value={opt}
                onChange={(e) => handleOptionChange(i, e.target.value)}
                className="h-8 text-sm"
              />
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            size="xs"
            className="gap-1 text-xs text-muted-foreground"
            onClick={() => updateField("options", [...opts, ""])}
          >
            <Plus className="size-3" /> Add option
          </Button>
        </div>
      )
    }

    return (
      <div className="mb-3 space-y-1.5">
        {opts.map((opt, i) => (
          <div
            key={i}
            className={cn(
              "rounded-lg border px-3 py-2 text-sm transition-colors",
              opt === correct
                ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/20 dark:text-green-300"
                : "border-border bg-muted/30 text-muted-foreground"
            )}
          >
            <span className="mr-2 font-medium">{String.fromCharCode(65 + i)}.</span>
            {opt}
          </div>
        ))}
      </div>
    )
  }

  const renderEditContent = () => (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Question</label>
        <Textarea
          value={editForm.question ?? ""}
          onChange={(e) => updateField("question", e.target.value)}
          className="min-h-16 text-sm"
        />
      </div>

      {editForm.options && renderOptions(editForm.options, editForm.correctAnswer, true)}

      {editForm.type !== "MCQ" && editForm.type !== "TRUE-FALSE" && (
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Answer</label>
          <Textarea
            value={editForm.correctAnswer ?? ""}
            onChange={(e) => updateField("correctAnswer", e.target.value)}
            className="min-h-12 text-sm"
          />
        </div>
      )}

      {editForm.type === "TRUE-FALSE" && (
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Correct Answer</label>
          <div className="flex gap-2">
            {["True", "False"].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => updateField("correctAnswer", v)}
                className={cn(
                  "rounded-lg border-2 px-4 py-1.5 text-sm font-medium transition-all",
                  editForm.correctAnswer === v
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-border text-muted-foreground hover:border-indigo-200"
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Marks</label>
          <Input
            type="number"
            value={editForm.marks ?? 0}
            onChange={(e) => updateField("marks", Number(e.target.value))}
            className="h-8"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Difficulty</label>
          <select
            value={editForm.difficulty ?? "MEDIUM"}
            onChange={(e) => updateField("difficulty", e.target.value)}
            className="h-8 w-full rounded-md border border-input bg-transparent px-2 text-sm"
          >
            {["EASY", "MEDIUM", "HARD"].map((d) => (
              <option key={d} value={d}>{d.charAt(0) + d.slice(1).toLowerCase()}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Explanation (optional)</label>
        <Textarea
          value={editForm.explanation ?? ""}
          onChange={(e) => updateField("explanation", e.target.value)}
          className="min-h-12 text-sm"
        />
      </div>
    </div>
  )

  const renderViewContent = () => (
    <>
      <div className="mb-3 text-sm text-foreground">{question.question}</div>

      {question.options && renderOptions(question.options, question.correctAnswer)}

      {question.correctAnswer && !question.options && (
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-800 dark:bg-green-950/20 dark:text-green-300">
          <CheckCircle2 className="size-4 shrink-0" />
          Answer: {question.correctAnswer}
        </div>
      )}

      {question.explanation && (
        <div className="mb-3 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-950/20 dark:text-blue-300">
          <span className="font-medium">Explanation:</span> {question.explanation}
        </div>
      )}
    </>
  )

  return (
    <div
      ref={cardRef}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={onDragEnd}
      className={cn(
        "rounded-xl border bg-card transition-shadow",
        isDragging ? "border-indigo-400 shadow-lg opacity-50" : "border-border shadow-sm",
        "hover:shadow-md"
      )}
    >
      <div className="flex items-center gap-2 px-3 py-3" onClick={() => !editing && setIsOpen(!isOpen)}>
        <div
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <GripVertical className="size-4" />
        </div>

        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-300">
          {question.number}
        </div>

        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {question.question}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <TypeIcon className="size-3" />
              {typeLabels[question.type]}
            </span>
            <span className="text-xs text-muted-foreground">{question.marks} marks</span>
            <Badge
              className={cn(
                "border-0 font-normal",
                difficultyColors[question.difficulty] ?? "bg-gray-100 text-gray-700"
              )}
            >
              {question.difficulty === "EASY" ? "Easy" : question.difficulty === "MEDIUM" ? "Medium" : "Hard"}
            </Badge>
          </div>
        </div>

        {!editing && (
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        )}
      </div>

      {isOpen && (
        <div className="border-t border-border px-4 py-3">
          {editing ? renderEditContent() : renderViewContent()}

          <div className={cn("flex items-center gap-2", editing ? "justify-between" : "justify-start border-t border-border pt-3")}>
            {editing ? (
              <>
                <Button variant="ghost" size="xs" onClick={cancelEdit}>
                  <X className="size-3" /> Cancel
                </Button>
                <Button size="xs" className="gap-1" onClick={saveEdit}>
                  <Save className="size-3" /> Save
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="xs" onClick={() => { startEdit(); }}>
                  <Edit className="size-3" /> Edit
                </Button>
                <Button variant="outline" size="xs" onClick={() => onDelete(question.id)}>
                  <Trash2 className="size-3" /> Delete
                </Button>
                <Button variant="outline" size="xs" onClick={() => onRegenerate(question.id)}>
                  <RefreshCw className="size-3" /> Regenerate
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
