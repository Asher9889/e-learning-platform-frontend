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
  CloudUpload,
  AlertCircle
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
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

// interface FileWithPreview extends File {
//   id: string
//   status?: "idle" | "uploading" | "done" | "error"
//   progress?: number
// }
interface UploadFile {
  id: string;
  file: File;

  status: "idle" | "uploading" | "done" | "error";
  progress: number;
}


export function UploadContentDialog({ open, onOpenChange }: UploadContentDialogProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [_, setDragCounter] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate unique ID for files
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

  // ─── Drag & Drop Handlers ──────────────────────────────────────
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

  const handleUpload = useCallback(() => {
    files.forEach((file) => {
      getUppy().addFile({
        name: file.file.name,
        type: file.file.type,
        data: file.file,
      })
    })
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
      <DialogContent className=" p-0 gap-0 overflow-hidden border-0 bg-white/95 backdrop-blur-xl shadow-2xl dark:bg-zinc-950/95">

        {/* ─── Header ───────────────────────────────────────────── */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/25">
              <CloudUpload className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold tracking-tight">
                Upload Content
              </DialogTitle>
              <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                Drag & drop files or click to browse
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-5 space-y-5">

          {/* ─── Dropzone ───────────────────────────────────────── */}
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 ease-out",
              "flex flex-col items-center justify-center gap-3 py-10 px-6",
              isDragging
                ? "border-violet-500 bg-violet-50/80 scale-[1.02] shadow-lg shadow-violet-500/10 dark:bg-violet-950/20"
                : "border-zinc-200 bg-zinc-50/50 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/30 dark:hover:border-zinc-700"
            )}
          >
            <input
              ref={inputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileInputChange}
            />

            {/* Animated Icon */}
            <motion.div
              animate={isDragging ? { y: [0, -8, 0], scale: [1, 1.1, 1] } : {}}
              transition={{ repeat: isDragging ? Infinity : 0, duration: 1.2 }}
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-2xl transition-colors duration-300",
                isDragging
                  ? "bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400"
                  : "bg-zinc-100 text-zinc-400 group-hover:bg-zinc-200 group-hover:text-zinc-600 dark:bg-zinc-800 dark:text-zinc-500 dark:group-hover:bg-zinc-700"
              )}
            >
              <Upload className="h-7 w-7" />
            </motion.div>

            <div className="text-center space-y-1">
              <p className={cn(
                "text-sm font-medium transition-colors",
                isDragging ? "text-violet-600 dark:text-violet-400" : "text-zinc-700 dark:text-zinc-300"
              )}>
                {isDragging ? "Drop files here" : "Drag & drop files here"}
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                or click to browse — up to 2 GB per file
              </p>
            </div>

            {/* Drag Overlay */}
            <AnimatePresence>
              {isDragging && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 rounded-2xl bg-violet-500/5 backdrop-blur-[1px]"
                />
              )}
            </AnimatePresence>
          </div>

          {/* ─── File List ────────────────────────────────────────── */}
          <AnimatePresence mode="popLayout">
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="max-w-full rounded-xl border border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/30 overflow-hidden">

                  {/* List Header */}
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-800/50">
                    <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                      {files.length} file{files.length > 1 ? "s" : ""} selected
                    </span>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500">
                      {formatFileSize(totalSize)} total
                    </span>
                  </div>

                  {/* Files */}
                  <ul className="max-h-50 overflow-y-auto py-1">
                    <AnimatePresence initial={false}>
                      {files.map((file) => (
                        <motion.li
                          key={file.id}
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                          transition={{ duration: 0.2 }}
                          className="group flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/50 transition-colors"
                        >
                          {/* File Icon */}
                          <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-zinc-200 shadow-sm dark:bg-zinc-800 dark:border-zinc-700">
                            {getFileIcon(file.file.name, file.file.type, "h-4 w-4 text-zinc-500 dark:text-zinc-400")}
                          </div>

                          {/* File Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 break-all">
                              {file.file.name}
                            </p>
                            <p className="text-xs text-zinc-400 dark:text-zinc-500">
                              {formatFileSize(file.file.size)}
                            </p>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveFile(file.id)
                            }}
                            className="shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30 dark:hover:text-red-400 text-zinc-400"
                            aria-label={`Remove ${file.file.name}`}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── Empty State Hint ───────────────────────────────── */}
          {files.length === 0 && !isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-2 text-xs text-zinc-400 dark:text-zinc-600"
            >
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Supported formats: Images, Videos, Documents, Archives</span>
            </motion.div>
          )}
        </div>

        {/* ─── Footer ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/20">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            Cancel
          </Button>

          <Button
            size="sm"
            disabled={files.length === 0}
            onClick={handleUpload}
            className={cn(
              "gap-2 px-5 transition-all duration-300",
              files.length > 0
                ? "bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg shadow-zinc-900/20 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                : "bg-zinc-200 text-zinc-400 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-600"
            )}
          >
            <Upload className="h-4 w-4" />
            Upload {files.length > 0 && `(${files.length})`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}