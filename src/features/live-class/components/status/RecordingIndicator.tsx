import { useAppSelector } from "@/store/hooks";
import { Circle } from "lucide-react";

export function RecordingIndicator() {
  const isRecording = useAppSelector((state) => state.liveClass.isRecording);

  if (!isRecording) return null;

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20">
      <Circle className="w-2.5 h-2.5 fill-destructive animate-pulse" />
      <span className="hidden sm:inline">Recording</span>
    </div>
  );
}
