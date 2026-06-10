// src/pages/Classes/schema.ts

import { z } from "zod";
import type { Class } from "../types";

/* =========================
   Section Schema
========================= */

export const sectionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Section name must be at least 2 characters")
    .max(50, "Section name cannot exceed 50 characters"),

  strength: z.coerce
    .number()
    .min(1, "Strength must be at least 1")
    .max(500, "Strength cannot exceed 500"),
});

export const createSectionSchema = sectionSchema.extend({
  classId: z.string().min(1, "Class ID is required"),
});

export const updateSectionSchema = createSectionSchema.extend({
  id: z.string().min(1, "Section ID is required"),
   classId: z.string().min(1, "Class ID is required"),
});

/* =========================
   Class Schema
========================= */

export const classSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Class name must be at least 2 characters")
    .max(100, "Class name cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),

  grade: z
    .string()
    .trim()
    .min(1, "Grade is required"),

  academicYear: z
    .string()
    .regex(
      /^\d{4}-\d{4}$/,
      "Academic year must be in format YYYY-YYYY"
    ),
});

export const createClassSchema = classSchema;

export const updateClassSchema = classSchema.extend({
  id: z.string().min(1, "Class ID is required"),
});

/* =========================
   Form Types
========================= */

export type ClassFormData = z.infer<typeof classSchema>;

export type SectionFormData = z.infer<typeof sectionSchema>;

/* =========================
   API Types
========================= */

export type CreateClassInput = z.infer<typeof createClassSchema>;

export type UpdateClassInput = z.infer<typeof updateClassSchema>;

export type CreateSectionInput = z.infer<typeof createSectionSchema>;

export type UpdateSectionInput = z.infer<typeof updateSectionSchema>;


 export type StudentsListResponse = {
  classes: Class[];
  totalClasses: number;
};