// StudentEnrollDialog.tsx

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import StudentEnrollForm from "./StudentEnrollForm";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentEnrollDialog({
  open,
  onOpenChange,
}: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>
            Enroll Student
          </DialogTitle>
        </DialogHeader>

        {/* Yaha tumhara RHF Form */}
        <div>
          <StudentEnrollForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}