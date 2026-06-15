import Uppy from "@uppy/core"
import AwsS3 from "@uppy/aws-s3"
import { store } from "@/store/store"
import {
  addUpload,
  updateProgress,
  setStatus,
  removeItem,
  addPendingMetadata,
} from "../store/upload.slice"
import { api, apiEndPoints } from "@/config"
import { sileo } from "sileo"

let instance: Uppy | null = null



export function getUppy(): Uppy {
  if (!instance) {
    instance = createUppy()
  }
  return instance
}

function createUppy(): Uppy {


  const uppy = new Uppy({
    autoProceed: true,
    restrictions: {
      maxFileSize: 5 * 1024 * 1024 * 1024,
      allowedFileTypes: null,
    },
  })

  uppy.use(AwsS3, {
    limit: 4,
    shouldUseMultipart: true,


    createMultipartUpload: async (file) => {
      const { url, method } = apiEndPoints.UPLOADS.CREATE_MULTIPART_UPLOAD;
      const payload = {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        purpose: "CONTENT_LIBRARY",
      }
      const res = await api.request({
        url,
        method,
        data: payload,
      })

      console.log("createMultipartUpload response:", res.data);

      return {
        uploadId: res.data.uploadId,
        key: res.data.key,
      }

    },

    signPart: async (_, { uploadId, key, partNumber }) => {
      const { url, method } = apiEndPoints.UPLOADS.SIGN_MULTIPART_UPLOAD;
      const res = await api.request({
        url,
        method,
        data: { uploadId, key, partNumber }
      })

      console.log("signPart response:", res.data);
      return {
        url: res.data.signedUrl,
      }

    },

    completeMultipartUpload: async (_, { uploadId, key, parts }) => {

      const { url, method } = apiEndPoints.UPLOADS.COMPLETE_MULTIPART_UPLOAD;
      const res = await api.request({
        url,
        method,
        data: { uploadId, key, parts }
      })
      return {
        location: res.data.location,
      }
    },

    abortMultipartUpload: async (_, { uploadId, key }) => {

      await api.request({
        url: apiEndPoints.UPLOADS.ABORT_MULTIPART_UPLOAD.url,
        method: apiEndPoints.UPLOADS.ABORT_MULTIPART_UPLOAD.method,
        data: { uploadId, key }
      })
    },

    listParts: async (_, { uploadId, key }) => {
      const res = await api.request({
        url: apiEndPoints.UPLOADS.LIST_MULTIPART_UPLOADS.url,
        method: apiEndPoints.UPLOADS.LIST_MULTIPART_UPLOADS.method,
        data: { uploadId, key }
      })
      return res.data.parts;
    },

  })

  uppy.on("file-added", (file) => {
    console.log("file-added event:", file);
    store.dispatch(
      addUpload({
        id: file.id,
        fileName: file.name ?? "Unknown",
        fileSize: file.size ?? 0,
      })
    )
  })

  uppy.on("file-removed", (file) => {
    store.dispatch(removeItem(file.id))
  })

  uppy.on("upload-progress", (file, progress) => {
    if (!file) return
    const bytesUploaded = progress.bytesUploaded ?? 0
    const bytesTotal = progress.bytesTotal ?? 0
    store.dispatch(
      updateProgress({
        id: file.id,
        uploadedBytes: bytesUploaded,
        progress: bytesTotal > 0 ? Math.round((bytesUploaded / bytesTotal) * 100) : 0,
        speed: progress.bytesPerSecond ?? 0,
        eta: progress.eta ?? 0,
      })
    )
  })

  uppy.on("upload-success", (file, response) => {
    store.dispatch(setStatus({ id: file?.id, status: "COMPLETED" }))
    store.dispatch(
      addPendingMetadata({
        fileId: file?.id ?? "",
        fileName: file?.name ?? "Unknown",
        fileSize: file?.size ?? 0,
        uploadUrl: response.uploadURL ?? "",
      })
    )
  })

  uppy.on("upload-error", (file, error) => {
    store.dispatch(
      setStatus({ id: file?.id, status: "FAILED", error: error.message })
    )
    sileo.error({
      title: "Upload Error",
      description: `Failed to upload ${file?.name ?? "Unknown"}: ${error.message}`,
    })
  })

  uppy.on("restriction-failed", (_, error) => {
    // console.warn("Restriction failed for file:", file, "Error:", error)
    sileo.error({
      title: "File Rejected",
      description: error.message,
    })
  })

  uppy.on("error", (error) => {
    console.error("Uppy error:", error)
    sileo.error({
      title: "Upload Error",
      description: `An error occurred during upload: ${error.message}`,
    })
  })

  uppy.on("complete", (result) => {
    ;[...(result.successful ?? []), ...(result.failed ?? [])].forEach(
      (file) => {
        setTimeout(() => {
          store.dispatch(removeItem(file.id))
        }, 10_000)
      }
    )
  })

  return uppy
}
