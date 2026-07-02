import { Button } from "@/components/ui/button";

interface Props {
    unreadCount: number;
    loading?: boolean;
    onMarkAllRead: () => void;
}

const NotificationHeader = ({
    unreadCount,
    loading,
    onMarkAllRead,
}: Props) => {
    return (
        <div className="flex items-center justify-between border-b p-4">
            <div>
                <h2 className="text-sm font-semibold">
                    Notifications
                </h2>
                <p className="text-xs text-muted-foreground">
                    {unreadCount} unread
                </p>
            </div>

            {unreadCount > 0 && (
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={onMarkAllRead}
                    disabled={loading}
                >
                    Mark all read
                </Button>
            )}
        </div>
    );
};

export default NotificationHeader;