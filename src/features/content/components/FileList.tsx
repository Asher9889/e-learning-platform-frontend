import type { UploadFile } from "../types/content.types"
import { FileItem } from "./FileItem"

interface FileListProps {
  files: UploadFile[]
  onRemove: (id: string) => void
  onPauseResume: (id: string) => void
  totalProgress: number
  isUploading: boolean
}

export function FileList({
  files,
  onRemove,
  onPauseResume,
  totalProgress,
  isUploading,
}: FileListProps) {
  if (files.length === 0) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">
          {files.length} file{files.length > 1 ? "s" : ""}
        </p>
        {isUploading && (
          <p className="text-xs text-muted-foreground">{totalProgress}% overall</p>
        )}
      </div>

      <div className="space-y-2">
        {files.map((file) => (
          <FileItem
            key={file.id}
            file={file}
            onRemove={onRemove}
            onPauseResume={onPauseResume}
          />
        ))}
      </div>
    </div>
  )
}
