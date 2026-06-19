import { FileQuestion, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UnsupportedPreviewProps {
  fileName: string
  mimeType: string
  fileUrl?: string
}

export function UnsupportedPreview({ fileName, mimeType, fileUrl }: UnsupportedPreviewProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
        <FileQuestion className="h-10 w-10 text-muted-foreground/60" />
      </div>
      <div className="space-y-1">
        <p className="text-base font-semibold">Preview not available</p>
        <p className="text-sm text-muted-foreground">
          Your browser cannot preview <span className="font-medium text-foreground">{mimeType}</span> files natively.
        </p>
        <p className="text-xs text-muted-foreground">{fileName}</p>
      </div>
      {fileUrl && (
        <Button variant="outline" className="gap-2" asChild>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" download>
            <Download className="h-4 w-4" />
            Download file
          </a>
        </Button>
      )}
    </div>
  )
}
