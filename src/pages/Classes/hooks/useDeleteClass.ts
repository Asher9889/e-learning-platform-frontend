// src/pages/Classes/hooks/useDeleteClass.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteClass } from "../api/classes.api";

export function useDeleteClass() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteClass,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["classes"],
      });
    },
  });

  return {
    deleteClassAsync: mutation.mutateAsync,

    isDeleting: mutation.isPending,

    error: mutation.error,
  };
}