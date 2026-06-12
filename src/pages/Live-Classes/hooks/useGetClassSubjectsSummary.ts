import { useQuery } from "@tanstack/react-query";
import { getClassSubjectsSummary } from "../api/live.classes.api";


export function useGetClassSubjectsSummary(grade?: string,enabled: boolean) {
  return useQuery({
    queryKey: ["class-subjects-summary", grade],
    queryFn: () => getClassSubjectsSummary(grade!),
    enabled: enabled && Boolean(grade),
  });
}