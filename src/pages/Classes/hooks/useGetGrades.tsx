import { useQuery } from "@tanstack/react-query";
import { getGrades } from "../api/grades.api";

export function useGetGrades() {
  const query = useQuery({
    queryKey: ["grades"],
    queryFn: getGrades,
    staleTime: 5 * 60 * 1000,
      
  });
  return query;
}