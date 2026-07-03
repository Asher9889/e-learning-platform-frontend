import { RadioGroup as RadioGroupPrimitive } from "radix-ui"
import { ClipboardCheck, FileText, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { ASSESSMENT_TYPE } from "../constants/assesments.contants"
import type { AssessmentType } from "../types/assessment.types"

const typeConfig = [
  { value: ASSESSMENT_TYPE.QUIZ, label: "Quiz", description: "Short objective questions.", Icon: ClipboardCheck },
  { value: ASSESSMENT_TYPE.ASSIGNMENT, label: "Assignment", description: "Long-form descriptive questions.", Icon: FileText },
  { value: ASSESSMENT_TYPE.QUESTION_PAPER, label: "Question Paper", description: "Structured exam format.", Icon: BookOpen },
]

interface AssessmentTypeSelectorProps {
  value: AssessmentType | undefined
  onValueChange: (value: AssessmentType) => void
  error?: string
}

export default function AssessmentTypeSelector({
  value,
  onValueChange,
  error,
}: AssessmentTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Assessment Type</label>
      <RadioGroupPrimitive.Root
        value={value ?? ""}
        onValueChange={onValueChange}
        className="grid grid-cols-1 gap-3 md:grid-cols-3"
      >
        {typeConfig.map(({ value: val, label, description, Icon }) => (
          <RadioGroupPrimitive.Item
            key={val}
            value={val}
            className={cn(
              "group cursor-pointer rounded-xl border-2 px-3 py-3 text-left transition-all md:px-4 md:text-center",
              "hover:border-indigo-200 hover:bg-indigo-50/50",
              "data-[state=checked]:border-indigo-500 data-[state=checked]:bg-indigo-50",
              "data-[state=unchecked]:border-border data-[state=unchecked]:bg-card",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2",
              "dark:hover:border-indigo-700 dark:hover:bg-indigo-950/20",
              "dark:data-[state=checked]:border-indigo-400 dark:data-[state=checked]:bg-indigo-950/30"
            )}
          >
            <div className="flex items-start gap-3 md:flex-col md:items-center md:gap-2">
              <div className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                "bg-muted text-muted-foreground",
                "group-data-[state=checked]:bg-indigo-100 group-data-[state=checked]:text-indigo-600",
                "dark:group-data-[state=checked]:bg-indigo-900/40 dark:group-data-[state=checked]:text-indigo-300"
              )}>
                <Icon className="size-4" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-foreground">{label}</div>
                <div className="mt-0.5 text-xs text-muted-foreground md:mt-0">{description}</div>
              </div>
            </div>
          </RadioGroupPrimitive.Item>
        ))}
      </RadioGroupPrimitive.Root>
      {error && <p className="text-xs text-destructive-foreground">{error}</p>}
    </div>
  )
}
