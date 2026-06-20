import { useQuery } from "@tanstack/react-query";
import { getPrograms } from "../api/program.api";

export function useGetPrograms() {
  return useQuery({
    queryKey: ["programs", "list"],
    queryFn: getPrograms,
    staleTime: 5 * 60 * 1000,
  });
}
