import { CLASS_STATUS } from "@/constants/live-class/live-class.constants";
import { z } from "zod";

export const startLiveClassSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(120, "Title must be less than 120 characters"),

  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),

  gradeId: z.string().min(1, "Grade is required"),

  subjectId: z.string().min(1, "Subject is required"),

  teacherId: z.string().min(1, "Teacher is required"),
 scheduledAt: z.iso.datetime().optional(),
 status: z.enum(Object.values(CLASS_STATUS)).default("SCHEDULED"),
  durationMinutes: z
    .number()
    .min(1, "Duration must be at least 1 minute"),

  maxParticipants: z
    .number()
    .min(1, "Max participants must be at least 1"),

  isRecordingEnabled: z.boolean(),

  isChatEnabled: z.boolean(),

  isScreenShareAllowed: z.boolean(),
});

export type TStartLiveClassInput = z.infer<
  typeof startLiveClassSchema
>;