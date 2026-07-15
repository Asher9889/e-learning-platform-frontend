import { BookOpenCheck } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20">
      <BookOpenCheck className="mb-5 h-14 w-14 text-muted-foreground" />

      <h3 className="text-lg font-semibold">
        No Question Papers Found
      </h3>

      <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
        There are no published question papers matching your search.
      </p>
    </div>
  );
}