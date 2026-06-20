import { useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { CheckCircle2, FileText, Loader2, Save, Send, XCircle } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import {
  removePendingMetadata,
} from "@/features/upload/store/upload.slice"
import { useUpdateMaterial, usePublishMaterial } from "@/features/content/hooks/useContentMutations"
import { MATERIAL_TYPES, MATERIAL_STATUS } from "@/constants/material/material.constant"

interface FormState {
  [materialId: string]: {
    title: string
    description: string
    contentType: string
  }
}

export default function UploadMetadata() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { pendingMetadata } = useAppSelector((s) => s.upload)

  const { mutateAsync: updateMaterial } = useUpdateMaterial()
  const { mutateAsync: publishMaterial } = usePublishMaterial()

  const [forms, setForms] = useState<FormState>(() => {
    const initial: FormState = {}
    pendingMetadata.forEach((item) => {
      initial[item.materialId] = {
        title: item.title || item.fileName.replace(/\.[^.]+$/, ""),
        description: item.description || "",
        contentType: item.materialType || "DOCUMENT",
      }
    })
    return initial
  })

  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [publishing, setPublishing] = useState<Record<string, boolean>>({})

  const updateForm = useCallback(
    (materialId: string, field: string, value: string) => {
      setForms((prev) => ({
        ...prev,
        [materialId]: { ...prev[materialId], [field]: value },
      }))
    },
    []
  )

  const handleSaveDraft = useCallback(
    async (materialId: string) => {
      const form = forms[materialId]
      if (!form?.title?.trim()) return

      setSaving((prev) => ({ ...prev, [materialId]: true }))
      try {
        await updateMaterial({
          id: materialId,
          data: {
            title: form.title,
            description: form.description || undefined,
            materialType: form.contentType as any,
          },
        })
        dispatch(removePendingMetadata(
          pendingMetadata.find((p) => p.materialId === materialId)?.fileId ?? ""
        ))
      } finally {
        setSaving((prev) => ({ ...prev, [materialId]: false }))
      }
    },
    [forms, updateMaterial, dispatch, pendingMetadata]
  )

  const handlePublish = useCallback(
    async (materialId: string) => {
      const form = forms[materialId]
      if (!form?.title?.trim()) return

      setPublishing((prev) => ({ ...prev, [materialId]: true }))
      try {
        await updateMaterial({
          id: materialId,
          data: {
            title: form.title,
            description: form.description || undefined,
            materialType: form.contentType as any,
          },
        })
        await publishMaterial(materialId)
        dispatch(removePendingMetadata(
          pendingMetadata.find((p) => p.materialId === materialId)?.fileId ?? ""
        ))
      } finally {
        setPublishing((prev) => ({ ...prev, [materialId]: false }))
      }
    },
    [forms, updateMaterial, publishMaterial, dispatch, pendingMetadata]
  )

  const handleSaveAll = useCallback(async () => {
    for (const item of pendingMetadata) {
      const form = forms[item.materialId]
      if (form?.title?.trim()) {
        await handleSaveDraft(item.materialId)
      }
    }
  }, [pendingMetadata, forms, handleSaveDraft])

  const handlePublishAll = useCallback(async () => {
    for (const item of pendingMetadata) {
      const form = forms[item.materialId]
      if (form?.title?.trim()) {
        await handlePublish(item.materialId)
      }
    }
  }, [pendingMetadata, forms, handlePublish])

  if (pendingMetadata.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
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
    (item) => forms[item.materialId]?.title?.trim()
  )

  const draftItems = pendingMetadata.filter((item) => item.status === MATERIAL_STATUS.DRAFT)
  // const publishedItems = pendingMetadata.filter((item) => item.status === MATERIAL_STATUS.PUBLISHED)

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 md:p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Complete Upload{pendingMetadata.length > 1 ? "s" : ""}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {pendingMetadata.length} file{pendingMetadata.length > 1 ? "s" : ""}{" "}
            need{pendingMetadata.length === 1 ? "s" : ""} attention
          </p>
        </div>
        <div className="flex gap-2">
          {draftItems.length > 0 && (
            <Button
              variant="outline"
              className="gap-2"
              size="lg"
              disabled={!allFilled}
              onClick={handleSaveAll}
            >
              <Save className="h-4 w-4" />
              Save All Drafts
            </Button>
          )}
          {draftItems.length > 0 && (
            <Button
              className="gap-2"
              size="lg"
              disabled={!allFilled}
              onClick={handlePublishAll}
            >
              <Send className="h-4 w-4" />
              Publish All
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="max-h-[calc(100vh-220px)]">
        <div className="space-y-4">
          {pendingMetadata.map((item) => {
            const form = forms[item.materialId]
            const isPending = saving[item.materialId] || publishing[item.materialId]
            const isDraft = item.status === MATERIAL_STATUS.DRAFT

            return (
              <Card key={item.fileId}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{item.fileName}</span>
                    <Badge variant={isDraft ? "secondary" : "default"}>
                      {isDraft ? "Draft" : "Published"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`title-${item.materialId}`}>Title *</Label>
                    <Input
                      id={`title-${item.materialId}`}
                      value={form?.title ?? ""}
                      onChange={(e) =>
                        updateForm(item.materialId, "title", e.target.value)
                      }
                      placeholder="Enter a title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`desc-${item.materialId}`}>Description</Label>
                    <Textarea
                      id={`desc-${item.materialId}`}
                      value={form?.description ?? ""}
                      onChange={(e) =>
                        updateForm(
                          item.materialId,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Optional description"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`type-${item.materialId}`}>Content Type</Label>
                    <Select
                      value={form?.contentType ?? "DOCUMENT"}
                      onValueChange={(v) =>
                        updateForm(item.materialId, "contentType", v)
                      }
                    >
                      <SelectTrigger id={`type-${item.materialId}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MATERIAL_TYPES.map((t) => (
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
                      <XCircle className="h-3.5 w-3.5 mr-1" />
                      Dismiss
                    </Button>
                    {isDraft && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5"
                          disabled={!form?.title?.trim() || isPending}
                          onClick={() => handleSaveDraft(item.materialId)}
                        >
                          {saving[item.materialId] ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Save className="h-3.5 w-3.5" />
                          )}
                          {saving[item.materialId] ? "Saving..." : "Save Draft"}
                        </Button>
                        <Button
                          size="sm"
                          className="gap-1.5"
                          disabled={!form?.title?.trim() || isPending}
                          onClick={() => handlePublish(item.materialId)}
                        >
                          {publishing[item.materialId] ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Send className="h-3.5 w-3.5" />
                          )}
                          {publishing[item.materialId] ? "Publishing..." : "Publish"}
                        </Button>
                      </>
                    )}
                    {!isDraft && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate("/content")}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        View in Library
                      </Button>
                    )}
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
