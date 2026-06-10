import type{ Class } from "@/pages/Classes/types/index";
import { ClassCard } from "./ClassCard";
import { EmptyState } from "./EmptyState";

interface ClassListProps {
  classes: Class[];
  onEditClass: (classData: Class) => void;
  onDeleteClass: (classData: Class) => void;
  onCreateClass: () => void;
  isLoading?: boolean;
}

export function ClassList({
  classes,
  onEditClass,
  onDeleteClass,
  onCreateClass,
  isLoading = false,
}: ClassListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-xl border bg-card p-6 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted" />
              <div className="space-y-2 flex-1">
                <div className="h-5 w-1/3 bg-muted rounded" />
                <div className="h-3 w-1/4 bg-muted rounded" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-12 bg-muted rounded-lg" />
              <div className="h-12 bg-muted rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (classes.length === 0) {
    return <EmptyState onCreateClass={onCreateClass} />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {classes.map((classData) => (
        <ClassCard
          key={classData.id}
          classData={classData}
          onEdit={onEditClass}
          onDelete={onDeleteClass}
        />
      ))}
    </div>
  );
}
