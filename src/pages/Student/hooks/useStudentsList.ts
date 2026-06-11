import { useQuery } from "@tanstack/react-query";
import { getStudents } from "../api/student.api";



export function useStudents() {
  const query = useQuery({
    queryKey: ["students"],
    queryFn: getStudents,
    staleTime: 5 * 60 * 1000,
      
  });
  return query;
}