import { useState, useCallback, useRef } from "react"
import { Upload } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadDropzoneProps {
  onDrop: (e: React.DragEvent) => void
  onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function UploadDropzone({ onDrop, onFileInputChange }: UploadDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false)
  }, [])

  const handleClick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={(e) => {
        setIsDragOver(false)
        onDrop(e)
      }}
      onClick={handleClick}
      className={cn(
        "relative cursor-pointer rounded-xl border-2 border-dashed p-12 transition-all duration-200",
        isDragOver
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-muted-foreground/40 hover:bg-muted/30"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={onFileInputChange}
      />
      <div className="flex flex-col items-center gap-3 text-center">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
            isDragOver ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
          )}
        >
          <Upload className={cn("h-6 w-6 transition-transform", isDragOver && "scale-110")} />
        </div>
        <div>
          <p className="text-sm font-medium">
            {isDragOver ? "Drop files here" : "Drag & drop files here"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            or click to browse — up to 2 GB per file
          </p>
        </div>
      </div>
    </div>
  )
}
