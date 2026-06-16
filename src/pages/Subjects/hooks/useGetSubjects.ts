import { useQuery } from "@tanstack/react-query";
import { getSubjects } from "../api/subject.api";

export function useGetSubjects() {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
    staleTime: 5 * 60 * 1000,
  });
}
