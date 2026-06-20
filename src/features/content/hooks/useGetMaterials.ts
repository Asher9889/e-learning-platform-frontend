import { useQuery } from "@tanstack/react-query";
import { getMaterials } from "../api/content.api";
import type { MaterialFilters } from "../types/content.types";

export function useGetMaterials(filters: MaterialFilters) {
  return useQuery({
    queryKey: ["materials", "list", filters],
    queryFn: () => getMaterials(filters),
    enabled: !!filters.status,
  });
}
