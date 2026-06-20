import { SearchX, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyProgramsProps {
  onResetFilters: () => void;
}

export function EmptyPrograms({ onResetFilters }: EmptyProgramsProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <SearchX className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold">No programs found</h2>
        <p className="mt-2 text-muted-foreground">
          Try adjusting your filters or search criteria.
        </p>
        <Button variant="outline" className="mt-6 gap-2" onClick={onResetFilters}>
          <RotateCcw className="h-4 w-4" />
          Reset Filters
        </Button>
      </div>
    </section>
  );
}
