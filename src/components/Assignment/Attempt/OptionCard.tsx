import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type OptionCardProps = {
  option: string;
  selected: boolean;
  disabled?: boolean;
  onSelect: (option: string) => void;
};

export function OptionCard({
  option,
  selected,
  disabled = false,
  onSelect,
}: OptionCardProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(option)}
      className={cn(
        "flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all duration-200",
        "hover:border-primary hover:bg-primary/5",
        "focus:outline-none focus:ring-2 focus:ring-primary/20",
        selected &&
          "border-primary bg-primary/10 ring-1 ring-primary",
        disabled &&
          "cursor-not-allowed opacity-60 hover:border-border hover:bg-background"
      )}
    >
      <div
        className={cn(
          "mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border transition-all",
          selected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground"
        )}
      >
        {selected && <CheckCircle2 className="h-4 w-4" />}
      </div>

      <span className="flex-1 text-sm leading-6">
        {option}
      </span>
    </button>
  );
}