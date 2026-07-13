import { z } from "zod";

export const assessmentQuestionSchema =
    z.object({
        question: z.string(),

        marks: z.number(),

        difficulty: z.string(),

        explanation: z.string(),

        type: z.string(),

        options: z.array(z.string()).optional(),

        correctAnswer: z.string().optional(),

        id: z.string(),

        number: z.number(),
    });

export const assessmentSchema =
    z.object({
        id: z.string(),

        title: z.string(),

        instructions: z.string(),

        assessmentType: z.string(),

        subjectId: z.string(),

        // batchId: z.array(z.string()),
        batchId: z.union([
            z.string(),
            z.array(z.string())
        ]).optional(),

        topic: z.array(z.string()),

        difficulty: z.string(),

        questionTypes: z.array(
            z.string()
        ),

        questionCount: z.number(),

        totalMarks: z.number(),

        additionalInstructions:
            z.string(),

        questions: z.array(
            assessmentQuestionSchema
        ),

        status: z.enum([
            "DRAFT",
            "PUBLISHED",
        ]),

        createdBy: z.string(),

        createdAt: z.string(),

        updatedAt: z.string(),
    });

export const assessmentsResponseSchema =
    z.object({
        assessments: z.array(
            assessmentSchema
        ),

        totalAssessments:
            z.number(),
    });

export type AssessmentSchema =
    z.infer<
        typeof assessmentSchema
    >;