import {
    api,
    apiEndPoints,
} from "@/config";

export async function getNotifications(
    page = 1,
    limit = 20
) {
    const { url, method } =
        apiEndPoints.NOTIFICATION.GET_ALL;

    const res =
        await api.request({
            url,
            method,
            params: {
                page,
                limit,
            },
        });

    return res.data;
}

export async function getUnreadCount() {
    const { url, method } =
        apiEndPoints.NOTIFICATION
            .GET_UNREAD_COUNT;

    const res =
        await api.request({
            url,
            method,
        });

    return res.data;
}

export async function markAsRead(
    id: string
) {
    const { url, method } =
        apiEndPoints.NOTIFICATION
            .MARK_AS_READ;

    const res =
        await api.request({
            url: `${url}/${id}/read`,
            method,
        });

    return res.data;
}

export async function markAllAsRead() {
    const { url, method } =
        apiEndPoints.NOTIFICATION
            .MARK_ALL_AS_READ;

    const res =
        await api.request({
            url,
            method,
        });

    return res.data;
}

export async function deleteNotification(
    id: string
) {
    const { url, method } =
        apiEndPoints.NOTIFICATION.DELETE;

    const res =
        await api.request({
            url: `${url}/${id}`,
            method,
        });

    return res.data;
}

export async function deleteAllNotifications() {
    const { url, method } =
        apiEndPoints.NOTIFICATION
            .DELETE_ALL;

    const res =
        await api.request({
            url,
            method,
        });

    return res.data;
}