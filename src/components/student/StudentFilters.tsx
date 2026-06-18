import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { Card, CardContent } from "#components/ui/card";
import { useGetPrograms } from "@/pages/Programs/hooks/useGetPrograms";
import { useGetBatches } from "@/pages/Batches/hooks/useGetBatches";


const statusOptions = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Suspended", value: "SUSPENDED" },
];

interface StudentFiltersProps {
  programId: string;
  batchId: string;
  status: string;
  search: string;
  onProgramChange: (value: string) => void;
  onBatchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onClear: () => void;
}

export function StudentFilters({
  programId,
  batchId,
  status,
  search,
  onProgramChange,
  onBatchChange,
  onStatusChange,
  onSearchChange,
  onClear,
}: StudentFiltersProps) {
  const { data: programData } = useGetPrograms();
  const { data: batchesData } = useGetBatches(programId || undefined);

  const programs = programData?.programs || [];
  const batches = batchesData?.batches || [];

  const hasFilters = programId || batchId || status || search;

  return (
    <Card size="sm">
      <CardContent>
        <div className="flex flex-wrap items-end gap-3">
          <div className="w-full sm:w-[180px] space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Program</label>
            <Select value={programId} onValueChange={onProgramChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Programs" />
              </SelectTrigger>
              <SelectContent>
                {programs.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-[180px] space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Batch</label>
            <Select value={batchId} onValueChange={onBatchChange} disabled={!programId}>
              <SelectTrigger>
                <SelectValue placeholder={programId ? "Select Batch" : "Select Program first"} />
              </SelectTrigger>
              <SelectContent>
                {batches.map((b) => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-[150px] space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Status</label>
            <Select value={status} onValueChange={onStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:flex-1 min-w-[200px] space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Search</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or roll number..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={onClear} className="mb-0.5">
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
