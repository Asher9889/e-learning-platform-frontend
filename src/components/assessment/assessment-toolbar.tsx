import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AssessmentToolbarProps {
  search: string;

  status: string;

  onSearchChange: (
    value: string
  ) => void;

  onStatusChange: (
    value: string
  ) => void;
}

export function AssessmentToolbar({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: AssessmentToolbarProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:max-w-sm">
        <Search
          className="
          absolute
          left-3
          top-1/2
          h-4
          w-4
          -translate-y-1/2
          text-muted-foreground
        "
        />

        <Input
          value={search}
          placeholder="Search assessments..."
          className="pl-9"
          onChange={(e) =>
            onSearchChange(
              e.target.value
            )
          }
        />
      </div>

      <Select
        value={status}
        onValueChange={
          onStatusChange
        }
      >
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ALL">
            All Status
          </SelectItem>

          <SelectItem value="DRAFT">
            Draft
          </SelectItem>

          <SelectItem value="PUBLISHED">
            Published
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}