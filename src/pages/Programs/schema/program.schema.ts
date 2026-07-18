import { z } from "zod";
import type { Program } from "../types";


export const PROGRAM_MODE_OPTIONS = [
  { value: "ONLINE", label: "Online" },
  { value: "OFFLINE", label: "Offline" },
  { value: "HYBRID", label: "Hybrid" },
] as const;

export const PROGRAM_TYPE_OPTIONS = [
  { value: "SCHOOL", label: "School" },
  { value: "DIPLOMA", label: "Diploma" },
  { value: "UNDERGRADUATE", label: "Undergraduate" },
  { value: "POSTGRADUATE", label: "Postgraduate" },
  { value: "PROFESSIONAL", label: "Professional" },
] as const;

export const PROGRAM_FEE_TYPE_OPTIONS = [
  { value: "ONE_TIME", label: "One Time" },
  { value: "MONTHLY", label: "Monthly" },
  { value: "QUARTERLY", label: "Quarterly" },
  { value: "SEMESTER", label: "Semester" },
  { value: "YEARLY", label: "Yearly" },
] as const;

type ProgramMode = (typeof PROGRAM_MODE_OPTIONS)[number]["value"];
type ProgramType = (typeof PROGRAM_TYPE_OPTIONS)[number]["value"];
type FeeType = (typeof PROGRAM_FEE_TYPE_OPTIONS)[number]["value"];

// export const PROGRAM_CATEGORIES = [
//   "School",
//   "Undergraduate",
//   "Postgraduate",
//   "Professional",
// ] as const;

// export const PROGRAM_MODES = [
//   "Online",
//   "Offline",
//   "Hybrid",
// ] as const;

// export const FEE_TYPES = [
//   "One Time",
//   "Monthly",
//   "Quarterly",
//   "Semester",
//   "Yearly",
// ] as const;

export const createProgramSchema = z.object({
  name: z.string().trim().min(2, "Program name must be at least 2 characters").max(100, "Program name cannot exceed 100 characters"),
  fullName: z.string().min(1).max(100).trim(),
  programType: z.enum(Object.values(PROGRAM_TYPE_OPTIONS).map((v) => v.value), {
    error: `Program type is required and can be one of: ${PROGRAM_TYPE_OPTIONS.map((v) => v.value).join(", ")}`,
  }),
  thumbnail: z.string().trim().optional().nullable().default(null),
  description: z.string().trim().min(20, "Description must be at least 20 characters").max(1000, "Description cannot exceed 1000 characters"),
  durationMonths: z.number().int("Duration must be a whole number").min(1, "Duration must be at least 1 month")
  .max(120, "Duration cannot exceed 120 months"),
  mode: z.enum(Object.values(PROGRAM_MODE_OPTIONS).map((v) => v.value), {
    error: `Mode is required and can be one of: ${PROGRAM_MODE_OPTIONS.map((v) => v.value).join(", ")}`,
  }),
  feeAmount: z.number().positive("Fee amount must be greater than 0"),
  feeType: z.enum(Object.values(PROGRAM_FEE_TYPE_OPTIONS).map((v) => v.value), {
    error: `Fee type is required and can be one of: ${PROGRAM_FEE_TYPE_OPTIONS.map((v) => v.value).join(", ")}`,
  }),
  featured: z.boolean().default(false),
  benefits: z.array(z.string().trim().min(3, "Benefit must be at least 3 characters").max(100)).default([]),
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
  programs: Program[];
  totalPrograms: number;
};

export const programFormSchema = createProgramSchema;