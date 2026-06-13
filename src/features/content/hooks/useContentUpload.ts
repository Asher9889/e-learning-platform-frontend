import { useState, useMemo, useCallback, useEffect } from "react"
import Uppy from "@uppy/core"
import XHRUpload from "@uppy/xhr-upload"
import type { UploadFile } from "../types/content.types"
import type { ContentUploadFormData } from "../schema/content.schema"

export function useContentUpload() {
  const [files, setFiles] = useState<UploadFile[]>([])

  const uppy = useMemo(() => {
    const instance = new Uppy({
      autoProceed: false,
      restrictions: {
        maxFileSize: 2 * 1024 * 1024 * 1024,
        allowedFileTypes: null,
      },
    })

    instance.use(XHRUpload, {
      endpoint: "/api/v1/content/upload",
      method: "POST",
      formData: true,
      fieldName: "file",
      withCredentials: true,
      limit: 1,
    })

    instance.on("file-added", (file) => {
      const uploadFile: UploadFile = {
        id: file.id,
        name: file.name ?? "Unknown",
        type: file.type ?? "OTHER",
        size: file.size ?? 0,
        progress: 0,
        speed: 0,
        eta: 0,
        status: "waiting",
      }
      setFiles((prev) => [...prev, uploadFile])
    })

    instance.on("file-removed", (file) => {
      setFiles((prev) => prev.filter((f) => f.id !== file.id))
    })

    instance.on("upload-progress", (file, progress) => {
      if (!file) return
      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id
            ? {
                ...f,
                progress: Math.round(progress.percentage ?? 0),
                speed: progress.bytesPerSecond ?? 0,
                eta: progress.estimatedSeconds ?? 0,
                status: "uploading" as const,
              }
            : f
        )
      )
    })

    instance.on("upload-success", (file) => {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id ? { ...f, progress: 100, status: "done" as const } : f
        )
      )
    })

    instance.on("upload-error", (file, error) => {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id
            ? { ...f, status: "error" as const, error: error.message }
            : f
        )
      )
    })

    instance.on("complete", () => {
      setTimeout(() => {
        setFiles([])
      }, 3000)
    })

    return instance
  }, [])

  useEffect(() => {
    return () => {
      uppy.destroy()
    }
  }, [uppy])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const droppedFiles = Array.from(e.dataTransfer.files)
      droppedFiles.forEach((file) => {
        try {
          uppy.addFile({ name: file.name, type: file.type, data: file })
        } catch {
          // file rejected by restrictions
        }
      })
    },
    [uppy]
  )

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files ?? [])
      selectedFiles.forEach((file) => {
        try {
          uppy.addFile({ name: file.name, type: file.type, data: file })
        } catch {
          // file rejected
        }
      })
      e.target.value = ""
    },
    [uppy]
  )

  const handleRemoveFile = useCallback(
    (id: string) => {
      uppy.removeFile(id)
    },
    [uppy]
  )

  const handleUpload = useCallback(
    (meta: ContentUploadFormData) => {
      uppy.setMeta({
        title: meta.title,
        description: meta.description ?? "",
        contentType: meta.contentType,
      })
      uppy.upload()
    },
    [uppy]
  )

  const handlePauseResume = useCallback(
    (id: string) => {
      uppy.pauseResume(id)
    },
    [uppy]
  )

  const totalProgress = files.length
    ? Math.round(files.reduce((sum, f) => sum + f.progress, 0) / files.length)
    : 0

  const hasFiles = files.length > 0
  const allDone = hasFiles && files.every((f) => f.status === "done")
  const hasError = files.some((f) => f.status === "error")
  const isUploading = files.some((f) => f.status === "uploading")

  return {
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
  }
}
