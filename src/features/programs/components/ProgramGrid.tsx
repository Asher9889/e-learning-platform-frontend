import type { Program } from "../types/program.types";
import { ProgramCard } from "./ProgramCard";
import { EmptyPrograms } from "./EmptyPrograms";

interface ProgramGridProps {
  programs: Program[];
  onViewDetails: (slug: string) => void;
  onApplyNow: (program: Program) => void;
  onResetFilters: () => void;
  isLoading: boolean;
}

function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-card">
      <div className="aspect-[16/9] animate-pulse bg-muted" />
      <div className="flex flex-col gap-3 p-5">
        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="space-y-1.5">
          <div className="h-3 w-full animate-pulse rounded bg-muted" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="h-3 w-16 animate-pulse rounded bg-muted" />
          <div className="h-3 w-16 animate-pulse rounded bg-muted" />
          <div className="h-3 w-24 animate-pulse rounded bg-muted col-span-2" />
        </div>
        <div className="h-6 w-24 animate-pulse rounded bg-muted" />
      </div>
      <div className="grid grid-cols-2 gap-2 p-5 pt-0">
        <div className="h-9 animate-pulse rounded-md bg-muted" />
        <div className="h-9 animate-pulse rounded-md bg-muted" />
      </div>
    </div>
  );
}

export function ProgramGrid({
  programs,
  onViewDetails,
  onApplyNow,
  onResetFilters,
  isLoading,
}: ProgramGridProps) {
  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (programs.length === 0) {
    return <EmptyPrograms onResetFilters={onResetFilters} />;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">All Programs</h2>
        <p className="text-muted-foreground">
          Showing {programs.length} program{programs.length !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {programs.map((program) => (
          <ProgramCard
            key={program.id}
            program={program}
            onViewDetails={onViewDetails}
            onApplyNow={onApplyNow}
          />
        ))}
      </div>
    </section>
  );
}
