import { useQuery } from "@tanstack/react-query";
import { getStudents } from "../api/student.api";
import type { StudentFilters } from "../schema/student.schema";

export function useStudents(filters?: StudentFilters) {
  const enabled = !!(filters?.programId && filters?.batchId);

  return useQuery({
    queryKey: ["students", filters],
    queryFn: () => getStudents(filters),
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}
