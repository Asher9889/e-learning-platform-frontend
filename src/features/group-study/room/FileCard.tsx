import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";

import type { ISharedFile } from "../hooks/use-livekit-room";
import {
  canPreview,
  formatFileSize,
  getFileIcon,
  getPreviewType,
} from "../utils/file-utils";
import { FilePreviewModal } from "./FilePreviewModal";

interface FileCardProps {
  file: ISharedFile;
}

export function FileCard({ file }: FileCardProps) {
  const [previewOpen, setPreviewOpen] = useState(false);

  const Icon = getFileIcon(file.mimeType);
  const previewType = getPreviewType(file.mimeType);

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = file.dataURL;
    a.download = file.fileName;
    a.click();
  };

  return (
    <>
      <div className="group rounded-xl border bg-background p-3.5 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex gap-3">
          {previewType === "image" ? (
            <img
              src={file.dataURL}
              alt={file.fileName}
              className="h-16 w-16 shrink-0 rounded-lg border object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-7 w-7 text-primary" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">
              {file.fileName}
            </div>

            <div className="mt-0.5 text-xs text-muted-foreground truncate">
              Shared by {file.senderName}
            </div>

            <div className="mt-0.5 text-xs text-muted-foreground/70">
              {formatFileSize(file.size)}
            </div>

            <div className="mt-2.5 flex flex-wrap gap-2">
              {canPreview(file.mimeType) && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2.5 text-xs"
                  onClick={() => setPreviewOpen(true)}
                >
                  <Eye className="mr-1.5 h-3.5 w-3.5" />
                  Preview
                </Button>
              )}

              <Button
                size="sm"
                className="h-7 px-2.5 text-xs"
                onClick={handleDownload}
              >
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>

      <FilePreviewModal
        open={previewOpen}
        file={file}
        onClose={() => setPreviewOpen(false)}
      />
    </>
  );
}