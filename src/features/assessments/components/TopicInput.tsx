import { useState, useRef, type KeyboardEvent } from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface TopicInputProps {
  value: string[]
  onChange: (value: string[]) => void
  error?: string
}

export default function TopicInput({ value, onChange, error }: TopicInputProps) {
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const addTopic = (raw: string) => {
    const trimmed = raw.trim()
    if (!trimmed) return
    if (value.includes(trimmed)) return
    onChange([...value, trimmed])
  }

  const removeTopic = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTopic(input)
      setInput("")
      return
    }

    if (e.key === "Backspace" && input === "" && value.length > 0) {
      removeTopic(value.length - 1)
    }
  }

  const handleChange = (val: string) => {
    const lastComma = val.lastIndexOf(",")
    if (lastComma !== -1) {
      const before = val.slice(0, lastComma)
      const after = val.slice(lastComma + 1)
      addTopic(before)
      setInput(after)
    } else {
      setInput(val)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text")
    if (text.includes(",")) {
      e.preventDefault()
      const parts = text.split(",").map((s) => s.trim()).filter(Boolean)
      const merged = [...value]
      for (const part of parts) {
        if (!merged.includes(part)) merged.push(part)
      }
      onChange(merged)
    }
  }

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "flex min-h-10 flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent px-2.5 py-1.5 text-sm shadow-xs transition-[color,box-shadow]",
          "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
          error && "border-destructive focus-within:border-destructive focus-within:ring-destructive/20"
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((topic, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 rounded-md bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
          >
            {topic}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTopic(i) }}
              className="inline-flex cursor-pointer items-center justify-center rounded-sm transition-colors hover:bg-indigo-200 dark:hover:bg-indigo-800"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={value.length === 0 ? "Type a topic and press comma or enter" : ""}
          className="min-w-30 flex-1 border-0 bg-transparent p-0 text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      {error && <p className="text-xs text-destructive-foreground text-red-500">{error}</p>}
    </div>
  )
}
