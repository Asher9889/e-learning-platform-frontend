import { z } from "zod"

export const contentUploadFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters"),
  description: z
    .string()
    .max(1000, "Description must be at most 1000 characters")
    .optional()
    .default(""),
  contentType: z
    .string()
    .min(1, "Content type is required"),
})

export type ContentUploadFormData = z.infer<typeof contentUploadFormSchema>
