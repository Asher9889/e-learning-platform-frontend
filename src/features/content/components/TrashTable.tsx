import { RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Material } from "../types/content.types";

interface TrashTableProps {
  materials: Material[];
  isLoading: boolean;
  onRestore: (id: string) => void;
  onPermanentDelete: (id: string) => void;
}

export function TrashTable({ materials, isLoading, onRestore, onPermanentDelete }: TrashTableProps) {
  if (isLoading) {
    return <div className="flex items-center justify-center h-48 text-muted-foreground">Loading trash...</div>;
  }

  if (materials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted ring-1 ring-foreground/5">
          <Trash2 className="h-8 w-8 text-muted-foreground/60" />
        </div>
        <div className="space-y-1">
          <p className="text-base font-semibold text-foreground">Trash is empty</p>
          <p className="text-sm text-muted-foreground">Deleted materials will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/50 border-b">
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
            <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((material) => (
            <tr key={material.id} className="border-b last:border-b-0 hover:bg-muted/30">
              <td className="px-4 py-3 font-medium">{material.title}</td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon-sm" onClick={() => onRestore(material.id)} title="Restore">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onPermanentDelete(material.id)}
                    title="Permanently Delete"
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
