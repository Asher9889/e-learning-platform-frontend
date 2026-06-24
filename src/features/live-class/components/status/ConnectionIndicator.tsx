import { useConnectionState } from "@livekit/components-react";
import { ConnectionState as CS } from "livekit-client";
import { Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const stateConfig: Record<
  string,
  { label: string; icon: typeof Wifi; color: string }
> = {
  [CS.Connected]: {
    label: "Connected",
    icon: Wifi,
    color: "text-green-500",
  },
  [CS.Connecting]: {
    label: "Connecting...",
    icon: Wifi,
    color: "text-yellow-500",
  },
  [CS.Reconnecting]: {
    label: "Reconnecting...",
    icon: Wifi,
    color: "text-yellow-500",
  },
  [CS.Disconnected]: {
    label: "Disconnected",
    icon: WifiOff,
    color: "text-destructive",
  },
};

export function ConnectionIndicator() {
  const connectionState = useConnectionState();
  console.log(connectionState,"connectionState")
  const config = stateConfig[connectionState] ?? stateConfig[CS.Disconnected];
  const Icon = config.icon;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-background/60 backdrop-blur-sm border",
            config.color
          )}
        >
          <Icon className="w-3 h-3" />
          <span className="hidden sm:inline">{config.label}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        Connection: {config.label}
      </TooltipContent>
    </Tooltip>
  );
}
