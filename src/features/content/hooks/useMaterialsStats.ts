import { useQuery } from "@tanstack/react-query";
import { getMaterialsStats } from "../api/content.api";

export function useMaterialsStats() {
  return useQuery({
    queryKey: ["materials", "stats"],
    queryFn: () => getMaterialsStats(),
  });
}
