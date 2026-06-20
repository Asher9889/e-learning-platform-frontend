import { z } from "zod";

export const createGradeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Grade name is required")
    .max(100, "Grade name cannot exceed 100 characters"),

  isActive: z.boolean(),

  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
});

export const gradeSchema = createGradeSchema.extend({
  id: z.string(),
  normalizedName: z.string(),
});


export const updateGradeSchema = createGradeSchema.extend({
  id: z.string(),
  
});
export type CreateGradeInput = z.output<
  typeof createGradeSchema
>;
export type GradeFormValues = z.input<typeof createGradeSchema>;

export type Grade = z.infer<
  typeof gradeSchema
>;

export type UpdateGrade = z.infer<typeof updateGradeSchema>;
 export type GradesListResponse = {
  grades: Grade[];
  totalClasses: number;
};