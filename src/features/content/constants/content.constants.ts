export const FILE_CATEGORY = {
  IMAGE: "IMAGE",
  VIDEO: "VIDEO",
  PDF: "PDF",
  DOCUMENT: "DOCUMENT",
  AUDIO: "AUDIO",
} as const

export const CONTENT_TYPES = [
  { value: FILE_CATEGORY.VIDEO, label: "Video" },
  { value: FILE_CATEGORY.PDF, label: "PDF" },
  { value: FILE_CATEGORY.DOCUMENT, label: "Document" },
  { value: FILE_CATEGORY.IMAGE, label: "Image" },
  { value: FILE_CATEGORY.AUDIO, label: "Audio" },
] as const
