import { BellOff } from "lucide-react";

const NotificationEmpty = () => {
    return (
        <div className="flex h-[300px] flex-col items-center justify-center text-center">
            <BellOff className="h-10 w-10 text-muted-foreground" />
            <p className="mt-2 text-sm font-medium">
                No notifications
            </p>
            <p className="text-xs text-muted-foreground">
                You're all caught up
            </p>
        </div>
    );
};

export default NotificationEmpty;