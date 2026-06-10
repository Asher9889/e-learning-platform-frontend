import { useQuery } from "@tanstack/react-query";

import { getTeachers } from "../api/teacher.api";


export function useTeachers() {
  const query = useQuery({
    queryKey: ["teachers"],
    queryFn: getTeachers,
    staleTime: 5 * 60 * 1000,
      
  });
  return query;
}