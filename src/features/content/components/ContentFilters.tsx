import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { MATERIAL_TYPES } from "@/constants/material/material.constant";

const typeOptions = [
  { label: "All Types", value: "all" },
  ...MATERIAL_TYPES.map((t) => ({ label: t.label, value: t.value })),
];

interface ContentFiltersProps {
  programId: string;
  subjectId: string;
  type: string;
  search: string;
  programs: { id: string; name: string }[];
  subjects: { id: string; name: string }[];
  onProgramChange: (v: string) => void;
  onSubjectChange: (v: string) => void;
  onTypeChange: (v: string) => void;
  onSearchChange: (v: string) => void;
  onClear: () => void;
  isVisible: boolean;
}

export function ContentFilters({
  programId,
  subjectId,
  type,
  search,
  programs,
  subjects,
  onProgramChange,
  onSubjectChange,
  onTypeChange,
  onSearchChange,
  onClear,
  isVisible
}: ContentFiltersProps) {
  const hasFilters = programId || subjectId || (type && type !== "all") || search;

  return (
    <div className="flex flex-wrap items-end gap-3">

      <div className="w-full sm:w-[180px] space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Program</label>
        <Select value={programId || "all"} disabled={!isVisible} onValueChange={(v) => onProgramChange(v === "all" ? "" : v)}>
          <SelectTrigger>
            <SelectValue placeholder="All Programs" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Programs</SelectItem>
            {programs.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full sm:w-[180px] space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Subject</label>
        <Select
          value={subjectId || "all"}
          onValueChange={(v) => onSubjectChange(v === "all" ? "" : v)}
          disabled={!programId}
        >
          <SelectTrigger>
            <SelectValue placeholder={programId ? "Select Subject" : "Select Program first"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full sm:w-[150px] space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Type</label>
        <Select value={type || "all"} onValueChange={onTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            {typeOptions.map((t) => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full sm:flex-1 min-w-[200px] space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Search</label>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {hasFilters && (
        <button
          onClick={onClear}
          className="mb-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
          Clear
        </button>
      )}
    </div>
  );
}
