import { Calendar } from "lucide-react";

interface DateFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onClear: () => void;
}

export function DateFilter({ startDate, endDate, onStartDateChange, onEndDateChange, onClear }: DateFilterProps) {
  const hasFilter = startDate || endDate;

  return (
    <div className="flex items-center gap-3">
      <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
      <div className="flex items-center gap-2">
        <div className="relative">
          <label className="absolute -top-2 left-2 px-1 text-[10px] font-medium text-muted-foreground bg-background">
            From
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="h-9 w-40 rounded-lg border border-input bg-background px-3 pt-1 text-sm text-foreground shadow-xs transition-colors hover:border-accent-foreground/20 focus:border-ring focus:outline-none focus:ring-[3px] focus:ring-ring/50 [color-scheme:light] dark:[color-scheme:dark]"
          />
        </div>
        <span className="text-xs text-muted-foreground">to</span>
        <div className="relative">
          <label className="absolute -top-2 left-2 px-1 text-[10px] font-medium text-muted-foreground bg-background">
            To
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="h-9 w-40 rounded-lg border border-input bg-background px-3 pt-1 text-sm text-foreground shadow-xs transition-colors hover:border-accent-foreground/20 focus:border-ring focus:outline-none focus:ring-[3px] focus:ring-ring/50 [color-scheme:light] dark:[color-scheme:dark]"
          />
        </div>
      </div>
      {hasFilter && (
        <button
          onClick={onClear}
          className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  );
}
