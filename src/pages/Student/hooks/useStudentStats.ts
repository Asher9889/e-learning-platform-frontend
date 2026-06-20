import { useQuery } from "@tanstack/react-query";
import { getStudentStats } from "../api/student.api";

export function useStudentStats() {
  return useQuery({
    queryKey: ["student-stats"],
    queryFn: getStudentStats,
    staleTime: 5 * 60 * 1000,
  });
}
