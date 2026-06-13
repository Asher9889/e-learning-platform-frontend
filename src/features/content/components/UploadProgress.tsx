interface UploadProgressProps {
  totalProgress: number
  uploadingCount: number
}

export function UploadProgress({ totalProgress, uploadingCount }: UploadProgressProps) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium">
          Uploading {uploadingCount} file{uploadingCount > 1 ? "s" : ""}
        </span>
        <span className="text-sm tabular-nums text-muted-foreground">
          {totalProgress}%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${totalProgress}%` }}
        />
      </div>
    </div>
  )
}
