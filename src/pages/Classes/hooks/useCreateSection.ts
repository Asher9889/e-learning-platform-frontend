import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSection } from "../api/classes.api";

export function useCreateSection() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createSection,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["classes"],
      });
    },
  });

  return {
    createSectionAsync:
      mutation.mutateAsync,

    isCreating:
      mutation.isPending,

    error: mutation.error,
  };
}