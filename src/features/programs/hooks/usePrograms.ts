import { useMemo } from "react";
import { programs } from "../data/programs";

interface UseProgramsFilters {
  searchQuery: string;
  categoryFilter: string;
  durationFilter: string;
  sortBy: string;
}

export function usePrograms(filters: UseProgramsFilters) {
  const filtered = useMemo(() => {
    let result = [...programs];

    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (filters.categoryFilter !== "All Programs") {
      result = result.filter(
        (p) => p.category === filters.categoryFilter
      );
    }

    if (filters.durationFilter !== "All") {
      result = result.filter((p) => p.duration === filters.durationFilter);
    }

    switch (filters.sortBy) {
      case "Popular":
        result = result.sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1));
        break;
      case "Lowest Fee":
        result = result.sort((a, b) => {
          const aNum = parseInt(a.fee.replace(/[^0-9]/g, ""));
          const bNum = parseInt(b.fee.replace(/[^0-9]/g, ""));
          return aNum - bNum;
        });
        break;
      case "Highest Fee":
        result = result.sort((a, b) => {
          const aNum = parseInt(a.fee.replace(/[^0-9]/g, ""));
          const bNum = parseInt(b.fee.replace(/[^0-9]/g, ""));
          return bNum - aNum;
        });
        break;
      case "A-Z":
        result = result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return result;
  }, [filters]);

  const featured = useMemo(
    () => programs.filter((p) => p.featured),
    []
  );

  const isLoading = false;

  return {
    programs: filtered,
    featured,
    isLoading,
    totalCount: programs.length,
  };
}
