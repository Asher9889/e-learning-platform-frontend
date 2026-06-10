// src/pages/Classes/hooks/useUpdateClass.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClass } from "../api/classes.api";

export function useUpdateClass() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateClass,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["classes"],
      });
    },
  });

  return {
    updateClassAsync: mutation.mutateAsync,

    isUpdating: mutation.isPending,

    error: mutation.error,
  };
}