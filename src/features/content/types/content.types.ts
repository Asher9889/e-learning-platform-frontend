import { FileVideo, FileText, FileImage, File, type LucideIcon } from "lucide-react"
import { FILE_CATEGORY } from "../constants/content.constants"

export interface UploadFile {
  id: string
  name: string
  type: string
  size: number
  progress: number
  speed: number
  eta: number
  status: "waiting" | "uploading" | "paused" | "done" | "error"
  error?: string
}

export type ContentTypeValue = (typeof FILE_CATEGORY)[keyof typeof FILE_CATEGORY]

export const FILE_TYPE_ICONS: Record<string, LucideIcon> = {
  [FILE_CATEGORY.VIDEO]: FileVideo,
  [FILE_CATEGORY.PDF]: FileText,
  [FILE_CATEGORY.DOCUMENT]: FileText,
  [FILE_CATEGORY.IMAGE]: FileImage,
  [FILE_CATEGORY.AUDIO]: File,
  OTHER: File,
}

export const TYPE_COLORS: Record<string, string> = {
  [FILE_CATEGORY.VIDEO]: "text-muted-foreground bg-muted",
  [FILE_CATEGORY.PDF]: "text-muted-foreground bg-muted",
  [FILE_CATEGORY.DOCUMENT]: "text-muted-foreground bg-muted",
  [FILE_CATEGORY.IMAGE]: "text-muted-foreground bg-muted",
  [FILE_CATEGORY.AUDIO]: "text-muted-foreground bg-muted",
  OTHER: "text-muted-foreground bg-muted",
}

export function formatSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function formatSpeed(bytesPerSecond: number): string {
  return `${formatSize(bytesPerSecond)}/s`
}

export function formatTime(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  return `${m}m ${s}s`
}
