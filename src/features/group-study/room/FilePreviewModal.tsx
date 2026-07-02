import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileIcon, Music } from "lucide-react";

import type { ISharedFile } from "../hooks/use-livekit-room";
import { getPreviewType } from "../utils/file-utils";

interface FilePreviewModalProps {
  open: boolean;
  file: ISharedFile | null;
  onClose: () => void;
}

export function FilePreviewModal({
  open,
  file,
  onClose,
}: FilePreviewModalProps) {
  if (!file) return null;

  const previewType = getPreviewType(file.mimeType);

  // Height/width behave differently per type — media types get large
  // stage area, audio/none get compact centered card.
  const isCompact = previewType === "audio" || previewType === "none";

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        className={`flex flex-col w-[95vw] sm:w-full max-w-5xl p-4 sm:p-6 ${
          isCompact ? "h-auto max-h-[85vh]" : "h-[85vh] sm:h-[80vh]"
        }`}
      >
        <DialogHeader className="shrink-0">
          <DialogTitle className="truncate pr-6">{file.fileName}</DialogTitle>
        </DialogHeader>

        {previewType === "image" && (
          <div className="flex-1 min-h-0 overflow-auto rounded-lg border bg-muted flex items-center justify-center">
            <img
              src={file.dataURL}
              alt={file.fileName}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        )}

        {previewType === "pdf" && (
          <div className="flex-1 min-h-0 overflow-hidden rounded-lg border bg-muted">
            <iframe
              src={file.dataURL}
              title={file.fileName}
              className="h-full w-full"
            />
          </div>
        )}

        {previewType === "video" && (
          <div className="flex-1 min-h-0 overflow-hidden rounded-lg border bg-black flex items-center justify-center">
            <video controls className="max-h-full max-w-full">
              <source src={file.dataURL} type={file.mimeType} />
            </video>
          </div>
        )}

        {previewType === "text" && (
          <div className="flex-1 min-h-0 overflow-hidden rounded-lg border bg-background">
            <iframe
              src={file.dataURL}
              title={file.fileName}
              className="h-full w-full"
            />
          </div>
        )}

        {previewType === "audio" && (
          <div className="rounded-lg border bg-muted flex flex-col items-center justify-center gap-4 py-10 px-4 sm:px-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Music className="w-7 h-7 text-primary" />
            </div>
            <audio controls className="w-full max-w-md">
              <source src={file.dataURL} type={file.mimeType} />
            </audio>
          </div>
        )}

        {previewType === "none" && (
          <div className="rounded-lg border bg-muted flex flex-col items-center justify-center gap-3 py-14 px-4 text-center">
            <FileIcon className="w-10 h-10 text-muted-foreground" />
            <div>
              <p className="text-lg font-medium">Preview not available</p>
              <p className="text-sm text-muted-foreground mt-1">
                Download this file to view it.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}