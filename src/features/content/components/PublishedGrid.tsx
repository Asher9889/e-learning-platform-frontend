import { BookOpen } from "lucide-react";
import { ContentCard, ContentCardSkeleton } from "./ContentCard";
import type { Material } from "../types/content.types";
import { formatSize, getSubjectName } from "../types/content.types";

interface PublishedGridProps {
  materials: Material[];
  isLoading: boolean;
  hasFilters: boolean;
  onEdit: (material: Material) => void;
  onPreview?: (material: Material) => void;
}

export function PublishedGrid({
  materials,
  isLoading,
  hasFilters,
  onEdit,
  onPreview,
}: PublishedGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ContentCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (materials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted ring-1 ring-foreground/5">
          <BookOpen className="h-8 w-8 text-muted-foreground/60" />
        </div>
        <div className="space-y-1">
          <p className="text-base font-semibold text-foreground">No materials found</p>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            {hasFilters
              ? "Try adjusting your search or filter."
              : "No published materials yet."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
      {materials.map((material) => (
        <ContentCard
          key={material.id}
          item={{
            id: material.id,
            title: material.title,
            type: material.materialType,
            subject: getSubjectName(material.subject),
            uploadedBy: material.createdBy.name,
            uploadedAt: new Date(material.createdAt).toLocaleDateString(),
            size: formatSize(material.file.size),
          }}
          onEdit={() => onEdit(material)}
          onPreview={() => onPreview?.(material)}
        />
      ))}
    </div>
  );
}
