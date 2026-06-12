import { useQuery } from "@tanstack/react-query";
import { getClassSubjectsSummary } from "../api/live.classes.api";


export function useGetClassSubjectsSummary(enabled: boolean,grade?: string,) {
  return useQuery({
    queryKey: ["class-subjects-summary", grade],
    queryFn: () => getClassSubjectsSummary(grade!),
    enabled: enabled && Boolean(grade),
  });
}