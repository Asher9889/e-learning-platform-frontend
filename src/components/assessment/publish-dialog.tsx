import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

interface PublishModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onPublish: () => void;
}

export default function PublishModal({
  open,
  onOpenChange,
  title,
  onPublish,
}: PublishModalProps) {
  return (
    <Dialog open={open}
      onOpenChange={onOpenChange}>


      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Publish Assessment
          </DialogTitle>

          <DialogDescription>
            Are you sure you want to publish{" "}
            <strong>{title}</strong>?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline"  onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button onClick={onPublish}>
            Publish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}