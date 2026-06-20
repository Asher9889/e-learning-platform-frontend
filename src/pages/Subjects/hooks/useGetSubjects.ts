import { useQuery } from "@tanstack/react-query";
import { getSubjects } from "../api/subject.api";

export function useGetSubjects(programId?: string) {
  return useQuery({
    queryKey: ["subjects", "list", programId],
    queryFn: () => getSubjects(programId || undefined),
    enabled: programId !== "",
    staleTime: 5 * 60 * 1000,
  });
}
