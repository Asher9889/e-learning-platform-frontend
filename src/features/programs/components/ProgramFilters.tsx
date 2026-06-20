import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const programTypes = [
  "All Programs",
  "School",
  "Diploma",
  "Undergraduate",
  "Postgraduate",
  "Professional Certification",
];

const durations = [
  "All",
  "3 Months",
  "6 Months",
  "1 Year",
  "2 Years",
  "3 Years",
  "4 Years",
];

const sortOptions = [
  "Newest",
  "Popular",
  "Lowest Fee",
  "Highest Fee",
  "A-Z",
];

interface ProgramFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  durationFilter: string;
  onDurationChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  onReset: () => void;
}

export function ProgramFilters({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  durationFilter,
  onDurationChange,
  sortBy,
  onSortChange,
  onReset,
}: ProgramFiltersProps) {
  return (
    <div className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search programs..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-10 pl-9"
            />
          </div>
          <Select value={categoryFilter} onValueChange={onCategoryChange}>
            <SelectTrigger className="h-10 w-full sm:w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {programTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={durationFilter} onValueChange={onDurationChange}>
            <SelectTrigger className="h-10 w-full sm:w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {durations.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="h-10 w-full sm:w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="icon"
            onClick={onReset}
            className="h-10 w-10 shrink-0"
            title="Reset Filters"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
