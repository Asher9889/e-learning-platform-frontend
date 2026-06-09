// StudentHeader.tsx

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Props {
  onAddStudent: () => void;
}

export function TeacherHeader({
  onAddStudent,
}: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">
          Teachers
        </h1>

        <p className="text-muted-foreground">
          Manage enrolled teachers
        </p>
      </div>

      <Button onClick={onAddStudent}>
        <Plus className="h-4 w-4 mr-2" />
        Add Teacher
      </Button>
    </div>
  );
}