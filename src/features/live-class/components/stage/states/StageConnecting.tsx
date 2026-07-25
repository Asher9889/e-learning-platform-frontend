import { Loader2 } from "lucide-react";

export function StageConnecting() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-6">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-slate-200" />
        <Loader2 className="absolute inset-0 w-16 h-16 animate-spin text-violet-600" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-slate-700">
          Preparing classroom...
        </p>
        <p className="text-xs text-slate-400">
          Establishing connection
        </p>
      </div>
    </div>
  );
}
