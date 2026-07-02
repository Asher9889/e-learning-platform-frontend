import {
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileSpreadsheet,
  FileCode,
  File,
} from "lucide-react";

export type PreviewType =
  | "image"
  | "pdf"
  | "video"
  | "audio"
  | "text"
  | "none";

export function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;

  const sizes = ["Bytes", "KB", "MB", "GB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function getPreviewType(
  mimeType: string
): PreviewType {
  if (mimeType.startsWith("image/")) return "image";

  if (mimeType === "application/pdf") return "pdf";

  if (mimeType.startsWith("video/")) return "video";

  if (mimeType.startsWith("audio/")) return "audio";

  if (
    mimeType.startsWith("text/") ||
    mimeType.includes("json") ||
    mimeType.includes("javascript") ||
    mimeType.includes("typescript")
  ) {
    return "text";
  }

  return "none";
}

export function getFileIcon(
  mimeType: string
) {
  if (mimeType.startsWith("image/")) return FileImage;

  if (mimeType === "application/pdf") return FileText;

  if (mimeType.startsWith("video/")) return FileVideo;

  if (mimeType.startsWith("audio/")) return FileAudio;

  if (
    mimeType.includes("zip") ||
    mimeType.includes("rar") ||
    mimeType.includes("7z")
  ) {
    return FileArchive;
  }

  if (
    mimeType.includes("excel") ||
    mimeType.includes("spreadsheet")
  ) {
    return FileSpreadsheet;
  }

  if (
    mimeType.includes("json") ||
    mimeType.includes("javascript") ||
    mimeType.includes("typescript")
  ) {
    return FileCode;
  }

  return File;
}

export function canPreview(
  mimeType: string
) {
  return getPreviewType(mimeType) !== "none";
}