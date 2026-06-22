import { useState } from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Question } from "../types/assessment.types"
import {
  ChevronDown,
  Edit,
  Trash2,
  RefreshCw,
  HelpCircle,
  CheckCircle2,
  FileText,
  AlignLeft,
  CaseSensitive,
} from "lucide-react"

const typeIcons = {
  mcq: HelpCircle,
  "true-false": CheckCircle2,
  "short-answer": FileText,
  "long-answer": AlignLeft,
  "case-study": CaseSensitive,
}

const typeLabels: Record<string, string> = {
  mcq: "MCQ",
  "true-false": "True / False",
  "short-answer": "Short Answer",
  "long-answer": "Long Answer",
  "case-study": "Case Study",
}

const difficultyColors: Record<string, string> = {
  easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
}

interface QuestionPreviewCardProps {
  question: Question
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onRegenerate: (id: string) => void
}

export default function QuestionPreviewCard({
  question,
  onEdit,
  onDelete,
  onRegenerate,
}: QuestionPreviewCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const TypeIcon = typeIcons[question.type]

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="rounded-xl border border-border bg-card transition-shadow hover:shadow-sm"
    >
      <CollapsibleTrigger className="flex w-full items-center gap-3 px-4 py-3 text-left cursor-pointer">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-300">
          {question.number}
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {question.text}
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
              {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
            </Badge>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="border-t border-border px-4 py-3">
          <div className="mb-3 text-sm text-foreground">{question.text}</div>

          {question.options && (
            <div className="mb-3 space-y-1.5">
              {question.options.map((opt) => (
                <div
                  key={opt.value}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-sm transition-colors",
                    opt.value === question.correctAnswer
                      ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/20 dark:text-green-300"
                      : "border-border bg-muted/30 text-muted-foreground"
                  )}
                >
                  <span className="mr-2 font-medium">{opt.label}.</span>
                  {opt.value}
                </div>
              ))}
            </div>
          )}

          {question.correctAnswer && !question.options && (
            <div className="mb-3 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-800 dark:bg-green-950/20 dark:text-green-300">
              <CheckCircle2 className="size-4" />
              Answer: {question.correctAnswer}
            </div>
          )}

          <div className="flex items-center gap-2 border-t border-border pt-3">
            <Button
              variant="outline"
              size="xs"
              onClick={() => onEdit(question.id)}
            >
              <Edit className="size-3" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="xs"
              onClick={() => onDelete(question.id)}
            >
              <Trash2 className="size-3" />
              Delete
            </Button>
            <Button
              variant="outline"
              size="xs"
              onClick={() => onRegenerate(question.id)}
            >
              <RefreshCw className="size-3" />
              Regenerate
            </Button>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
