import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import type { TRoomFilter } from "../types/group-study.types";

interface RoomFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  filter: TRoomFilter;
  onFilterChange: (value: TRoomFilter) => void;
}

export function RoomFilters({ search, onSearchChange, filter, onFilterChange }: RoomFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search rooms by name or subject..."
          className="pl-8"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <Select value={filter} onValueChange={(value) => onFilterChange(value as TRoomFilter)}>
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Rooms</SelectItem>
          <SelectItem value="MY_ROOMS">My Rooms</SelectItem>
          <SelectItem value="JOINED">Joined</SelectItem>
          <SelectItem value="LIVE">Live Now</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
