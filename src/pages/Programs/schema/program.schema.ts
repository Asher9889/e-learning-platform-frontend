import { z } from "zod";
import { HIGHER_ED_TYPES, TOTAL_PROGRAM_TYPES } from "../types";

export const createProgramSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Program name must be at least 2 characters")
      .max(100, "Program name cannot exceed 100 characters"),

    programType: z.enum( Object.values(TOTAL_PROGRAM_TYPES),{ error: `Program type is required and can be one of: ${Object.values(TOTAL_PROGRAM_TYPES).join(", ")}` }
    ),

    fullName: z
      .string()
      .trim()
      .max(200, "Full name cannot exceed 200 characters")
      .optional()
      .or(z.literal("")),

    description: z
      .string()
      .trim()
      .max(500, "Description cannot exceed 500 characters")
      .optional()
      .or(z.literal("")),

    durationMonths: z.coerce
      .number()
      .int("Duration must be a whole number")
      .min(1, "Duration must be at least 1 month")
      .max(120, "Duration cannot exceed 120 months")
      .optional()
      .or(z.literal("").transform(() => undefined)),

    isActive: z.boolean(),
  })
  .superRefine((data, ctx) => {
    const isHigherEd = HIGHER_ED_TYPES.includes(data.programType);

    if (isHigherEd) {
      if (!data.fullName || data.fullName.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Full name is required for this program type",
          path: ["fullName"],
        });
      }

      if (!data.durationMonths || data.durationMonths < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Duration is required for this program type",
          path: ["durationMonths"],
        });
      }
    }
  });

export const updateProgramSchema = createProgramSchema.extend({
  id: z.string().min(1, "Program ID is required"),
});

export type CreateProgramInput = z.output<typeof createProgramSchema>;
export type UpdateProgramInput = z.output<typeof updateProgramSchema>;
export type ProgramFormValues = z.input<typeof createProgramSchema>;

export type ProgramListResponse = {
  programs: import("../types").Program[];
  totalPrograms: number;
};
