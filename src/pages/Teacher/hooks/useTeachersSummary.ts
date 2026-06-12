import { useQuery } from "@tanstack/react-query";

import {  getTeachersSummary } from "../api/teacher.api";


export function useTeachersSummary() {
  const query = useQuery({
    queryKey: ["teachers-summary"],
    queryFn: getTeachersSummary,
    staleTime: 5 * 60 * 1000,
      
  });
  return query;
}