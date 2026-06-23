import { z } from "zod"
import { ASSESSMENT_DIFFICULTIES, ASSESSMENT_TYPE, QUESTION_TYPES } from "../constants/assesments.contants"

export const assessmentFormSchema = z.object({
  assessmentType: z.enum(Object.values(ASSESSMENT_TYPE), {
    message: "Assessment type is required",
  }),
  programId: z.string().min(1, "Program is required"),
  subjectId: z.string().min(1, "Subject is required"),
  topic: z.array(z.string().min(1)).min(1, "Add at least one topic"),
  difficulty: z.enum(Object.values(ASSESSMENT_DIFFICULTIES)).default("MIXED"),
  questionTypes: z.array(
    z.enum(Object.values(QUESTION_TYPES))
  ).min(1, "Select at least one question type"),
  questionCount: z.number().min(5, "Minimum 5 questions").max(50, "Maximum 50 questions"),
  totalMarks: z.number().min(1, "Total marks must be greater than 0").optional().default(10),
  additionalInstructions: z.string().optional().default(""),
})

export type AssessmentFormData = z.infer<typeof assessmentFormSchema>
