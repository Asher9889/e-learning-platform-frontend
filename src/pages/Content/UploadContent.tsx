import { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Upload, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useContentUpload } from "@/features/content/hooks/useContentUpload"
import { ContentUploadForm } from "@/features/content/components/ContentUploadForm"
import { UploadDropzone } from "@/features/content/components/UploadDropzone"
import { FileList } from "@/features/content/components/FileList"
import { UploadProgress } from "@/features/content/components/UploadProgress"
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

  const {
    files,
    totalProgress,
    hasFiles,
    allDone,
    hasError,
    isUploading,
    handleDrop,
    handleFileInputChange,
    handleRemoveFile,
    handleUpload,
    handlePauseResume,
  } = useContentUpload()

  const uploadingCount = files.filter((f) => f.status === "uploading").length

  const onUpload = useCallback(() => {
    form.handleSubmit(() => {
      handleUpload()
    })()
  }, [form, handleUpload])

  return (
    <div className="max-w-3xl space-y-8 p-4 md:p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Upload Content</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add new learning materials to your content library.
        </p>
      </div>

      <div className="space-y-6">
        <ContentUploadForm form={form} />

        {/* Drop Zone */}
        <div className="space-y-2">
          <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            File
          </p>
          <UploadDropzone
            onDrop={handleDrop}
            onFileInputChange={handleFileInputChange}
          />
        </div>

        {/* File List */}
        <FileList
          files={files}
          onRemove={handleRemoveFile}
          onPauseResume={handlePauseResume}
          totalProgress={totalProgress}
          isUploading={isUploading}
        />

        {/* Overall Progress Bar */}
        {isUploading && (
          <UploadProgress
            totalProgress={totalProgress}
            uploadingCount={uploadingCount}
          />
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          {!allDone ? (
            <Button
              size="lg"
              className="min-w-[140px] gap-2"
              disabled={!hasFiles || isUploading || hasError}
              onClick={onUpload}
            >
              {isUploading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload
                </>
              )}
            </Button>
          ) : (
            <Button
              size="lg"
              variant="default"
              className="min-w-[140px] gap-2"
              onClick={() => navigate("/content")}
            >
              <CheckCircle2 className="h-4 w-4" />
              Back to Library
            </Button>
          )}
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
