import { FileText } from "lucide-react";

import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onCreate?: () => void;
}

export function EmptyState({
  onCreate,
}: EmptyStateProps) {
  return (
    <div
      className="
      flex
      flex-col
      items-center
      justify-center
      py-20
      text-center
    "
    >
      <div
        className="
        mb-4
        rounded-full
        bg-muted
        p-4
      "
      >
        <FileText className="h-8 w-8 text-muted-foreground" />
      </div>

      <h3 className="text-lg font-semibold">
        No assessments found
      </h3>

      <p className="mt-2 text-sm text-muted-foreground">
        Create your first
        assessment to get
        started.
      </p>

      <Button
        className="mt-6"
        onClick={onCreate}
      >
        Create Assessment
      </Button>
    </div>
  );
}