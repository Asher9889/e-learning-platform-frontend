import { CLASS_STATUS, DELIVERY_MODE } from "@/constants/live-class/live-class.constants";
import { z } from "zod";

export const startLiveClassSchema = z.object({
  title: z.string().min(1, "Title is required").max(120, "Title must be less than 120 characters"),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),

  programId: z.string().min(1, "Program is required"),
  batchId: z.string().optional().nullable(),
  subjectId: z.string().min(1, "Subject is required"),
  teacherId: z.string().min(1, "Teacher is required"),

  // scheduledAt: z.iso.datetime().optional(),

  status: z.enum(Object.values(CLASS_STATUS)),
  deliveryMode: z.enum(Object.values(DELIVERY_MODE)),

  // replayMaterialId: z.string().optional(), 
  durationMinutes: z.number("Duration is required").min(1, "Duration must be at least 1 minute").max(180, "Duration must be less than or equal to 180 minutes"),

  maxParticipants: z.number().min(1, "Max participants must be at least 1"),

  isRecordingEnabled: z.boolean(),

  isChatEnabled: z.boolean(),

  isScreenShareAllowed: z.boolean(),
});

export const scheduleLiveClassSchema = startLiveClassSchema.extend({
  replayMaterialId: z.string().optional().nullable(),
  scheduledAt: z.iso.datetime({ message: "Please select a valid date & time" }),
}).refine((value) => {
  if(value.deliveryMode === "REPLAY"){
    console.log("value.replayMaterialId", value.replayMaterialId)
    if(!value.replayMaterialId) return false;
  }
  return true;
}, { message: "Please select a recorded video" })

export type TStartLiveClassInput = z.infer<typeof startLiveClassSchema>;

export type TScheduleLiveClassInput =  z.infer<typeof scheduleLiveClassSchema>;