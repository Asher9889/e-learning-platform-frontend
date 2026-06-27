// import { z } from "zod";
// import { HIGHER_ED_TYPES, TOTAL_PROGRAM_TYPES } from "../types";

// export const createProgramSchema = z
//   .object({
//     name: z
//       .string()
//       .trim()
//       .min(2, "Program name must be at least 2 characters")
//       .max(100, "Program name cannot exceed 100 characters"),

//     programType: z.enum( Object.values(TOTAL_PROGRAM_TYPES),{ error: `Program type is required and can be one of: ${Object.values(TOTAL_PROGRAM_TYPES).join(", ")}` }
//     ),

//     fullName: z
//       .string()
//       .trim()
//       .max(200, "Full name cannot exceed 200 characters")
//       .optional()
//       .or(z.literal("")),

//     description: z
//       .string()
//       .trim()
//       .max(500, "Description cannot exceed 500 characters")
//       .optional()
//       .or(z.literal("")),

//     durationMonths: z.coerce
//       .number()
//       .int("Duration must be a whole number")
//       .min(1, "Duration must be at least 1 month")
//       .max(120, "Duration cannot exceed 120 months")
//       .optional()
//       .or(z.literal("").transform(() => undefined)),

//     isActive: z.boolean(),
//   })
//   .superRefine((data, ctx) => {
//     const isHigherEd = HIGHER_ED_TYPES.includes(data.programType);

//     if (isHigherEd) {
//       if (!data.fullName || data.fullName.trim().length === 0) {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message: "Full name is required for this program type",
//           path: ["fullName"],
//         });
//       }

//       if (!data.durationMonths || data.durationMonths < 1) {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message: "Duration is required for this program type",
//           path: ["durationMonths"],
//         });
//       }
//     }
//   });

// export const updateProgramSchema = createProgramSchema.extend({
//   id: z.string().min(1, "Program ID is required"),
// });

// export type CreateProgramInput = z.output<typeof createProgramSchema>;
// export type UpdateProgramInput = z.output<typeof updateProgramSchema>;
// export type ProgramFormValues = z.input<typeof createProgramSchema>;

// export type ProgramListResponse = {
//   programs: import("../types").Program[];
//   totalPrograms: number;
// };


import { z } from "zod";
import { TOTAL_PROGRAM_TYPES } from "../types";

export const PROGRAM_CATEGORIES = [
  "School",
  "Undergraduate",
  "Postgraduate",
  "Professional",
] as const;

export const PROGRAM_MODES = [
  "Online",
  "Offline",
  "Hybrid",
] as const;

export const FEE_TYPES = [
  "One Time",
  "Monthly",
  "Quarterly",
  "Semester",
  "Yearly",
] as const;

export const createProgramSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Program name must be at least 2 characters")
    .max(100, "Program name cannot exceed 100 characters"),

  fullName: z
    .string()
    .trim().optional(),
    // .min(2, "Full name is required")
    // .max(200, "Full name cannot exceed 200 characters"),

  slug: z
    .string()
    .trim()
    .max(150, "Slug cannot exceed 150 characters")
    .optional()
    .or(z.literal("")),

      programType: z.enum( Object.values(TOTAL_PROGRAM_TYPES),{ error: `Program type is required and can be one of: ${Object.values(TOTAL_PROGRAM_TYPES).join(", ")}` }
    ),

  thumbnail: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description cannot exceed 1000 characters"),

  durationMonths: z
  .number()
  .int("Duration must be a whole number")
  .min(1, "Duration must be at least 1 month")
  .max(120, "Duration cannot exceed 120 months"),

  mode: z.enum(PROGRAM_MODES, {
    error: `Mode is required and can be one of: ${PROGRAM_MODES.join(", ")}`,
  }),


  feeAmount: z.coerce
    .number()
    .positive("Fee amount must be greater than 0"),

  feeType: z.enum(FEE_TYPES, {
    error: `Fee type is required and can be one of: ${FEE_TYPES.join(", ")}`,
  }),

  featured: z.boolean().default(false),

  benefits: z
  .array(
    z.string().trim().min(3, "Benefit must be at least 3 characters").max(10000)
  )
  .default([]),

  isActive: z.boolean().default(true),
});

export const updateProgramSchema = createProgramSchema.extend({
  id: z.string().min(1, "Program ID is required"),
});

export type CreateProgramInput = z.output<typeof createProgramSchema>;
export type UpdateProgramInput = z.output<typeof updateProgramSchema>;
export type ProgramFormValues = z.input<typeof createProgramSchema>;
export type FormValues = z.input<typeof createProgramSchema>;
export type ProgramListResponse = {
  programs: import("../types").Program[];
  totalPrograms: number;
};