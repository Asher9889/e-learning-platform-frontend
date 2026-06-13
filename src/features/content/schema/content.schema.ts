import { z } from "zod"

export const contentUploadFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be at most 100 characters"),
  description: z
    .string()
    .max(300, "Description must be at most 300 characters")
    .optional()
    .default(""),
  contentType: z
    .string()
    .min(1, "Content type is required"),
})

export type ContentUploadFormData = z.infer<typeof contentUploadFormSchema>
