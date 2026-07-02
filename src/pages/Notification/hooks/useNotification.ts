import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../api/notification.api";

export const useNotifications = (page: number, limit: number, enabled: boolean = true)  => {
    return useQuery({
        queryKey: ["notifications", page, limit],
        queryFn: () => getNotifications(page, limit),
        enabled,
        staleTime: 1000 * 60, // 1 min
    });
};