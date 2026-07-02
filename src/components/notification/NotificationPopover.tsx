import { useState } from "react";
import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";


import NotificationHeader from "./NotificationHeader";
import NotificationItem from "./NotificationItem";
import NotificationSkeleton from "./NotificationSkeleton";
import NotificationEmpty from "./NotificationEmpty";
import NotificationFooter from "./NotificationFooter";
import { useNotifications } from "@/pages/Notification/hooks/useNotification";
import { useUnreadCount } from "@/pages/Notification/hooks/useUnreadCount";
import { useMarkAllAsRead } from "@/pages/Notification/hooks/useMarkAllRead";
import { useMarkAsRead } from "@/pages/Notification/hooks/useMarkAsRead";
import type { TNotification } from "@/pages/Notification/schema/notification.schema";
import { useAppSelector } from "@/store/hooks";


const NotificationPopover = () => {
    const [open, setOpen] = useState(false);

    const { data, isLoading } =  useNotifications(1, 20, open);
    const { data: unreadData } = useUnreadCount(open);

    const { mutate: markAllRead, isPending } =
        useMarkAllAsRead();

    const { mutate: markAsRead } = useMarkAsRead();
    const {unreadCount:count} = useAppSelector((state) =>  state.notification)
    const notifications =
        data?.notifications ?? [];


        console.log("popover159")
    const unreadCount =
        unreadData?.unreadCount > 0 ? unreadData?.unreadCount  :  count ?? 0;
console.log(unreadCount,"data?.data?.notifications 1233333333333333333",count)

    const handleNotificationClick = (
        notification: TNotification
    ) => {
        if (!notification.isRead) {
            markAsRead(notification.id);
        }

        // Future Phase (routing)
        console.log("Navigate:", notification.entityId);

        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            {/* Bell Button */}
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                >
                    <Bell className="h-5 w-5" />

                    {unreadCount > 0 && (
                        // <Badge className="absolute right-1 top-1 h-2 w-2 px-1 text-[10px]">
                        //     {unreadCount > 99
                        //         ? "99+"
                        //         : unreadCount}
                        // </Badge>
                        <span className="absolute right-2 top-2 h-2 w-2 animate-pulse rounded-full bg-primary ring-2 ring-background" />
                    )}
                </Button>
            </PopoverTrigger>

            {/* Popover Content */}
            <PopoverContent
                align="end"
                className="w-[380px] md:w-[430px] p-0"
            >
                {/* Header */}
                <NotificationHeader
                    unreadCount={unreadCount}
                    loading={isPending}
                    onMarkAllRead={() => markAllRead()}
                />

                {/* Body */}
                {isLoading ? (
                    <NotificationSkeleton />
                ) : notifications.length === 0 ? (
                    <NotificationEmpty />
                ) : (
                    <>
                        <ScrollArea className="max-h-[420px]">
                            {notifications.map(
                                (notification :TNotification) => (
                                    <NotificationItem
                                        key={notification.id}
                                        notification={
                                            notification
                                        }
                                        onClick={
                                            handleNotificationClick
                                        }
                                    />
                                )
                            )}
                        </ScrollArea>

                        <NotificationFooter
                            onViewAll={() => {
                                console.log(
                                    "Navigate to all notifications page"
                                );
                            }}
                        />
                    </>
                )}
            </PopoverContent>
        </Popover>
    );
};

export default NotificationPopover;