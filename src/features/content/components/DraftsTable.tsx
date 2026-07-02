import { useState } from "react";
import { BookOpen, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Material } from "../types/content.types";
import { getMaterialFileUrl } from "@/components/material-preview/MaterialPreview";
import { PreviewModal } from "@/components/material-preview/PreviewModal";

const TYPE_LABELS: Record<string, string> = {
  VIDEO: "Video",
  PDF: "PDF",
  DOCUMENT: "Document",
  IMAGE: "Image",
  AUDIO: "Audio",
};

interface DraftsTableProps {
  materials: Material[];
  isLoading: boolean;
  onCompleteDetails: (material: Material) => void;
}

export function DraftsTable({
  materials,
  isLoading,
  onCompleteDetails,
}: DraftsTableProps) {
  const [previewMaterial, setPreviewMaterial] = useState<Material | null>(null);

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center text-muted-foreground">
        Loading drafts...
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
          <p className="text-base font-semibold text-foreground">
            No draft materials
          </p>
          <p className="text-sm text-muted-foreground">
            Uploaded files that need metadata will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Title
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Type
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Uploaded By
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Upload Date
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {materials.map((material) => (
                <tr
                  key={material.id}
                  className="border-b last:border-b-0 hover:bg-muted/30"
                >
                  <td className="px-4 py-3 font-medium">
                    {material.title}
                  </td>

                  <td className="px-4 py-3 text-muted-foreground">
                    {TYPE_LABELS[material.materialType] ||
                      material.materialType}
                  </td>

                  <td className="px-4 py-3 text-muted-foreground">
                    {material.createdBy.name}
                  </td>

                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(material.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                      Draft
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        title="Preview"
                        onClick={() => setPreviewMaterial(material)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onCompleteDetails(material)}
                      >
                        Complete Details
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PreviewModal
        material={previewMaterial}
        fileUrl={
          previewMaterial
            ? getMaterialFileUrl(previewMaterial.objectKey)
            : ""
        }
        open={!!previewMaterial}
        onOpenChange={(open) => {
          if (!open) {
            setPreviewMaterial(null);
          }
        }}
      />
    </>
  );
}