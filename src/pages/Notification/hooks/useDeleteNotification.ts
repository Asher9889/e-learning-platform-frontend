import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNotification } from "../api/notification.api";

export const useDeleteNotification = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteNotification(id),

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