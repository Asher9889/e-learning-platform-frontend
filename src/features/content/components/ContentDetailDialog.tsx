import { useState, useRef, useCallback } from "react"
import {
  Upload,
  X,
  ImageIcon,
  FileVideo,
  FileText,
  Book,
  Type,
  AlignLeft,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type ContentType = "VIDEO" | "PDF" | "DOCUMENT" | "IMAGE"

interface ContentDetailData {
  id: string
  title: string
  description?: string
  subject: string
  type: ContentType
  coverUrl?: string
}

interface ContentDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: ContentDetailData
  onSave?: (data: ContentDetailData) => void
}

const TYPE_OPTIONS = [
  { value: "VIDEO", label: "Video", icon: FileVideo },
  { value: "PDF", label: "PDF", icon: FileText },
  { value: "DOCUMENT", label: "Document", icon: Book },
  { value: "IMAGE", label: "Image", icon: ImageIcon },
]

export function ContentDetailDialog({ open, onOpenChange, item, onSave }: ContentDetailDialogProps) {
  const isEdit = !!item
  const [title, setTitle] = useState(item?.title ?? "")
  const [description, setDescription] = useState(item?.description ?? "")
  const [subject, setSubject] = useState(item?.subject ?? "")
  const [type, setType] = useState<ContentType>(item?.type ?? "PDF")
  const [coverPreview, setCoverPreview] = useState<string | null>(item?.coverUrl ?? null)
  const [isDragging, setIsDragging] = useState(false)
  const dragCounterRef = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleReset = useCallback(() => {
    setTitle(item?.title ?? "")
    setDescription(item?.description ?? "")
    setSubject(item?.subject ?? "")
    setType(item?.type ?? "PDF")
    setCoverPreview(item?.coverUrl ?? null)
    setIsDragging(false)
    dragCounterRef.current = 0
  }, [item])

  const handleClose = useCallback(() => {
    handleReset()
    onOpenChange(false)
  }, [handleReset, onOpenChange])

  const handleSave = useCallback(() => {
    if (!title.trim()) return
    onSave?.({
      id: item?.id ?? crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      subject: subject.trim(),
      type,
      coverUrl: coverPreview ?? undefined,
    })
    handleClose()
  }, [title, description, subject, type, coverPreview, item?.id, onSave, handleClose])

  const handleFileSelect = useCallback((file: File | null) => {
    if (!file) return
    if (!file.type.startsWith("image/")) return
    const reader = new FileReader()
    reader.onload = (e) => setCoverPreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }, [])

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current += 1
    if (dragCounterRef.current > 0) setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current -= 1
    if (dragCounterRef.current <= 0) {
      setIsDragging(false)
      dragCounterRef.current = 0
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    dragCounterRef.current = 0
    handleFileSelect(e.dataTransfer.files[0])
  }, [handleFileSelect])

  const handleRemoveCover = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setCoverPreview(null)
  }, [])

  const hasChanges = title.trim() !== (item?.title ?? "")
    || description.trim() !== (item?.description ?? "")
    || subject.trim() !== (item?.subject ?? "")
    || type !== (item?.type ?? "PDF")
    || coverPreview !== (item?.coverUrl ?? null)

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-0">
          <div className="flex items-center gap-3 pr-8">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl",
              isEdit ? "bg-primary" : "bg-muted"
            )}>
              {isEdit
                ? <Type className="h-5 w-5 text-primary-foreground" />
                : <Upload className="h-5 w-5 text-muted-foreground" />
              }
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold tracking-tight">
                {isEdit ? "Edit Content" : "New Content"}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                {isEdit ? "Update the details of this content item." : "Fill in the details for your content."}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-5 space-y-5">
          {/* Cover image */}
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => !coverPreview && inputRef.current?.click()}
            className={cn(
              "relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 overflow-hidden",
              "flex flex-col items-center justify-center",
              coverPreview ? "p-0" : "py-10 px-6",
              isDragging
                ? "border-primary bg-primary/5"
                : coverPreview
                  ? "border-transparent"
                  : "border-border hover:border-muted-foreground/40 hover:bg-muted/30"
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
            />

            {coverPreview ? (
              <>
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className="h-48 w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-2 shadow-sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      inputRef.current?.click()
                    }}
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Change cover
                  </Button>
                </div>
                <button
                  onClick={handleRemoveCover}
                  className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white opacity-0 hover:opacity-100 transition-opacity"
                  aria-label="Remove cover image"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </>
            ) : (
              <>
                <div className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-2xl transition-colors duration-200",
                  isDragging ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                )}>
                  <ImageIcon className="h-6 w-6" />
                </div>
                <div className="text-center space-y-1 mt-3">
                  <p className={cn(
                    "text-sm font-medium transition-colors",
                    isDragging ? "text-primary" : "text-foreground"
                  )}>
                    {isDragging ? "Drop image here" : "Upload cover image"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Drag & drop or click to browse
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
              <Type className="h-3.5 w-3.5 text-muted-foreground" />
              Title
            </label>
            <Input
              placeholder="Enter content title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
              <AlignLeft className="h-3.5 w-3.5 text-muted-foreground" />
              Description
            </label>
            <Textarea
              placeholder="Brief description of the content"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-none"
            />
            <p className="text-[11px] text-muted-foreground text-right">{description.length}/300</p>
          </div>

          {/* Subject + Type row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Subject</label>
              <Input
                placeholder="e.g. Chemistry"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Content Type</label>
              <Select value={type} onValueChange={(v) => setType(v as ContentType)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <span className="flex items-center gap-2">
                        <opt.icon className="h-3.5 w-3.5 text-muted-foreground" />
                        {opt.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-muted/20">
          <Button variant="ghost" size="sm" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={!title.trim() || (isEdit && !hasChanges)}
            onClick={handleSave}
            className="gap-2"
          >
            {isEdit ? "Save Changes" : "Create Content"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
