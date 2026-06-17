import { useState, useCallback, useRef } from "react"
import {
  Upload,
  X,
  FileText,
  Image,
  Film,
  Music,
  Archive,
  File,
  AlertCircle,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getUppy } from "@/features/upload/services/upload-engine"
import { formatFileSize } from "@/utils/helper"
import { ScrollArea } from "#components/ui/scroll-area"


const EXT_ICONS: Record<string, React.ReactNode> = {
  png: <Image />, jpg: <Image />, jpeg: <Image />, gif: <Image />, webp: <Image />, svg: <Image />,
  mp4: <Film />, mov: <Film />, avi: <Film />, mkv: <Film />, webm: <Film />,
  mp3: <Music />, wav: <Music />, ogg: <Music />, flac: <Music />,
  zip: <Archive />, rar: <Archive />, gz: <Archive />, "7z": <Archive />, tar: <Archive />,
  pdf: <FileText />, doc: <FileText />, docx: <FileText />, txt: <FileText />,
}

function getFileIcon(fileName: string, type: string, className?: string) {
  const icon = iconForType(type, fileName)
  return icon ? <span className={className}>{icon}</span> : <File className={className} />
}

function iconForType(type: string, fileName: string): React.ReactNode {
  if (type) {
    if (type.startsWith("image/")) return <Image />
    if (type.startsWith("video/")) return <Film />
    if (type.startsWith("audio/")) return <Music />
    if (type.includes("zip") || type.includes("archive") || type.includes("compressed")) return <Archive />
    if (type.includes("pdf") || type.includes("document") || type.includes("text")) return <FileText />
  }
  const ext = fileName.split(".").pop()?.toLowerCase()
  return ext ? EXT_ICONS[ext] : null
}



interface UploadContentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface UploadFile {
  id: string;
  file: File;
  status: "idle" | "uploading" | "done" | "error";
  progress: number;
}


export function UploadContentDialog({ open, onOpenChange }: UploadContentDialogProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [, setDragCounter] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const addFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return
    const filesArray: UploadFile[] = Array.from(newFiles).map(
      (file) => ({
        id: generateId(),
        file,
        status: "idle",
        progress: 0,
      })
    );
    setFiles((prev) => [...prev, ...filesArray])
  }, [])

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter((prev) => {
      const next = prev + 1
      if (next > 0) setIsDragging(true)
      return next
    })
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter((prev) => {
      const next = prev - 1
      if (next <= 0) setIsDragging(false)
      return Math.max(0, next)
    })
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    setDragCounter(0)
    addFiles(e.dataTransfer.files)
  }, [addFiles])

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      addFiles(e.target.files)
      e.target.value = ""
    },
    [addFiles]
  )

  const handleRemoveFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }, [])

  const handleUpload = useCallback(async () => {
    const uppy = getUppy();
    files.forEach((file) => {
      uppy.addFile({
        name: file.file.name,
        type: file.file.type,
        data: file.file,
      })
    })

    await uppy.upload();

    setFiles([])
    onOpenChange(false)
  }, [files, onOpenChange])

  const handleClose = useCallback(() => {
    setFiles([])
    setIsDragging(false)
    setDragCounter(0)
    onOpenChange(false)
  }, [onOpenChange])

  const totalSize = files.reduce((acc, file) => acc + file.file.size, 0)

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Upload className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold tracking-tight">
                Upload Content
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-0.5">
                Drag & drop files or click to browse
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-5 space-y-5">

          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200",
              "flex flex-col items-center justify-center gap-3 py-10 px-6",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-muted-foreground/40 hover:bg-muted/30"
            )}
          >
            <input
              ref={inputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileInputChange}
            />

            <div
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-2xl transition-colors duration-200",
                isDragging
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <Upload className="h-6 w-6" />
            </div>

            <div className="text-center space-y-1">
              <p className={cn(
                "text-sm font-medium transition-colors",
                isDragging ? "text-primary" : "text-foreground"
              )}>
                {isDragging ? "Drop files here" : "Drag & drop files here"}
              </p>
              <p className="text-xs text-muted-foreground">
                or click to browse — up to 2 GB per file
              </p>
            </div>

            {isDragging && (
              <div className="absolute inset-0 rounded-xl bg-primary/[0.03]" />
            )}
          </div>

          {files.length > 0 && (
            <div className="overflow-hidden rounded-xl border">
              <div className="flex items-center justify-between px-4 py-2.5 border-b bg-muted/50">
                <span className="text-xs font-semibold text-muted-foreground">
                  {files.length} file{files.length > 1 ? "s" : ""} selected
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatFileSize(totalSize)} total
                </span>
              </div>

              <ul className="max-h-50 overflow-y-auto">
                {files.map((file) => (
                  <ScrollArea >
                    <li
                      key={file.id}
                      className="group flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30 transition-colors"
                    >
                      <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                        {getFileIcon(file.file.name, file.file.type, "h-4 w-4 text-muted-foreground")}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {file.file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.file.size)}
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveFile(file.id)
                        }}
                        className="shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive text-muted-foreground"
                        aria-label={`Remove ${file.file.name}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  </ScrollArea>
                ))}
              </ul>
            </div>
          )}

          {files.length === 0 && !isDragging && (
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Supported: Images, Videos, Documents, Archives</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/20">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
          >
            Cancel
          </Button>

          <Button
            size="sm"
            disabled={files.length === 0}
            onClick={handleUpload}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload{files.length > 0 ? ` (${files.length})` : ""}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
