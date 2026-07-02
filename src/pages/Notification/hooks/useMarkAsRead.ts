import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAsRead } from "../api/notification.api";

export const useMarkAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => markAsRead(id),

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