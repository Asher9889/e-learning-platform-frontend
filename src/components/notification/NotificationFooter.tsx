import { Button } from "@/components/ui/button";

interface Props {
    onViewAll: () => void;
}

const NotificationFooter = ({ onViewAll }: Props) => {
    return (
        <div className="border-t p-2">
            <Button
                variant="ghost"
                className="w-full"
                onClick={onViewAll}
            >
                View all notifications
            </Button>
        </div>
    );
};

export default NotificationFooter;