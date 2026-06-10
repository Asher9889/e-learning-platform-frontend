// src/pages/Classes/hooks/useUpdateSection.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSection } from "../api/classes.api";

export function useUpdateSection() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateSection,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["classes"],
      });
    },
  });

  return {
    updateSectionAsync: mutation.mutateAsync,

    isUpdating: mutation.isPending,

    error: mutation.error,
  };
}