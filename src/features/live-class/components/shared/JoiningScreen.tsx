import { Video, Loader2 } from "lucide-react";
import type { JoinStep } from "../../hooks/useLiveClassRoom";

const stepConfig: Record<JoinStep, { label: string; sublabel: string }> = {
  fetching_session: {
    label: "Fetching session details...",
    sublabel: "Verifying your class access",
  },
  fetching_token: {
    label: "Obtaining access token...",
    sublabel: "Preparing your connection",
  },
  ready: {
    label: "Connecting to classroom...",
    sublabel: "Setting up your room",
  },
  error: {
    label: "Connection failed",
    sublabel: "Something went wrong",
  },
};

interface JoiningScreenProps {
  step: JoinStep;
}

export function JoiningScreen({ step }: JoiningScreenProps) {
  const config = stepConfig[step];

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="flex flex-col items-center gap-6 px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600 shadow-lg shadow-violet-600/20">
          <Video className="h-7 w-7 text-white" />
        </div>

        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            Joining Classroom
          </h1>
          <p className="text-sm text-slate-500">
            {config.sublabel}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Loader2 className="h-4 w-4 animate-spin text-violet-600" />
          <span className="text-sm font-medium text-slate-600">
            {config.label}
          </span>
        </div>
      </div>
    </div>
  );
}
