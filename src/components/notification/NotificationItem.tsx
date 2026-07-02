import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import type { TNotification } from "@/pages/Notification/schema/notification.schema";


interface Props {
    notification: TNotification;
    onClick: (notification: TNotification) => void;
}

const NotificationItem = ({
    notification,
    onClick,
}: Props) => {
    return (
        <button
            onClick={() => onClick(notification)}
            className={cn(
                "flex w-full gap-3 border-b p-4 text-left hover:bg-muted/40",
                !notification.isRead && "bg-primary/5"
            )}
        >
            <div className="relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <Bell className="h-4 w-4 text-primary" />
                </div>

                {!notification.isRead && (
                    <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-primary" />
                )}
            </div>

            <div className="flex-1">
                <div className="flex justify-between">
                    <p className="text-sm font-medium">
                        {notification.title}
                    </p>

                    {!notification.isRead && (
                        <span className="text-[10px] text-primary">
                            New
                        </span>
                    )}
                </div>

                <p className="text-xs text-muted-foreground">
                    {notification.body}
                </p>

                <p className="mt-1 text-[11px] text-muted-foreground">
                    {formatDistanceToNow(
                        new Date(notification.createdAt),
                        { addSuffix: true }
                    )}
                </p>
            </div>
        </button>
    );
};

export default NotificationItem;