import { Loader2 } from "lucide-react";

export function StageBuffering() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-6">
      <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-slate-700">
          Connecting video stream...
        </p>
        <p className="text-xs text-slate-400">
          Receiving media from presenter
        </p>
      </div>
    </div>
  );
}
