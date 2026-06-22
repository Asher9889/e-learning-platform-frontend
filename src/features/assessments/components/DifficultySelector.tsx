import { ToggleGroup } from "radix-ui"
import { cn } from "@/lib/utils"
import type { Difficulty } from "../types/assessment.types"

const levels: { value: Difficulty; label: string }[] = [
  { value: "EASY", label: "Easy" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HARD", label: "Hard" },
  { value: "MIXED", label: "Mixed" },
]

interface DifficultySelectorProps {
  value: Difficulty
  onValueChange: (value: Difficulty) => void
}

export default function DifficultySelector({ value, onValueChange }: DifficultySelectorProps) {
  return (
    <div className="space-y-2">
      {/* <label className="text-sm font-medium">Difficulty</label> */}
      <ToggleGroup.Root
        type="single"
        value={value}
        onValueChange={(v) => { if (v) onValueChange(v as Difficulty) }}
        className="inline-flex rounded-lg border border-border bg-muted/50 p-0.5"
      >
        {levels.map(({ value: val, label }) => (
          <ToggleGroup.Item
            key={val}
            value={val}
            className={cn(
              "cursor-pointer rounded-md px-4 py-1.5 text-sm font-medium transition-all",
              "text-muted-foreground hover:text-foreground",
              "data-[state=on]:bg-card data-[state=on]:text-foreground data-[state=on]:shadow-sm",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-1"
            )}
          >
            {label}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
    </div>
  )
}
