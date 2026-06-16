import { useQuery } from "@tanstack/react-query";
import { getBatches } from "../api/batch.api";

export function useGetBatches() {
  return useQuery({
    queryKey: ["batches"],
    queryFn: getBatches,
    staleTime: 5 * 60 * 1000,
  });
}
