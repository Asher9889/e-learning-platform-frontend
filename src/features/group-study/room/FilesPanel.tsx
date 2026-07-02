import { Upload } from "lucide-react";
import type { ISharedFile } from "../hooks/use-livekit-room";
import { FileCard } from "./FileCard";

interface FilesPanelProps {
  files: ISharedFile[];
  onUpload: (file: File) => void;
}

export function FilesPanel({ files, onUpload }: FilesPanelProps) {
  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onUpload(file);
    e.target.value = "";
  };

  return (
    <div className="flex h-full flex-col bg-muted/20">
      <div className="border-b bg-background p-4">
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed py-6 text-center transition-colors hover:border-primary/50 hover:bg-primary/5">
          <Upload className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium">Click to upload a file</span>
          <span className="text-xs text-muted-foreground">
            Shared with everyone in the room
          </span>
          <input type="file" onChange={handleSelect} className="hidden" />
        </label>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {files.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center gap-1 mt-4">
            <p className="text-sm text-muted-foreground">No shared files</p>
            <p className="text-xs text-muted-foreground/70">
              Files shared in this room will show up here
            </p>
          </div>
        )}

        {files.map((file) => (
          <FileCard key={file.id} file={file} />
        ))}
      </div>
    </div>
  );
}