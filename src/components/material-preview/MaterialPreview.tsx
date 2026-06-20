import { envConfig } from "@/config"
import { UnsupportedPreview } from "./UnsupportedPreview"

interface MaterialPreviewProps {
  fileUrl: string
  mimeType: string
  fileName: string
  materialType: string
}

export function getMaterialFileUrl(objectKey: string): string {
  const fullUrl = `${envConfig.minioStotageBaseURL}/${envConfig.minioBucketName}/${objectKey}`
  console.log("Material file URL:", fullUrl) // Log the full URL for debugging
  return fullUrl;
}

export function MaterialPreview({ fileUrl, mimeType, fileName, materialType }: MaterialPreviewProps) {
  switch (materialType) {
    case "IMAGE":
      return (
        <div className="flex items-center justify-center p-4">
          <img
            loading="lazy"
            src={fileUrl}
            alt={fileName}
            className="max-h-[70vh] max-w-full rounded-lg object-contain"
          />
        </div>
      )

    case "VIDEO":
      return (
        <div className="flex items-center justify-center p-4">
          <video
            controls
            className="max-h-[70vh] max-w-full rounded-lg"
          >
            <source src={fileUrl} type={mimeType} />
            Your browser does not support the video element.
          </video>
        </div>
      )

    case "AUDIO":
      return (
        <div className="flex items-center justify-center p-8">
          <audio
            controls
            className="w-full max-w-md"
          >
            <source src={fileUrl} type={mimeType} />
            Your browser does not support the audio element.
          </audio>
        </div>
      )

    case "PDF":
      return (
        <div className="h-[70vh] w-full">
          <iframe
            src={fileUrl}
            className="h-full w-full rounded-lg border-0"
            title={fileName}
          />
        </div>
      )

    default:
      return (
        <UnsupportedPreview
          fileName={fileName}
          mimeType={mimeType}
          fileUrl={fileUrl}
        />
      )
  }
}
