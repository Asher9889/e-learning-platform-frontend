import { z } from "zod"

export const assessmentFormSchema = z.object({
  assessmentType: z.enum(["QUIZ", "ASSIGNMENT", "QUESTION-PAPER"], {
    message: "Assessment type is required",
  }),
  programId: z.string().min(1, "Program is required"),
  subjectId: z.string().min(1, "Subject is required"),
  topic: z.array(z.string().min(1)).min(1, "Add at least one topic"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD", "MIXED"]).default("MIXED"),
  questionTypes: z.array(
    z.enum(["MCQ", "TRUE-FALSE", "SHORT-ANSWER", "LONG-ANSWER", "CASE-STUDY"])
  ).min(1, "Select at least one question type"),
  questionCount: z.number().min(5, "Minimum 5 questions").max(50, "Maximum 50 questions"),
  totalMarks: z.number().min(1, "Total marks must be greater than 0").optional().default(10),
  additionalInstructions: z.string().optional().default(""),
})

export type AssessmentFormData = z.infer<typeof assessmentFormSchema>
