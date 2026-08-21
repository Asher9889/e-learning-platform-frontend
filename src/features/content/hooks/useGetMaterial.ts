import { useQuery } from "@tanstack/react-query";
import { getMaterial } from "../api/content.api";

export function useGetMaterial(id: string) {
  return useQuery({
    queryKey: ["materials", "detail", id],
    queryFn: () => getMaterial(id),
    enabled: !!id,
  });
}
