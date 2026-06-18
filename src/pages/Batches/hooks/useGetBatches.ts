import { useQuery } from "@tanstack/react-query";
import { getBatches } from "../api/batch.api";

export function useGetBatches(programId?: string) {
  return useQuery({
    queryKey: programId ? ["batches", programId] : ["batches"],
    queryFn: () => getBatches(programId || undefined),
    enabled: !!programId,
    staleTime: 5 * 60 * 1000,
  });
}
