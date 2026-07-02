import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAllAsRead } from "../api/notification.api";

export const useMarkAllAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: markAllAsRead,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["notifications"],
            });

            queryClient.invalidateQueries({
                queryKey: ["notification-unread-count"],
            });
        },
    });
};