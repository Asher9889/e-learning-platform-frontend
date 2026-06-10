import { useQuery } from "@tanstack/react-query";
import { getClasses } from "../api/classes.api";
export function useGetClasses() {
  const query = useQuery({
    queryKey: ["classes"],
    queryFn: getClasses,
    staleTime: 5 * 60 * 1000,
      
  });
  return query;
}