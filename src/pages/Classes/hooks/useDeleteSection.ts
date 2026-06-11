// src/pages/Classes/hooks/useDeleteSection.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSection } from "../api/classes.api";

export function useDeleteSection() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteSection,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["classes"],
      });
    },
  });

  return {
    deleteSectionAsync: mutation.mutateAsync,

    isDeleting: mutation.isPending,

    error: mutation.error,
  };
}