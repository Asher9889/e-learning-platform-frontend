import { useQuery } from "@tanstack/react-query";
import { getUnreadCount } from "../api/notification.api";

export const useUnreadCount = (enabled: boolean = true) => {
    return useQuery({
        queryKey: ["notification-unread-count"],
        queryFn: getUnreadCount,
        enabled,
        staleTime: 1000 * 30, // 30 sec
        refetchInterval: 1000 * 60, // auto refresh every 1 min
    });
};