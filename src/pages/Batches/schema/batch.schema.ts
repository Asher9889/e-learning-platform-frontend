import { z } from "zod";

export const createBatchSchema = z.object({
  programId: z.string().min(1, "Program is required"),

  academicSession: z
    .string()
    .min(1, "Academic session is required")
    .regex(/^\d{4}-\d{4}$/, "Academic session must be in format YYYY-YYYY"),

  name: z
    .string()
    .trim()
    .min(2, "Batch name must be at least 2 characters")
    .max(100, "Batch name cannot exceed 100 characters"),

  maxStudents: z.coerce
    .number()
    .int("Must be a whole number")
    .min(0, "Must be at least 0")
    .optional()
    .or(z.literal("").transform(() => undefined)),

  isActive: z.boolean(),
});

export const updateBatchSchema = createBatchSchema.extend({
  id: z.string().min(1, "Batch ID is required"),
});

export type CreateBatchInput = z.output<typeof createBatchSchema>;
export type UpdateBatchInput = z.output<typeof updateBatchSchema>;
export type BatchFormValues = z.input<typeof createBatchSchema>;

export type BatchListResponse = {
  batches: import("../types").Batch[];
  totalBatches: number;
};
