import { useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { CheckCircle2, ChevronRight, FileText, Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import {
  removePendingMetadata,
  clearPendingMetadata,
} from "@/features/upload/store/upload.slice"

const CONTENT_TYPES = [
  { value: "VIDEO", label: "Video" },
  { value: "PDF", label: "PDF" },
  { value: "DOCUMENT", label: "Document" },
  { value: "IMAGE", label: "Image" },
] as const

interface FormState {
  [fileId: string]: {
    title: string
    description: string
    contentType: string
  }
}

export default function UploadMetadata() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { pendingMetadata } = useAppSelector((s) => s.upload)

  const [forms, setForms] = useState<FormState>(() => {
    const initial: FormState = {}
    pendingMetadata.forEach((item) => {
      initial[item.fileId] = {
        title: item.fileName.replace(/\.[^.]+$/, ""),
        description: "",
        contentType: "DOCUMENT",
      }
    })
    return initial
  })

  const [submitting, setSubmitting] = useState<Record<string, boolean>>({})

  const updateForm = useCallback(
    (fileId: string, field: string, value: string) => {
      setForms((prev) => ({
        ...prev,
        [fileId]: { ...prev[fileId], [field]: value },
      }))
    },
    []
  )

  const handleSubmit = useCallback(
    async (fileId: string) => {
      const form = forms[fileId]
      if (!form?.title?.trim()) return

      setSubmitting((prev) => ({ ...prev, [fileId]: true }))

      try {
        const res = await fetch("/api/v1/content/metadata", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            contentType: form.contentType,
            fileName: pendingMetadata.find((p) => p.fileId === fileId)?.fileName,
          }),
        })

        if (!res.ok) throw new Error("Failed to save metadata")

        dispatch(removePendingMetadata(fileId))
      } catch {
        // error handled inline
      } finally {
        setSubmitting((prev) => ({ ...prev, [fileId]: false }))
      }
    },
    [forms, pendingMetadata, dispatch]
  )

  const handleSubmitAll = useCallback(async () => {
    for (const item of pendingMetadata) {
      const form = forms[item.fileId]
      if (form?.title?.trim()) {
        await handleSubmit(item.fileId)
      }
    }
  }, [pendingMetadata, forms, handleSubmit])

  if (pendingMetadata.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
        </div>
        <h2 className="text-xl font-semibold">All up to date</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          No pending uploads. Files you upload will appear here so you can add
          titles, descriptions, and categorize them.
        </p>
        <Button variant="outline" onClick={() => navigate("/content")}>
          Back to Content
        </Button>
      </div>
    )
  }

  const allFilled = pendingMetadata.every(
    (item) => forms[item.fileId]?.title?.trim()
  )
  const allSubmitted = pendingMetadata.length === 0

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 md:p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Complete Upload{pendingMetadata.length > 1 ? "s" : ""}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {pendingMetadata.length} file{pendingMetadata.length > 1 ? "s" : ""}{" "}
            need{pendingMetadata.length === 1 ? "s" : ""} metadata
          </p>
        </div>
        <Button
          className="gap-2"
          size="lg"
          disabled={!allFilled}
          onClick={handleSubmitAll}
        >
          <Save className="h-4 w-4" />
          Save All
        </Button>
      </div>

      <ScrollArea className="max-h-[calc(100vh-220px)]">
        <div className="space-y-4">
          {pendingMetadata.map((item) => {
            const form = forms[item.fileId]
            const isPending = submitting[item.fileId]

            return (
              <Card key={item.fileId}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{item.fileName}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`title-${item.fileId}`}>Title *</Label>
                    <Input
                      id={`title-${item.fileId}`}
                      value={form?.title ?? ""}
                      onChange={(e) =>
                        updateForm(item.fileId, "title", e.target.value)
                      }
                      placeholder="Enter a title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`desc-${item.fileId}`}>Description</Label>
                    <Textarea
                      id={`desc-${item.fileId}`}
                      value={form?.description ?? ""}
                      onChange={(e) =>
                        updateForm(
                          item.fileId,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Optional description"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`type-${item.fileId}`}>Content Type</Label>
                    <Select
                      value={form?.contentType ?? "DOCUMENT"}
                      onValueChange={(v) =>
                        updateForm(item.fileId, "contentType", v)
                      }
                    >
                      <SelectTrigger id={`type-${item.fileId}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CONTENT_TYPES.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => dispatch(removePendingMetadata(item.fileId))}
                    >
                      Skip
                    </Button>
                    <Button
                      size="sm"
                      className="gap-1.5"
                      disabled={!form?.title?.trim() || isPending}
                      onClick={() => handleSubmit(item.fileId)}
                    >
                      {isPending ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5" />
                      )}
                      {isPending ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
