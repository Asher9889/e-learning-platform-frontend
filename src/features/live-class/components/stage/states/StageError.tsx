import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StageErrorProps {
  onRetry: () => void;
}

export function StageError({ onRetry }: StageErrorProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-5 p-6">
      <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
        <AlertTriangle className="w-7 h-7 text-red-500" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-slate-700">
          Unable to receive video
        </p>
        <p className="text-xs text-slate-400 max-w-xs">
          The connection was lost. Please try reconnecting.
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onRetry}
        className="gap-2"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Reconnect
      </Button>
    </div>
  );
}
