export type NotificationStatus =
    | "PENDING"
    | "SENT"
    | "FAILED";

export interface NotificationDelivery {
    fcm: NotificationStatus;
    socket: NotificationStatus;
}

export interface Notification {
    id: string;

    notificationId: string;

    title: string;

    body: string;

    type: string;

    entityId: string;

    userId: string;

    status: NotificationStatus;

    delivery: NotificationDelivery;

    data: Record<string, unknown>;

    isRead: boolean;

    readAt: string | null;

    sentAt: string | null;

    failedAt: string | null;

    createdAt: string;

    updatedAt: string;

    __v: number;
}

export interface NotificationListResponse {
    notifications: Notification[];

    totalNotifications: number;

    unreadCount: number;

    page: number;

    limit: number;

    totalPages: number;
}