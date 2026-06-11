
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createClass } from "../api/classes.api";

export function useCreateClass() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createClass,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["classes"],
      });
    },
  });

  return {
    createClassAsync:
      mutation.mutateAsync,

    isCreating:
      mutation.isPending,

    error: mutation.error,
  };
}