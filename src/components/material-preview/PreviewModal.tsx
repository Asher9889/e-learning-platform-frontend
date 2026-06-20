import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MaterialPreview } from "./MaterialPreview"
import type { Material } from "@/features/content/types/content.types"

interface PreviewModalProps {
  material: Material | null
  fileUrl: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PreviewModal({ material, fileUrl, open, onOpenChange }: PreviewModalProps) {
  if (!material) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b flex flex-row items-center justify-between">
          <div className="min-w-0 flex-1">
            <DialogTitle className="truncate text-base text-wrap">
              {material.file.originalFileName}
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {material.materialType} &middot; {material.file.mimeType}
            </p>
          </div>
        </DialogHeader>

        {/* Material preview */}
        <div className="overflow-y-auto max-h-[80vh]">
          <MaterialPreview
            fileUrl={fileUrl}
            mimeType={material.file.mimeType}
            fileName={material.file.originalFileName}
            materialType={material.materialType}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
