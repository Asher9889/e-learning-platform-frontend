import { z } from "zod";

export const createSubjectSchema = z.object({
  programId: z.string().min(1, "Program is required"),

  name: z
    .string()
    .trim()
    .min(1, "Subject name is required")
    .max(100, "Subject name cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),

  isActive: z.boolean().default(true),
});

export const updateSubjectSchema = createSubjectSchema.extend({
  id: z.string().min(1, "Subject ID is required"),
});

export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;
export type UpdateSubjectInput = z.infer<typeof updateSubjectSchema>;

export type SubjectListResponse = {
  subjects: import("../types").Subject[];
  totalSubjects: number;
};
