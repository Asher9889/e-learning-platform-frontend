import type { LucideIcon } from "lucide-react"

export type UploadStatus =
  | "QUEUED"
  | "UPLOADING"
  | "PAUSED"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELED"

export interface UploadItem {
  id: string
  fileName: string
  fileSize: number
  uploadedBytes: number
  progress: number
  speed?: number
  eta?: number
  status: UploadStatus
  error?: string
}

export interface FileIconMap {
  [key: string]: LucideIcon
}
