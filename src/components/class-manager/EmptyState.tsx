import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

interface EmptyStateProps {
  onCreateClass: () => void;
}

export function EmptyState({ onCreateClass }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-6">
        <GraduationCap className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        No Classes Yet
      </h3>
      <p className="text-muted-foreground max-w-sm mb-6">
        Get started by creating your first class. You can add sections and manage student strength easily.
      </p>
      <Button onClick={onCreateClass} size="lg" className="gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Create First Class
      </Button>
    </div>
  );
}
