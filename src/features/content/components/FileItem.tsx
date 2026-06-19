import {
  X,
  AlertCircle,
  CheckCircle2,
  Clock,
  PauseCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  FILE_TYPE_ICONS,
  TYPE_COLORS,
  formatSize,
  formatSpeed,
  // formatTime,
} from "../types/content.types"
import type { UploadFile } from "../types/content.types"

interface FileItemProps {
  file: UploadFile
  onRemove: (id: string) => void
  onPauseResume: (id: string) => void
}

export function FileItem({ file, onRemove, onPauseResume }: FileItemProps) {
  const Icon = FILE_TYPE_ICONS[file.type] ?? FILE_TYPE_ICONS.OTHER
  const colorClass = TYPE_COLORS[file.type] ?? TYPE_COLORS.OTHER

  return (
    <div
      className={cn(
        "rounded-lg border p-3 transition-colors",
        file.status === "error" && "border-destructive/30 bg-destructive/5",
        file.status === "done" && "border-border bg-muted/50"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
            colorClass
          )}
        >
          <Icon />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              {file.status === "uploading" && (
                <button
                  onClick={() => onPauseResume(file.id)}
                  className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <PauseCircle className="h-4 w-4" />
                </button>
              )}
              {(file.status === "waiting" || file.status === "error") && (
                <button
                  onClick={() => onRemove(file.id)}
                  className="rounded p-1 text-muted-foreground transition-colors hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-300",
                    file.status === "error" && "bg-destructive",
                    file.status === "done" && "bg-primary",
                    file.status === "uploading" && "bg-primary",
                    file.status === "waiting" && "bg-muted-foreground/20"
                  )}
                  style={{ width: `${file.progress}%` }}
                />
              </div>
              <span className="w-10 text-right text-[11px] tabular-nums text-muted-foreground">
                {file.progress}%
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              {file.status === "uploading" && (
                <>
                  <span>{formatSpeed(file.speed || 0)}</span>
                  {/* {file.eta > 0 && <span>{formatTime(file.eta)} remaining</span>} */}
                </>
              )}
              {file.status === "waiting" && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Waiting
                </span>
              )}
              {file.status === "done" && (
                <span className="flex items-center gap-1 text-foreground">
                  <CheckCircle2 className="h-3 w-3" />
                  Uploaded
                </span>
              )}
              {file.status === "error" && (
                <span className="flex items-center gap-1 text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {file.error ?? "Upload failed"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
