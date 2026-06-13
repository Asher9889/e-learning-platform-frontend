import type { ContentUploadFormData } from "../schema/content.schema"

export async function uploadContent(
  file: File,
  metadata: ContentUploadFormData
): Promise<{ id: string }> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("title", metadata.title)
  formData.append("description", metadata.description ?? "")
  formData.append("contentType", metadata.contentType)

  const response = await fetch("/api/v1/content/upload", {
    method: "POST",
    credentials: "include",
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Upload failed" }))
    throw new Error(error.message || `Upload failed with status ${response.status}`)
  }

  return response.json()
}
