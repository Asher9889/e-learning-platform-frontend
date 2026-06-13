import {
  FileVideo,
  FileText,
  FileImage,
  FileAudio,
  FileSpreadsheet,
  File,
  Clock,
  PauseCircle,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  XCircle,
  X,
  Trash2,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import type { UploadItem as UploadItemType } from "../types/upload.types"

const FILE_ICONS: Record<string, LucideIcon> = {
  mp4: FileVideo,
  mov: FileVideo,
  avi: FileVideo,
  mkv: FileVideo,
  webm: FileVideo,
  pdf: FileText,
  doc: FileText,
  docx: FileText,
  xls: FileSpreadsheet,
  xlsx: FileSpreadsheet,
  csv: FileSpreadsheet,
  jpg: FileImage,
  jpeg: FileImage,
  png: FileImage,
  gif: FileImage,
  webp: FileImage,
  mp3: FileAudio,
  wav: FileAudio,
  ogg: FileAudio,
  zip: File,
  rar: File,
  gz: File,
}

const STATUS_ICONS: Record<string, LucideIcon> = {
  QUEUED: Clock,
  UPLOADING: RefreshCw,
  PAUSED: PauseCircle,
  PROCESSING: RefreshCw,
  COMPLETED: CheckCircle2,
  FAILED: AlertCircle,
  CANCELED: XCircle,
}

const STATUS_COLORS: Record<string, string> = {
  QUEUED: "text-muted-foreground",
  UPLOADING: "text-blue-500",
  PAUSED: "text-amber-500",
  PROCESSING: "text-purple-500",
  COMPLETED: "text-emerald-500",
  FAILED: "text-destructive",
  CANCELED: "text-muted-foreground",
}

function getFileIcon(fileName: string): LucideIcon {
  const ext = fileName.split(".").pop()?.toLowerCase()
  return (ext && FILE_ICONS[ext]) || File
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

function formatSpeed(bytesPerSecond: number): string {
  return `${formatBytes(bytesPerSecond)}/s`
}

function formatEta(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  return `${m}m ${s}s`
}

interface UploadItemProps {
  item: UploadItemType
  onPause: (id: string) => void
  onResume: (id: string) => void
  onCancel: (id: string) => void
  onRetry: (id: string) => void
  onRemove: (id: string) => void
}

export function UploadItem({
  item,
  onPause,
  onResume,
  onCancel,
  onRetry,
  onRemove,
}: UploadItemProps) {
  const FileIcon = getFileIcon(item.fileName)
  const StatusIcon = STATUS_ICONS[item.status]
  const statusColor = STATUS_COLORS[item.status]
  const isSpinning = item.status === "UPLOADING" || item.status === "PROCESSING"

  return (
    <div
      role="listitem"
      aria-label={`Upload: ${item.fileName}`}
      className={cn(
        "rounded-lg border p-3 transition-colors",
        item.status === "FAILED" && "border-destructive/30 bg-destructive/5",
        item.status === "COMPLETED" && "border-emerald-500/30 bg-emerald-500/5"
      )}
    >
      <div className="flex items-start gap-3">
        {/* File icon */}
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
            "bg-muted text-muted-foreground"
          )}
        >
          <FileIcon className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          {/* File name + status */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{item.fileName}</p>
              <span
                className={cn(
                  "mt-0.5 inline-flex items-center gap-1 text-xs",
                  statusColor
                )}
              >
                <StatusIcon
                  className={cn("h-3 w-3", isSpinning && "animate-spin")}
                />
                {item.status === "PROCESSING"
                  ? "Processing..."
                  : item.status.charAt(0) + item.status.slice(1).toLowerCase()}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex shrink-0 items-center gap-0.5">
              {item.status === "UPLOADING" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onPause(item.id)}
                  aria-label="Pause upload"
                >
                  <PauseCircle className="h-3.5 w-3.5" />
                </Button>
              )}
              {item.status === "PAUSED" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onResume(item.id)}
                  aria-label="Resume upload"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </Button>
              )}
              {(item.status === "QUEUED" || item.status === "UPLOADING" || item.status === "PAUSED") && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => onCancel(item.id)}
                  aria-label="Cancel upload"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
              {item.status === "FAILED" && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onRetry(item.id)}
                    aria-label="Retry upload"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => onRemove(item.id)}
                    aria-label="Remove upload"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </>
              )}
              {(item.status === "COMPLETED" || item.status === "CANCELED") && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  onClick={() => onRemove(item.id)}
                  aria-label="Dismiss"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-2 space-y-1">
            <Progress
              value={item.progress}
              className={cn(
                "h-1.5",
                item.status === "FAILED" && "[&>[data-slot=progress-bar]]:bg-destructive",
                item.status === "COMPLETED" && "[&>[data-slot=progress-bar]]:bg-emerald-500"
              )}
            />

            {/* Stats row */}
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>{item.progress}%</span>
                <span>
                  {formatBytes(item.uploadedBytes)} / {formatBytes(item.fileSize)}
                </span>
              </div>
              {item.status === "UPLOADING" && item.speed !== undefined && (
                <div className="flex items-center gap-2">
                  {item.speed > 0 && <span>{formatSpeed(item.speed)}</span>}
                  {item.eta !== undefined && item.eta > 0 && (
                    <span>{formatEta(item.eta)} remaining</span>
                  )}
                </div>
              )}
            </div>

            {/* Error message */}
            {item.status === "FAILED" && item.error && (
              <p className="text-[11px] text-destructive">{item.error}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
