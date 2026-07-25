import { Clock } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { getInitials } from "@/utils/helper";

export function StageWaiting() {
  const presenter = useAppSelector((s) => s.liveClass.presenter);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-5 p-6">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-violet-400 flex items-center justify-center text-white font-bold text-2xl border-4 border-violet-300 shadow-lg shadow-violet-500/20">
          {presenter?.profileImage ? (
            <img
              src={presenter.profileImage}
              alt={presenter.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            getInitials(presenter?.name || "")
          )}
        </div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
        </div>
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-slate-700">
          Waiting for {presenter?.name || "teacher"} to start the class
        </p>
        <p className="text-xs text-slate-400">
          The class will begin shortly
        </p>
      </div>
    </div>
  );
}
