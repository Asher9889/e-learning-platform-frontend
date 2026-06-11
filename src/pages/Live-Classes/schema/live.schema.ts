import { z } from "zod";

export const scheduleLiveClassSchema = z.object({
    // id: z.string(),
    title: z.string().min(1, "Title is required").max(120),
    description: z.string().max(500).optional(),
    subject: z.string().min(1, "Subject is required"),
    teacherId: z.string(),
    scheduledAt: z.iso.datetime(),
    durationMinutes: z.number().min(15).max(180),
    maxParticipants: z.number().min(1).max(500),
    isRecordingEnabled: z.boolean(),
    isChatEnabled: z.boolean(),
    isScreenShareAllowed: z.boolean(),
    // status: z.enum(Object.values(CLASS_STATUS)).default("SCHEDULED"),
    // meetingUrl: z.string().url().optional(),
    // passcode: z.string().optional(),
    // createdBy: z.string(),
    // createdAt: z.string().datetime(),
    // updatedAt: z.string().datetime(),
});

export const startLiveClassSchema = z.object({
    title: z.string().min(1, "Title is required").max(120),
    description: z.string().max(500).optional(),
    subject: z.string().min(1, "Subject is required"),
    durationMinutes: z.number().min(15).max(180),
    maxParticipants: z.number().min(1).max(500),
    isRecordingEnabled: z.boolean(),
    isChatEnabled: z.boolean(),
    isScreenShareAllowed: z.boolean(),
});

export const joinLiveClassSchema = z.object({
    displayName: z.string().min(1).max(50),
    audioEnabled: z.boolean().default(true),
    videoEnabled: z.boolean().default(true),
});

export type TScheduledLiveClass = z.infer<typeof scheduleLiveClassSchema>;





export type TStartLiveClassInput = z.infer<typeof startLiveClassSchema>;
export type TJoinLiveClassInput = z.infer<typeof joinLiveClassSchema>;