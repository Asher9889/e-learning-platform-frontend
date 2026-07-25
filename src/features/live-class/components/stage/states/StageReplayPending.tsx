import { Play } from "lucide-react";

export function StageReplayPending() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-5 p-6">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
        <Play className="w-8 h-8 text-white ml-1" fill="white" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-slate-700">
          Preparing replay session
        </p>
        <p className="text-xs text-slate-400">
          The replay stream is starting soon
        </p>
      </div>
    </div>
  );
}
