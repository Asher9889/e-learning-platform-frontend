import z from "zod";

export const notificationDeliverySchema = z.object({
    fcm: z.enum([
        "PENDING",
        "SENT",
        "FAILED",
    ]),

    socket: z.enum([
        "PENDING",
        "SENT",
        "FAILED",
    ]),
});

export const notificationSchema = z.object({
    id: z.string(),

    notificationId: z.string(),

    title: z.string(),

    body: z.string(),

    type: z.string(),

    entityId: z.string(),

    userId: z.string(),

    status: z.enum([
        "PENDING",
        "SENT",
        "FAILED",
    ]),

    delivery:
        notificationDeliverySchema,

    data: z.record(
        z.string(),
        z.unknown()
    ),

    isRead: z.boolean(),

    readAt: z.string().nullable(),

    sentAt: z.string().nullable(),

    failedAt: z.string().nullable(),

    createdAt: z.string(),

    updatedAt: z.string(),

    __v: z.number(),
});

export const notificationListSchema =
    z.object({
        notifications: z.array(
            notificationSchema
        ),

        totalNotifications: z.number(),

        unreadCount: z.number(),

        page: z.number(),

        limit: z.number(),

        totalPages: z.number(),
    });

export type TNotification =
    z.infer<
        typeof notificationSchema
    >;

export type TNotificationList =
    z.infer<
        typeof notificationListSchema
    >;