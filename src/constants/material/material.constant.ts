export const MATERIAL_TYPE = {
  VIDEO: "VIDEO",
  PDF: "PDF",
  DOCUMENT: "DOCUMENT",
  IMAGE: "IMAGE",
  AUDIO: "AUDIO",
} as const

export type MaterialType = typeof MATERIAL_TYPE[keyof typeof MATERIAL_TYPE]

export const MATERIAL_STATUS = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  DELETED: "DELETED",
} as const

export type MaterialStatus = typeof MATERIAL_STATUS[keyof typeof MATERIAL_STATUS]

export const MATERIAL_TYPES = [
  { value: MATERIAL_TYPE.VIDEO, label: "Video" },
  { value: MATERIAL_TYPE.PDF, label: "PDF" },
  { value: MATERIAL_TYPE.DOCUMENT, label: "Document" },
  { value: MATERIAL_TYPE.IMAGE, label: "Image" },
  { value: MATERIAL_TYPE.AUDIO, label: "Audio" },
] as const
