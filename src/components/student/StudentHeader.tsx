// StudentHeader.tsx

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Props {
  onAddStudent: () => void;
}

export function StudentHeader({
  onAddStudent,
}: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">
          Students
        </h1>

        <p className="text-muted-foreground">
          Manage enrolled students
        </p>
      </div>

      <Button onClick={onAddStudent}>
        <Plus className="h-4 w-4 mr-2" />
        Add Student
      </Button>
    </div>
  );
}