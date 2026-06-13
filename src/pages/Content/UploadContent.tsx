import { useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ContentUploadForm } from "@/features/content/components/ContentUploadForm"
import { UploadDropzone } from "@/features/content/components/UploadDropzone"
import { getUppy } from "@/features/upload/services/upload-engine"
import {
  contentUploadFormSchema,
  type ContentUploadFormData,
} from "@/features/content/schema/content.schema"

export default function UploadContentPage() {
  const navigate = useNavigate()
  const form = useForm<ContentUploadFormData>({
    resolver: zodResolver(contentUploadFormSchema),
    defaultValues: {
      title: "",
      description: "",
      contentType: "",
    },
  })

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setSelectedFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)])
  }, [])

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? [])
      if (files.length > 0) {
        setSelectedFiles((prev) => [...prev, ...files])
      }
      e.target.value = ""
    },
    []
  )

  const handleRemoveFile = useCallback(
    (fileName: string) => {
      setSelectedFiles((prev) => prev.filter((f) => f.name !== fileName))
    },
    []
  )

  const handleUpload = useCallback(() => {
    form.handleSubmit((data) => {
      selectedFiles.forEach((file) => {
        getUppy().addFile({
          name: file.name,
          type: file.type,
          data: file,
          meta: {
            title: data.title,
            description: data.description ?? "",
            contentType: data.contentType,
          },
        })
      })
      setSelectedFiles([])
      form.reset()
      navigate("/content")
    })()
  }, [form, selectedFiles, navigate])

  return (
    <div className="max-w-3xl space-y-8 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Upload Content</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add new learning materials to your content library.
        </p>
      </div>

      <div className="space-y-6">
        <ContentUploadForm form={form} />

        <div className="space-y-2">
          <p className="text-sm font-medium leading-none">File</p>
          <UploadDropzone
            onDrop={handleDrop}
            onFileInputChange={handleFileInputChange}
          />
        </div>

        {selectedFiles.length > 0 && (
          <div className="rounded-lg border p-3">
            <p className="mb-2 text-sm font-medium">
              {selectedFiles.length} file
              {selectedFiles.length > 1 ? "s" : ""} selected
            </p>
            <ul className="space-y-1">
              {selectedFiles.map((file) => (
                <li
                  key={file.name + file.size}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="truncate">{file.name}</span>
                  <button
                    onClick={() => handleRemoveFile(file.name)}
                    className="ml-2 text-xs text-muted-foreground hover:text-destructive"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <Button
            size="lg"
            className="min-w-[140px] gap-2"
            disabled={selectedFiles.length === 0}
            onClick={handleUpload}
          >
            <Upload className="h-4 w-4" />
            Upload to Library
          </Button>
          <Button
            size="lg"
            variant="ghost"
            onClick={() => navigate("/content")}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
