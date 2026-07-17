import { useQuery } from "@tanstack/react-query";

import { getTeacherById } from "../api/teacher.api";

export function useTeacher(
  id: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["teacher", id],
    queryFn: () => getTeacherById(id),
    enabled: options?.enabled ?? Boolean(id),
    staleTime: 5 * 60 * 1000,
  });
}