import { z } from "zod";

const objectIdString = (label: string) =>
  z.string().regex(/^[0-9a-fA-F]{24}$/, { message: `Please provide a valid ${label}` });

/**
 * POST /group-study  (create room)
 */
export const createGroupStudyRoomSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Room name must be at least 3 characters")
    .max(80, "Room name cannot exceed 80 characters"),

  description: z
    .string()
    .trim()
    .max(300, "Description cannot exceed 300 characters")
    .optional()
    .or(z.literal("")),

  subject: z.string().trim().max(60).optional().or(z.literal("")),

  isPrivate: z.boolean(),

  memberIds: z
    .array(objectIdString("member id"))
    .max(50, "A room can have at most 50 invited members")
    ,
});

export type TCreateGroupStudyRoomForm = z.infer<typeof createGroupStudyRoomSchema>;

/**
 * PATCH /group-study/:id  (update room)
 */
export const updateGroupStudyRoomSchema = z.object({
  name: z.string().trim().min(3).max(80).optional(),
  description: z.string().trim().max(300).optional(),
  isPrivate: z.boolean().optional(),
});

export type TUpdateGroupStudyRoomForm = z.infer<typeof updateGroupStudyRoomSchema>;

/**
 * POST /group-study/:id/members  (add members)
 */
export const addRoomMembersSchema = z.object({
  memberIds: z
    .array(objectIdString("member id"))
    .min(1, "At least one member id is required")
    .max(50),
});

export type TAddRoomMembersForm = z.infer<typeof addRoomMembersSchema>;

/**
 * GET /group-study (filters used in UI - kept client-side, no need to send page/limit through zod each time)
 */
export const roomFilterSchema = z.enum(["ALL", "MY_ROOMS", "JOINED", "LIVE"]);
