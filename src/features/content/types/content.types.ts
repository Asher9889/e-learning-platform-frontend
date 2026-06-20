export type MaterialStatus = "DRAFT" | "PUBLISHED" | "DELETED";
export type MaterialType = "VIDEO" | "PDF" | "DOCUMENT" | "IMAGE" | "AUDIO";

export interface Material {
  id: string;
  title: string;
  description: string | null;
  materialType: MaterialType;
  objectKey: string;
  file: {
    originalFileName: string;
    mimeType: string;
    size: number;
  };
  status: MaterialStatus;
  createdAt: string;
  updatedAt: string;
  subject: string | null;
  createdBy: {
    id: string;
    name: string;
  };
}

export interface MaterialsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    materials: Material[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface MaterialsStatsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: [{
    totalMaterials: number;
    publishedMaterials: number;
    draftMaterials: number;
    storageUsed: number;
  }];
}

export interface MaterialFilters {
  status?: MaterialStatus;
  programId?: string;
  subjectId?: string;
  type?: MaterialType;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface UpdateMaterialPayload {
  title?: string;
  description?: string;
  materialType?: MaterialType;
  programId?: string;
  subjectId?: string;
}

export interface UploadFile {
  id: string;
  name: string;
  type: string;
  size: number;
  status: "waiting" | "uploading" | "done" | "error" | "paused";
  progress: number;
  speed?: number;
  eta?: number;
  error?: string;
}

export const FILE_TYPE_ICONS: Record<string, string> = {
  "application/pdf": "PDF",
  "application/msword": "DOC",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
  "image/": "IMAGE",
  "video/": "VIDEO",
  "audio/": "AUDIO",
  OTHER: "OTHER",
};

export const TYPE_COLORS: Record<string, string> = {
  PDF: "bg-red-100 text-red-600",
  DOC: "bg-blue-100 text-blue-600",
  DOCX: "bg-blue-100 text-blue-600",
  IMAGE: "bg-green-100 text-green-600",
  VIDEO: "bg-purple-100 text-purple-600",
  AUDIO: "bg-amber-100 text-amber-600",
  OTHER: "bg-gray-100 text-gray-600",
};

export function formatSpeed(bytesPerSecond: number): string {
  if (bytesPerSecond === 0) return "0 B/s";
  const k = 1024;
  const sizes = ["B/s", "KB/s", "MB/s", "GB/s"];
  const i = Math.floor(Math.log(bytesPerSecond) / Math.log(k));
  return `${parseFloat((bytesPerSecond / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatTime(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`;
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
}

export function getSubjectName(subject: unknown): string {
  if (!subject) return "";
  if (typeof subject === "string") return subject;
  if (typeof subject === "object" && subject !== null) {
    const s = subject as { name?: string };
    return s.name || "";
  }
  return "";
}

export function formatSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
