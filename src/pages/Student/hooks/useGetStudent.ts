import { useQuery } from "@tanstack/react-query";
import { getStudent } from "../api/student.api";

export function useGetStudent(id: string) {
  return useQuery({
    queryKey: ["student", id],
    queryFn: () => getStudent(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
